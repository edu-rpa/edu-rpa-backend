import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'src/connection/entity/connection.entity';
import { ConnectionController } from './connection.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Connection])],
  providers: [ConnectionService],
  exports: [ConnectionService],
  controllers: [ConnectionController]
})
export class ConnectionModule {}
