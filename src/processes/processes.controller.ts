import { Controller, Get, Query } from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';
import { ApiTags } from '@nestjs/swagger';

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
}
