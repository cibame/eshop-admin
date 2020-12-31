import {HttpService, Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectRepository} from '@nestjs/typeorm';
import {compareSync} from 'bcryptjs';
import {SentMessageInfo} from 'nodemailer';
import {Connection, Repository} from 'typeorm';
import {EntityNotFoundError} from 'typeorm/error/EntityNotFoundError';
import {MailerProvider} from '../../shared/mailer/mailer/mailer.provider';
import {ProfileUpdateDto} from './dto/profile-update.dto';
import {SignupDto} from './dto/signup.dto';
import {Credentials} from './entities/credentials.entity';
import {Profile, ProfileType} from './entities/profile.entity';
import {JwtPayload} from './strategy/jwt.payload';

@Injectable()
export class AuthService {
  private connection: Connection;

  constructor(
    @InjectRepository(Credentials)
    private readonly credentialsRepository: Repository<Credentials>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly mailerProvider: MailerProvider
  ) {
    this.connection = credentialsRepository.manager.connection;
  }

  static validatePassword(plainPassword: string, passwordHash: string): boolean {
    return compareSync(plainPassword, passwordHash);
  }

  static generateNumericString(): string {
    return Math.random()
      .toString(10)
      .substr(2, 6);
  }

  async view(id: number): Promise<Credentials> {
    return await this.credentialsRepository.findOneOrFail(id);
  }

  async create(dto: SignupDto): Promise<Credentials> {
    const entity = this.credentialsRepository.create();

    entity.email = dto.email;
    entity.code = AuthService.generateNumericString();
    entity.profile = new Profile();
    entity.profile.firstName = dto.firstName;
    entity.profile.lastName = dto.lastName;
    entity.profile.phone = dto.phone;
    entity.profile.email = dto.email;
    entity.profile.profileType = ProfileType.lite;

    await this.credentialsRepository.save(entity);
    await this.sendCodeEmail(entity, entity.code);

    return entity;
  }

  async update(id: string, dto: ProfileUpdateDto): Promise<Credentials> {
    const entity = await this.credentialsRepository.findOneOrFail(id);

    entity.email = dto.email;
    entity.profile.firstName = dto.firstName;
    entity.profile.lastName = dto.lastName;
    entity.profile.businessName = dto.businessName;
    entity.profile.phone = dto.phone;
    entity.profile.email = dto.email;

    await this.profileRepository.save(entity);

    return entity;
  }

  async reset(email: string): Promise<void> {
    const entity = await this.credentialsRepository.findOneOrFail({where: {email}});
    entity.code = AuthService.generateNumericString();

    await this.credentialsRepository.save(entity);
    await this.sendCodeEmail(entity, entity.code);
  }

  async checkCode(email: string, code: string): Promise<void> {
    await this.credentialsRepository.findOneOrFail({where: {email, code}});
  }

  async finalize(email: string, code: string, password): Promise<Credentials> {
    const entity = await this.credentialsRepository.findOneOrFail({where: {email, code}});

    entity.active = true;
    entity.password = password;
    entity.code = null;
    await this.credentialsRepository.save(entity);

    return entity;
  }

  async changePassword(id: number, newPassword: string): Promise<void> {
    const entity = await this.credentialsRepository.findOneOrFail(id);
    entity.password = newPassword;

    await this.credentialsRepository.save(entity);
  }

  async createJWT(email: string, password: string): Promise<string> {
    const entity = await this.credentialsRepository.findOneOrFail({where: {email, active: true, disabled: false}});

    if (AuthService.validatePassword(password, entity.password)) {
      const userPayload: JwtPayload = {
        email: entity.email
      };
      return this.jwtService.sign(userPayload);
    }

    throw new EntityNotFoundError(Credentials, 'Wrong password');
  }

  async validateJWT(jwt: JwtPayload): Promise<Credentials> {
    return await this.credentialsRepository.findOneOrFail({where: {email: jwt.email, active: true, disabled: false}});
  }

  private async sendCodeEmail(
    credentials: Credentials,
    code: string,
    reset?: boolean
  ): Promise<void> {
    try {
      await this.mailerProvider.send({
        to: credentials.email,
        // from: 'noreply@nestjs.com',
        subject: code + ' codice di verifica Cibame',
        template: reset ? 'reset' : 'finalize',
        params: {
          firstName: credentials.profile.firstName,
          lastName: credentials.profile.lastName,
          code
        }
      });
    }
    catch (err) {
      // TODO: handle errors
      console.log(err)
    }
  }
}
