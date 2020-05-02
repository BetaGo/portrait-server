import { Module } from '@nestjs/common';
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { GeolocationModule } from './geolocation/geolocation.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<GqlModuleOptions> => ({
        debug: configService.get('NODE_ENV') !== 'production',
        playground: configService.get('NODE_ENV') !== 'production',
        // typePaths: ['./**/*.graphql'],
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        installSubscriptionHandlers: true,
        context: ({ req, res }) => ({ req, res }),
        buildSchemaOptions: {
          dateScalarMode: 'timestamp',
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CommonModule,
    UsersModule,
    // GeolocationModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<MysqlConnectionOptions> => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [join(__dirname, '**/**.entity{.ts,.js}')],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
