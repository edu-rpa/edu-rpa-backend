import { Module } from '@nestjs/common';
import { DocumentTemplateController } from './document-template.controller';
import { DocumentTemplateService } from './document-template.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTemplate } from './entity/document-template.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentTemplateDetail, DocumentTemplateDetailSchema } from './schema/document-template.schema';

@Module({
  controllers: [DocumentTemplateController],
  providers: [DocumentTemplateService],
  imports: [
    TypeOrmModule.forFeature([DocumentTemplate]),
    MongooseModule.forFeature([{ name: DocumentTemplateDetail.name, schema: DocumentTemplateDetailSchema }]),
  ],
})
export class DocumentTemplateModule {}
