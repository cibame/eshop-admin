import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiServiceUnavailableResponse,
  ApiTags
} from '@nestjs/swagger';
import {AuthService} from './auth.service';
import {ChangePasswordDto} from './dto/change-password.dto';
import {CheckCodeDto} from './dto/check-code.dto';
import {FinalizeDto} from './dto/finalize.dto';
import {LoginDto} from './dto/login.dto';
import {ProfileUpdateDto} from './dto/profile-update.dto';
import {ResetPasswordDto} from './dto/reset-password.dto';
import {SignupDto} from './dto/signup.dto';
import {Credentials} from './entities/credentials.entity';
import {JwtModel} from './models/jwt.model';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {
  }

  @Post('login')
  @ApiCreatedResponse({description: 'The JWT has been successfully created.', type: JwtModel})
  @ApiResponse({status: 401, description: 'Invalid credentials'})
  async logIn(@Req() request, @Body() body: LoginDto): Promise<JwtModel> {
    const jwt = await this.authService
      .createJWT(body.email, body.password)
      .catch(err => {
        console.log(err);
        throw new UnauthorizedException();
      });
    return {jwt};
  }

  @Get('me')
  @ApiOkResponse({description: 'Entity found.'})
  @ApiNotFoundResponse({description: 'Entity not found.'})
  @UseGuards(AuthGuard())
  async view(
    @Req() request
  ): Promise<Credentials> {
    return await this.authService.view(request.user.id);
  }

  @Post('check-code')
  @HttpCode(200)
  @ApiOkResponse({description: 'Credentials activated.'})
  @ApiNotFoundResponse({description: 'Code not valid.'})
  async checkCode(@Req() request, @Body() body: CheckCodeDto): Promise<void> {
    return this.authService.checkCode(body.email, body.code);
  }

  @Post('finalize')
  @ApiOkResponse({description: 'Credentials activated.', type: Credentials})
  @ApiNotFoundResponse({description: 'Credentials not found.'})
  @ApiServiceUnavailableResponse({description: 'MQTT not available.'})
  async finalize(@Req() request, @Body() body: FinalizeDto): Promise<JwtModel> {
    await this.authService.finalize(body.email, body.code, body.password);

    const jwt = await this.authService.createJWT(body.email, body.password);

    return {jwt};
  }

  @Put('/change-password')
  @HttpCode(204)
  @ApiOkResponse({description: 'Credentials password successfully updated.', type: Credentials})
  @ApiForbiddenResponse({description: 'Forbidden operation: wrong old password.'})
  @UseGuards(AuthGuard())
  async changePassword(@Req() request, @Body() body: ChangePasswordDto): Promise<void> {
    const loggedUser = request.user;
    if (!AuthService.validatePassword(body.oldPassword, loggedUser.password)) {
      throw new ForbiddenException();
    }

    return this.authService.changePassword(loggedUser.id, body.newPassword);
  }

  @Post('reset')
  @HttpCode(204)
  @ApiOkResponse({description: 'Credentials reset.'})
  @ApiNotFoundResponse({description: 'Credentials not found.'})
  async reset(@Req() request, @Body() body: ResetPasswordDto): Promise<void> {
    await this.authService.reset(body.email);
  }

  @Put()
  @ApiOkResponse({description: 'Credentials successfully updated.', type: Credentials})
  @UseGuards(AuthGuard())
  async updateAccount(
    @Req() request,
    @Body() body: ProfileUpdateDto
  ): Promise<Credentials> {
    return this.authService.update(request.user.id, body);
  }

  @Post('/signup')
  @ApiCreatedResponse({description: 'The entity has been successfully created.', type: Credentials})
  @ApiConflictResponse({description: 'Entity already exists.'})
  @ApiBadRequestResponse({description: 'Bad request.'})
  @ApiForbiddenResponse({description: 'Email already in use.'})
  async createSeller(@Req() request, @Body() body: SignupDto): Promise<Credentials> {
    try {
      return await this.authService.create(body);
    } catch (err) {
      // TODO: fix errors
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(err.message);
      } else if (err.message.statusCode === 403) {
        throw err;
      } else {
        throw new BadRequestException(err.message);
      }
    }
  }
}
