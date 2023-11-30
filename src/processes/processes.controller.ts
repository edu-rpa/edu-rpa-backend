import { Body, Controller, Delete, Get, Post, Put, Query, Param } from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';
import { SaveProcessDto } from './dto/save-process.dto';

@Controller('processes')
@ApiTags('processes')
export class ProcessesController {
  constructor(
    private readonly processesService: ProcessesService
  ) {}

  @Get()
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        xml: {
          type: 'string',
        },
      },
    },
  })
  async createProcess(
    @UserDecor() user: UserPayload,
    @Body() createProcessDto: CreateProcessDto
  ) {
    return await this.processesService.createProcess(user.id, createProcessDto);
  }

  @Get('/:id')
  async getProcess(
    @UserDecor() user: UserPayload,
    @Param('id') processId: number
  ) {
    return await this.processesService.getProcess(user.id, processId);
  }

  @Put('/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
      },
    },
  })
  async updateProcess(
    @UserDecor() user: UserPayload,
    @Param('id') processId: number,
    @Body() updateProcessDto: UpdateProcessDto
  ) {
    return await this.processesService.updateProcess(user.id, processId, updateProcessDto);
  }

  @Put('/:id/save')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        xml: {
          type: 'string',
        },
        variables: {
          type: 'object',
        },
        activities: {
          type: 'array',
        },
      },
    },
  })
  async saveProcess(
    @UserDecor() user: UserPayload,
    @Param('id') processId: number,
    @Body() saveProcessDto: SaveProcessDto
  ) {
    return await this.processesService.saveProcess(user.id, processId, saveProcessDto);
  }

  @Delete('/:id')
  async deleteProcess(
    @UserDecor() user: UserPayload,
    @Param('id') processId: number
  ) {
    return await this.processesService.deleteProcess(user.id, processId);
  }
}
