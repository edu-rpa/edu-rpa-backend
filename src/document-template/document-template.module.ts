import { Module } from '@nestjs/common';
import { DocumentTemplateController } from './document-template.controller';
import { DocumentTemplateService } from './document-template.service';

@Module({
  controllers: [DocumentTemplateController],
  providers: [DocumentTemplateService]
})
export class DocumentTemplateModule {}
