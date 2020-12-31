import {IsIn} from 'class-validator';
import {ProfileType} from '../entities/profile.entity';

export class SignupParam {
  @IsIn(Object.values(ProfileType).map((o: string) => o.toLowerCase()))
  profileType: string;
}
