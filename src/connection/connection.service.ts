import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UnableToCreateConnectionException,
  ConnectionNotFoundException,
  CannotRefreshToken,
} from 'src/common/exceptions';
import { Connection, AuthorizationProvider } from 'src/connection/entity/connection.entity';
import { Repository } from 'typeorm';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface UserTokenFromProvider {
  accessToken: string;
  refreshToken: string;
  profile: any;
}

export interface CreateConnectionDto {
  provider: AuthorizationProvider;
  fromUser: number;
  accessToken: string;
  refreshToken: string;
  email?: string;
}

@Injectable()
export class ConnectionService {
  oauth2Clients: Record<string, OAuth2Client>;

  constructor(
    @InjectRepository(Connection)
    private connectionRepository: Repository<Connection>,
    readonly configService: ConfigService,
  ) {
    this.oauth2Clients = {
      [AuthorizationProvider.G_DRIVE]: new google.auth.OAuth2(
        configService.get('GOOGLE_DRIVE_CLIENT_ID'),
        configService.get('GOOGLE_DRIVE_CLIENT_SECRET'),
        configService.get('GOOGLE_DRIVE_CALLBACK_URL'),
      ),
      [AuthorizationProvider.G_SHEETS]: new google.auth.OAuth2(
        configService.get('GOOGLE_SHEETS_CLIENT_ID'),
        configService.get('GOOGLE_SHEETS_CLIENT_SECRET'),
        configService.get('GOOGLE_SHEETS_CALLBACK_URL'),
      ),
      [AuthorizationProvider.G_GMAIL]: new google.auth.OAuth2(
        configService.get('GMAIL_CLIENT_ID'),
        configService.get('GMAIL_CLIENT_SECRET'),
        configService.get('GMAIL_CALLBACK_URL'),
      ),
      [AuthorizationProvider.G_CLASSROOM]: new google.auth.OAuth2(
        configService.get('GOOGLE_CLASSROOM_CLIENT_ID'),
        configService.get('GOOGLE_CLASSROOM_CLIENT_SECRET'),
        configService.get('GOOGLE_CLASSROOM_CALLBACK_URL'),
      ),
      [AuthorizationProvider.G_FORMS]: new google.auth.OAuth2(
        configService.get('GOOGLE_FORMS_CLIENT_ID'),
        configService.get('GOOGLE_FORMS_CLIENT_SECRET'),
        configService.get('GOOGLE_FORMS_CALLBACK_URL'),
      ),
    };
  }

  async createConnection(
    createConnectionDto: CreateConnectionDto,
    options?: { reconnect?: boolean },
  ) {
    if (!options.reconnect) {
      await this.checkIfAbleToCreateConnection(createConnectionDto);

      const connection = await this.connectionRepository.save({
        provider: createConnectionDto.provider,
        userId: createConnectionDto.fromUser,
        name: createConnectionDto.email ? createConnectionDto.email : Date.now().toString(),
        accessToken: createConnectionDto.accessToken,
        refreshToken: createConnectionDto.refreshToken,
      });
      return connection;
    } else {
      const connection = await this.connectionRepository.findOneBy({
        provider: createConnectionDto.provider,
        userId: createConnectionDto.fromUser,
        name: createConnectionDto.email,
      });

      if (!connection) {
        throw new ConnectionNotFoundException();
      }

      connection.accessToken = createConnectionDto.accessToken;
      connection.refreshToken = createConnectionDto.refreshToken;
      await this.connectionRepository.save(connection);
      return connection;
    }
  }

  async getConnections(userId: number, provider?: AuthorizationProvider) {
    let whereString = 'connection.userId = :userId';
    if (provider) {
      whereString += ' AND connection.provider = :provider';
    }
    return this.connectionRepository
      .createQueryBuilder('connection')
      .select(['connection.provider', 'connection.name', 'connection.createdAt'])
      .where(whereString, { userId, provider })
      .getMany();
  }

  async getConnection(
    userId: number,
    query: {
      provider: AuthorizationProvider;
      name: string;
    },
  ) {
    const connection = await this.connectionRepository.findOneBy({
      userId,
      provider: AuthorizationProvider[query.provider],
      name: query.name,
    });
    return connection;
  }

  private async checkIfAbleToCreateConnection(createConnectionDto: CreateConnectionDto) {
    if (!createConnectionDto.email) return;

    const existingConnection = await this.connectionRepository.findOneBy({
      provider: createConnectionDto.provider,
      userId: createConnectionDto.fromUser,
      name: createConnectionDto.email,
    });

    if (existingConnection) {
      throw new UnableToCreateConnectionException();
    }
  }

  async refreshToken(userId: number, provider: AuthorizationProvider, name: string) {
    const connection = await this.connectionRepository.findOneBy({
      userId,
      provider,
      name,
    });

    if (!connection) {
      throw new ConnectionNotFoundException();
    }

    const oauth2Client = this.oauth2Clients[provider];
    oauth2Client.setCredentials({
      access_token: connection.accessToken,
      refresh_token: connection.refreshToken,
    });

    try {
      const res = await oauth2Client.refreshAccessToken();
      return 'Refresh token sucessfully';
    } catch {
      throw new CannotRefreshToken();
    }
  }

  async removeConnection(userId: number, provider: AuthorizationProvider, name: string) {
    const connection = await this.connectionRepository.findOneBy({
      userId,
      provider,
      name,
    });

    if (!connection) {
      throw new ConnectionNotFoundException();
    }

    await this.revokeToken(connection.refreshToken);
    await this.connectionRepository.delete({
      userId,
      provider,
      name,
    });
  }

  private async revokeToken(refreshToken: string) {
    const url = `https://oauth2.googleapis.com/revoke?token=${refreshToken}`;

    const res = await axios.post(url, null, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return res;
  }
}
