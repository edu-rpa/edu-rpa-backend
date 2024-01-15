import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticationProvider, User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { EmailAlreadyExistsException, FileTooLargeException } from 'src/common/exceptions';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { 
  S3Client,
  PutObjectCommand, 
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export type UserCreate = Pick<User, 'name' | 'email' | 'hashedPassword'>;
export type UserFromProvider = Pick<User, 'name' | 'email' | 'avatarUrl' | 'provider' | 'providerId'>;
export interface UserFromGoogle {
  id: string;
  displayName: string;
  emails: Array<{
    value: string;
  }>;
  photos: Array<{
    value: string;
  }>;
}
export const MAX_AVATAR_SIZE = 1024 * 1024 * 10; // 10MB

@Injectable()
export class UsersService {
  private readonly s3Client: S3Client;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    this.s3Client = new S3Client({ region: configService.get('AWS_REGION') });
  }

  async findOneByEmail(email: string, options?: {
    exclude: Array<keyof User>
  }): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      return null;
    }
    if (options?.exclude) {
      options.exclude.forEach((key) => {
        delete user[key];
      });
    }
    return user;
  }

  async create(user: UserCreate | UserFromProvider): Promise<User> {
    return this.usersRepository.save(user);
  }

  async findOrCreateGoogleUser({
    id,
    displayName,
    emails,
    photos,
  }: UserFromGoogle): Promise<User> {
    const email = emails[0].value;
    const avatarUrl = photos[0].value;

    let user = await this.findOneByEmail(email);
    if (!user) {
      user = await this.create({
        name: displayName,
        email,
        avatarUrl,
        provider: AuthenticationProvider.GOOGLE,
        providerId: id,
      });
    } else if (user.provider !== AuthenticationProvider.GOOGLE) {
      throw new EmailAlreadyExistsException();
    }
    return user;
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      return null;
    }
    user.name = updateProfileDto.name;
    return this.usersRepository.save(user);
  }

  async uploadAvatar(userId: number, file: Express.Multer.File) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      return null;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      throw new FileTooLargeException();
    }

    const bucket = this.configService.get('AWS_S3_PUBLIC_BUCKET_NAME');
    const region = this.configService.get('AWS_REGION');
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: `avatars/${userId}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await this.s3Client.send(command);

    user.avatarUrl = `https://${bucket}.s3.${region}.amazonaws.com/avatars/${userId}`;
    return this.usersRepository.save(user);
  }
}
