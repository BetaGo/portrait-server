import dotenv from 'dotenv';
import Joi from '@hapi/joi';
import fs from 'fs';

import { dotenvFiles } from './config.env';

export interface EnvConfig {
  [key: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    const config = dotenvFiles.reduce((a, b) => {
      let conf = {};
      if (fs.existsSync(b as string)) {
        conf = dotenv.parse(fs.readFileSync(b as string));
      }
      return { ...conf, ...a };
    }, {});
    this.envConfig = this.validateInput(config);
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
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

      GITHUB_CLIENT_ID: Joi.string().required(),
      GITHUB_CLIENT_SECRET: Joi.string().required(),
      GITHUB_CALLBACK_URL: Joi.string()
        .uri()
        .required(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}
