import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiTags, ApiBearerAuth, ApiQuery, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { GoogleFormsService } from './google-forms.service';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';

@Controller('google-forms')
@ApiTags('google-forms')
@ApiBearerAuth()
export class GoogleFormsController {
  constructor(
    private readonly googleFormsService: GoogleFormsService
  ) {}

  @Get()
  @ApiQuery({ name: 'connectionName', required: true })
  async getForms(
    @UserDecor() user: UserPayload,
    @Query('connectionName') connectionName: string,
  ) {
    return this.googleFormsService.getForms(user.id, connectionName);
  }
}
