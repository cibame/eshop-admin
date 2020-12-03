import { Controller, Get, Res } from '@nestjs/common';

@Controller('')
export class AdminController {
  @Get()
  redirect(@Res() res) {
    return res.redirect('/admin');
  }
}
