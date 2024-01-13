import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentTemplate } from './entity/document-template.entity';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentTemplateDetail } from './schema/document-template.schema';
import { Model } from 'mongoose';
import { CreateDocumentTemplateDto } from './dto/create-document-template.dto';
import { DocumentTemplateNotFoundException } from 'src/common/exceptions';
import { UpdateDocumentTemplateDto } from './dto/update-document-template.dto';
import { SaveDocumentTemplateDto } from './dto/save-document-template.dto';

@Injectable()
export class DocumentTemplateService {
  constructor(
    @InjectRepository(DocumentTemplate)
    private documentTemplateRepository: Repository<DocumentTemplate>,
    @InjectModel(DocumentTemplateDetail.name) 
    private documentTemplateDetailModel: Model<DocumentTemplateDetail>,
  ) {}

  async getDocumentTemplates(userId: number, options?: {
    limit?: number;
    page?: number;
  }) {
    const findOptions = {
      where: { userId },
    };
    if (options?.limit) {
      findOptions['take'] = options.limit;
    }
    if (options?.page) {
      findOptions['skip'] = (options.page - 1) * options.limit;
    }

    return this.documentTemplateRepository.find(findOptions);
  }

  async getDocumentTemplatesCount(userId: number) {
    return this.documentTemplateRepository.count({ where: { userId } });
  }

  async createDocumentTemplate(userId: number, createDocumentTemplateDto: CreateDocumentTemplateDto) {
    const documentTemplateEntity = await this.documentTemplateRepository.save({
      name: createDocumentTemplateDto.name,
      description: createDocumentTemplateDto.description,
      type: createDocumentTemplateDto.type,
      userId,
    });

    const documentTemplateDetail = new this.documentTemplateDetailModel({
      _id: documentTemplateEntity.id,
      dataTemplate: []
    });

    await documentTemplateDetail.save();

    return documentTemplateEntity;
  }

  async getDocumentTemplate(userId: number, documentTemplateId: string) {
    const documentTemplate = await this.documentTemplateRepository.findOne({
      where: { id: documentTemplateId, userId },
    });
    if (!documentTemplate) {
      throw new DocumentTemplateNotFoundException();
    }
    return this.documentTemplateDetailModel.findById(documentTemplateId);
  }

  async updateDocumentTemplate(userId: number, documentTemplateId: string, updateDocumentTemplateDto: UpdateDocumentTemplateDto) {
    const documentTemplate = await this.documentTemplateRepository.findOne({
      where: { id: documentTemplateId, userId },
    });
    if (!documentTemplate) {
      throw new DocumentTemplateNotFoundException();
    }
    return this.documentTemplateRepository.save({
      ...documentTemplate,
      ...updateDocumentTemplateDto,
    });
  }

  async saveDocumentTemplate(userId: number, documentTemplateId: string, saveDocumentTemplateDto: SaveDocumentTemplateDto) {
    const documentTemplate = await this.documentTemplateRepository.findOne({
      where: { id: documentTemplateId, userId },
    });
    if (!documentTemplate) {
      throw new DocumentTemplateNotFoundException();
    }
    return this.documentTemplateDetailModel.findByIdAndUpdate(documentTemplateId, saveDocumentTemplateDto);
  }

  async deleteDocumentTemplate(userId: number, documentTemplateId: string) {
    const documentTemplate = await this.documentTemplateRepository.findOne({
      where: { id: documentTemplateId, userId },
    });
    if (!documentTemplate) {
      return;
    }
    await this.documentTemplateDetailModel.findByIdAndDelete(documentTemplateId);
    return this.documentTemplateRepository.remove(documentTemplate);
  }
}
