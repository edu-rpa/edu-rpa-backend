import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionModule } from './connection/connection.module';
import { ActivityPackagesModule } from './activity-packages/activity-packages.module';
import { ProcessesModule } from './processes/processes.module';
import { resolve } from 'path';
import { DocumentTemplateModule } from './document-template/document-template.module';
import { RobotModule } from './robot/robot.module';
import { GoogleModule } from './google/google.module';
import { GoogleFormsModule } from './google-forms/google-forms.module';
import { NotificationModule } from './notification/notification.module';
import { LogModule } from './log/log.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskScheduleModule } from './task-schedule/task-schedule.module';
import { RobotReportModule } from './robot-report/robot-report.module';

const ENV_FILE_PATH =
  process.env.NODE_ENV === 'production'
    ? resolve(__dirname, '../../env/.env.production')
    : resolve(__dirname, '../../env/.env');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV_FILE_PATH,
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USERNAME'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        autoLoadEntities: true,
        migrations: [resolve(__dirname, 'migrations/*{.ts,.js}')],
        migrationsRun: false,
        synchronize: false, // WARNING: set to false on production! As it will drop all tables and re-create them if entities changed.
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forRootAsync({
      name: 'report',
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USERNAME'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_REPORT_DATABASE'),
        migrations: [resolve(__dirname, 'migrations/*{.ts,.js}')],
        migrationsRun: false,
        synchronize: false, // WARNING: set to false on production! As it will drop all tables and re-create them if entities changed.
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),

    ScheduleModule.forRoot(),

    UsersModule,
    AuthModule,
    EmailModule,
    ConnectionModule,
    ActivityPackagesModule,
    ProcessesModule,
    DocumentTemplateModule,
    RobotModule,
    GoogleModule,
    GoogleFormsModule,
    NotificationModule,
    LogModule,
    TaskScheduleModule,
    RobotReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
