import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection, RobotConnection } from 'src/connection/entity/';
import { ConnectionController } from './connection.controller';
import { GoogleModule } from 'src/google/google.module';
import { Robot } from 'src/robot/entity/robot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Connection, RobotConnection, Robot]),
    GoogleModule,
  ],
  providers: [ConnectionService],
  exports: [ConnectionService],
  controllers: [ConnectionController]
})
export class ConnectionModule {}
