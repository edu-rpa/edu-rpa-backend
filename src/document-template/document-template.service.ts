import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentTemplate, DocumentTemplateType } from './entity/document-template.entity';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentTemplateDetail } from './schema/document-template.schema';
import { Model } from 'mongoose';
import { CreateDocumentTemplateDto } from './dto/create-document-template.dto';
import { DocumentTemplateNotFoundException } from 'src/common/exceptions';
import { UpdateDocumentTemplateDto } from './dto/update-document-template.dto';
import { SaveDocumentTemplateDto } from './dto/save-document-template.dto';
import { 
  S3Client,
  DeleteObjectCommand,
  ListObjectsV2Command, 
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DocumentTemplateService {
  private readonly s3Client: S3Client;

  constructor(
    @InjectRepository(DocumentTemplate)
    private documentTemplateRepository: Repository<DocumentTemplate>,
    @InjectModel(DocumentTemplateDetail.name) 
    private documentTemplateDetailModel: Model<DocumentTemplateDetail>,
    private configService: ConfigService,
  ) {
    this.s3Client = new S3Client({ region: configService.get('AWS_REGION') });
  }

  async getDocumentTemplates(userId: number, options?: {
    limit?: number;
    page?: number;
    type?: DocumentTemplateType;
  }) {
    const {limit, page, type} = options
    const findOptions = {
      where: { 
        userId,
       },
    };
    if(type && type.length != 0) {
      findOptions.where["type"] = type
    }
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
      dataTemplate: {}
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

    await this.deleteDocumentTemplateFromS3(documentTemplateId);

    await this.documentTemplateDetailModel.findByIdAndDelete(documentTemplateId);
    return this.documentTemplateRepository.remove(documentTemplate);
  }

  private async deleteDocumentTemplateFromS3(documentTemplateId: string) {
    const bucketName = 'edurpa-document-template';
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: documentTemplateId,
    });

    const listResponse = await this.s3Client.send(listCommand);
    if (!listResponse.Contents) {
      return;
    }

    const deleteCommands = listResponse.Contents.map((content) => {
      return new DeleteObjectCommand({
        Bucket: bucketName,
        Key: content.Key,
      });
    });

    await Promise.all(deleteCommands.map((command) => this.s3Client.send(command)));
  }
}
