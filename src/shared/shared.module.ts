import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerProvider } from './mailer/mailer/mailer.provider';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      // TODO: find a good email catcher for this service
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get<string>('EMAIL_HOST'),
            port: configService.get<string>('EMAIL_PORT'),
            secure: false,
            auth: {
              user: configService.get<string>('EMAIL_USER'),
              pass: configService.get<string>('EMAIL_PASS'),
            },
          },
          defaults: {
            from: configService.get<string>('SHOP_EMAIL'),
          },
          preview:
            configService.get<string>('NODE_ENV') === 'production'
              ? false
              : true,
          template: {
            dir: process.cwd() + '/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [MailerProvider],
  exports: [MailerProvider],
})
export class SharedModule {}
