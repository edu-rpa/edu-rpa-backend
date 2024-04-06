import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import Strategy from 'passport-headerapikey';

@Injectable()
export class RobotInstanceStrategy extends PassportStrategy(Strategy, 'robot-instance') {
    constructor(
        private readonly configService: ConfigService
    ) {
        super({ header: 'Service-Key', prefix: '' },
        true,
        async (apiKey: string, done: (error: Error, data: any) => {}) => {
            return this.validate(apiKey, done);
        });
    }

    public validate = (apiKey: string, done: (error: Error, data) => {}) => {
        if (this.configService.get<string>('API_KEY') === apiKey) {
            done(null, true);
        }
        done(new UnauthorizedException(), null);
    }
}