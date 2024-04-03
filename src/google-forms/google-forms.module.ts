import { Module } from '@nestjs/common';
import { GoogleFormsController } from './google-forms.controller';
import { GoogleFormsService } from './google-forms.service';
import { GoogleModule } from 'src/google/google.module';
import { ConnectionModule } from 'src/connection/connection.module';

@Module({
  controllers: [GoogleFormsController],
  providers: [GoogleFormsService],
  imports: [
    GoogleModule,
    ConnectionModule,
  ],
})
export class GoogleFormsModule {}
