import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiTags, ApiBearerAuth, ApiQuery, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { DocumentTemplateService } from './document-template.service';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';
import { CreateDocumentTemplateDto } from './dto/create-document-template.dto';
import { UpdateDocumentTemplateDto } from './dto/update-document-template.dto';
import { SaveDocumentTemplateDto } from './dto/save-document-template.dto';
import { DocumentTemplateDetail } from './schema/document-template.schema';

@Controller('document-template')
@ApiTags('document-template')
@ApiBearerAuth()
export class DocumentTemplateController {
  constructor(
    private readonly documentTemplateService: DocumentTemplateService
  ) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  async getDocumentTemplates(
    @UserDecor() user: UserPayload,
    @Query('limit') limit?: number,
    @Query('page') page?: number
  ) {
    return this.documentTemplateService.getDocumentTemplates(user.id, { page, limit });
  }

  @Get('/count')
  async getDocumentTemplatesCount(@UserDecor() user: UserPayload) {
    return this.documentTemplateService.getDocumentTemplatesCount(user.id);
  }

  @Post()
  async createDocumentTemplate(
    @UserDecor() user: UserPayload,
    @Body() createProcessDto: CreateDocumentTemplateDto
  ) {
    return await this.documentTemplateService.createDocumentTemplate(user.id, createProcessDto);
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'The document template detail',
    schema: {
      $ref: getSchemaPath(DocumentTemplateDetail),
    },
  })
  async getDocumentTemplate(
    @UserDecor() user: UserPayload,
    @Param('id') documentTemplateId: string
  ) {
    return await this.documentTemplateService.getDocumentTemplate(user.id, documentTemplateId);
  }

  @Put('/:id')
  async updateDocumentTemplate(
    @UserDecor() user: UserPayload,
    @Param('id') documentTemplateId: string,
    @Body() updateDocumentTemplateDto: UpdateDocumentTemplateDto
  ) {
    return await this.documentTemplateService.updateDocumentTemplate(user.id, documentTemplateId, updateDocumentTemplateDto);
  }

  @Put('/:id/save')
  async saveDocumentTemplate(
    @UserDecor() user: UserPayload,
    @Param('id') documentTemplateId: string,
    @Body() saveDocumentTemplateDto: SaveDocumentTemplateDto
  ) {
    return await this.documentTemplateService.saveDocumentTemplate(user.id, documentTemplateId, saveDocumentTemplateDto);
  }

  @Delete('/:id')
  async deleteDocumentTemplate(
    @UserDecor() user: UserPayload,
    @Param('id') documentTemplateId: string
  ) {
    return await this.documentTemplateService.deleteDocumentTemplate(user.id, documentTemplateId);
  }
}
