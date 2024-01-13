import { Controller, Get, Query } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';
import { AuthorizationProvider } from 'src/connection/entity/connection.entity';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('connection')
@ApiTags('connection')
@ApiBearerAuth()
export class ConnectionController {
  constructor(
    private readonly connectionService: ConnectionService
  ) {}

  @Get()
  @ApiQuery({ name: 'provider', enum: AuthorizationProvider, required: false })
  async getConnections(@UserDecor() user: UserPayload, @Query('provider') provider?: AuthorizationProvider) {
    return this.connectionService.getConnections(user.id, provider);
  }
}
