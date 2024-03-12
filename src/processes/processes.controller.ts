import { Body, Controller, Delete, Get, Post, Put, Query, Param } from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';
import { ApiBody, ApiTags, ApiBearerAuth, ApiQuery, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';
import { SaveProcessDto } from './dto/save-process.dto';
import { ProcessDetail } from './schema/process.schema';

@Controller('processes')
@ApiTags('processes')
@ApiBearerAuth()
export class ProcessesController {
  constructor(
    private readonly processesService: ProcessesService
  ) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  async getProcesses(
    @UserDecor() user: UserPayload,
    @Query('limit') limit?: number,
    @Query('page') page?: number
  ) {
    return this.processesService.getProcesses(user.id, { page, limit });
  }

  @Get('/count')
  async getProcessesCount(@UserDecor() user: UserPayload) {
    return this.processesService.getProcessesCount(user.id);
  }

  @Post()
  async createProcess(
    @UserDecor() user: UserPayload,
    @Body() createProcessDto: CreateProcessDto
  ) {
    return await this.processesService.createProcess(user.id, createProcessDto);
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'The process detail',
    schema: {
      $ref: getSchemaPath(ProcessDetail),
    },
  })
  async getProcess(
    @UserDecor() user: UserPayload,
    @Param('id') processId: string
  ) {
    return await this.processesService.getProcess(user.id, processId);
  }

  @Put('/:id')
  async updateProcess(
    @UserDecor() user: UserPayload,
    @Param('id') processId: string,
    @Body() updateProcessDto: UpdateProcessDto
  ) {
    return await this.processesService.updateProcess(user.id, processId, updateProcessDto);
  }

  @Put('/:id/save')
  async saveProcess(
    @UserDecor() user: UserPayload,
    @Param('id') processId: string,
    @Body() saveProcessDto: SaveProcessDto
  ) {
    return await this.processesService.saveProcess(user.id, processId, saveProcessDto);
  }

  @Delete('/:id')
  async deleteProcess(
    @UserDecor() user: UserPayload,
    @Param('id') processId: string
  ) {
    return await this.processesService.deleteProcess(user.id, processId);
  }

  @Post('/:id/share')
  async shareProcess(
    @UserDecor() user: UserPayload,
    @Param('id') processId: string,
    @Body('emails') emails: string[]
  ) {
    return await this.processesService.shareProcess(user.id, processId, emails);
  }
}
