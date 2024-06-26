import { Body, Controller, Get, Param, Post, Query, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RobotService } from './robot.service';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';
import { CreateRobotDto } from './dto/create-robot.dto';
import { CreateRobotDtoV2 } from './dto/create-robot-v2.dto';

@Controller('robot')
@ApiTags('robot')
@ApiBearerAuth()
export class RobotController {
  constructor(
    private readonly robotService: RobotService
  ) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  async getRobots(
    @UserDecor() user: UserPayload,
    @Query('limit') limit?: number,
    @Query('page') page?: number
  ) {
    return this.robotService.getRobots(user.id, { page, limit });
  }

  @Get('/count')
  async getRobotsCount(@UserDecor() user: UserPayload) {
    return this.robotService.getRobotsCount(user.id);
  }

  @Post()
  async createRobot(
    @UserDecor() user: UserPayload,
    @Body() createRobotDto: CreateRobotDtoV2
  ) {
    return await this.robotService.createRobot(user.id, createRobotDto);
  }

  @Delete('/:id')
  async deleteRobot(
    @UserDecor() user: UserPayload,
    @Param('id') id: string
  ) {
    return this.robotService.deleteRobot(user.id, id);
  }
}
