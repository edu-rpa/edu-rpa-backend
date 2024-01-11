import { Module } from '@nestjs/common';
import { DocumentTemplateController } from './document-template.controller';
import { DocumentTemplateService } from './document-template.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTemplate as DocumentTemplateEntity } from './entity/document-template.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentTemplate, DocumentTemplateSchema } from './schema/document-template.schema';

@Module({
  controllers: [DocumentTemplateController],
  providers: [DocumentTemplateService],
  imports: [
    TypeOrmModule.forFeature([DocumentTemplateEntity]),
    MongooseModule.forFeature([{ name: DocumentTemplate.name, schema: DocumentTemplateSchema }]),
  ],
})
export class DocumentTemplateModule {}
