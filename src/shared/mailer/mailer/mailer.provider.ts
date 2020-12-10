import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

export interface SendMailOptions {
  to: string;
  subject: string;
  template: string;
  params: any;
}

@Injectable()
export class MailerProvider {
  constructor(private readonly mailerService: MailerService) {}

  public send(options: SendMailOptions) {
    return this.mailerService.sendMail({
      to: options.to,
      subject: options.subject,
      template: options.template,
      context: options.params,
    });
  }
}
