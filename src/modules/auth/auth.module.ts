import {HttpModule, Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SharedModule} from '../../shared/shared.module';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {Credentials} from './entities/credentials.entity';
import {Profile} from './entities/profile.entity';
import {JwtStrategy} from './strategy/jwt.strategy';

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          // TODO: use environment vars or config service
          secret: 'cibameSecretKey',
          signOptions: { expiresIn: 86400 },
        };
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Credentials, Profile]),
    SharedModule
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
