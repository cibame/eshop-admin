import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {AuthService} from '../auth.service';
import {JwtPayload} from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // TODO: use environment vars or config service
      secretOrKey: 'cibameSecretKey'
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateJWT(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
