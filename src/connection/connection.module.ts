import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'src/entities/connection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Connection])],
  providers: [ConnectionService],
  exports: [ConnectionService]
})
export class ConnectionModule {}
