import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'src/connection/entity/connection.entity';
import { ConnectionController } from './connection.controller';
import { GoogleModule } from 'src/google/google.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Connection]),
    GoogleModule,
  ],
  providers: [ConnectionService],
  exports: [ConnectionService],
  controllers: [ConnectionController]
})
export class ConnectionModule {}
