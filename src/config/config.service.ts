import dotenv from 'dotenv';
import Joi from '@hapi/joi';
import fs from 'fs';
import crypto, { KeyObject } from 'crypto';

import { dotenvFiles } from './config.env';

export interface EnvConfig {
  NODE_ENV: string;
  PORT: number;

  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;

  SECRET: string;
  LOGIN_RSA_PASSPHRASE: string;

  JWT_EXPIRES_IN: number;
  REFRESH_TOKEN_EXPIRES_IN: number;
  LOGIN_TOKEN_EXPIRES_IN: number;

  LOGIN_PUBLIC_RSA_KEY: KeyObject;
  LOGIN_PRIVATE_RSA_KEY: KeyObject;

  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_CALLBACK_URL: string;
  [key: string]: any;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    const config = dotenvFiles.reduce(
      (a, b) => {
        let conf = {};
        if (fs.existsSync(b as string)) {
          conf = dotenv.parse(fs.readFileSync(b as string));
        }
        return { ...conf, ...a };
      },
      {
        NODE_ENV: process.env.NODE_ENV,
      },
    );
    this.envConfig = this.validateInput(config);
  }

  get<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
    return this.envConfig[key];
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: {}): EnvConfig {
    console.log('=== envConfig', envConfig);
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
      PORT: Joi.number().default(3000),

      DATABASE_USER: Joi.string().required(),
      DATABASE_PASSWORD: Joi.string().required(),
      DATABASE_NAME: Joi.string().required(),
      DATABASE_HOST: Joi.string().required(),
      DATABASE_PORT: Joi.number().default(3306),

      SECRET: Joi.string().required(),
      LOGIN_RSA_PASSPHRASE: Joi.string().required(),

      // jwt 鉴权过期时间配置, 单位秒(s)
      JWT_EXPIRES_IN: Joi.number()
        .integer()
        .default(30 * 60),

      // redis 中 key 的过期时间, 单位毫米(ms)
      REFRESH_TOKEN_EXPIRES_IN: Joi.number()
        .integer()
        .default(7 * 24 * 60 * 60 * 1000),
      LOGIN_TOKEN_EXPIRES_IN: Joi.number()
        .integer()
        .default(5 * 60 * 1000),

      GITHUB_CLIENT_ID: Joi.string().required(),
      GITHUB_CLIENT_SECRET: Joi.string().required(),
      GITHUB_CALLBACK_URL: Joi.string().uri().required(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    if (!fs.existsSync('keys')) {
      fs.mkdirSync('keys');
    }
    if (
      !fs.existsSync('keys/login-public.pem') ||
      !fs.existsSync('keys/login-private.pem')
    ) {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: validatedEnvConfig.LOGIN_RSA_PASSPHRASE,
        },
      });
      fs.writeFileSync('keys/login-public.pem', publicKey);
      fs.writeFileSync('keys/login-private.pem', privateKey);
      validatedEnvConfig.LOGIN_PUBLIC_RSA_KEY = crypto.createPublicKey(
        publicKey,
      );
      validatedEnvConfig.LOGIN_PRIVATE_RSA_KEY = crypto.createPrivateKey({
        key: privateKey,
        passphrase: validatedEnvConfig.LOGIN_RSA_PASSPHRASE,
      });
    } else {
      const publicKey = fs.readFileSync('keys/login-public.pem').toString();
      const privateKey = fs.readFileSync('keys/login-private.pem').toString();
      validatedEnvConfig.LOGIN_PUBLIC_RSA_KEY = crypto.createPublicKey(
        publicKey,
      );
      validatedEnvConfig.LOGIN_PRIVATE_RSA_KEY = crypto.createPrivateKey({
        key: privateKey,
        passphrase: validatedEnvConfig.LOGIN_RSA_PASSPHRASE,
      });
    }
    return validatedEnvConfig;
  }
}
