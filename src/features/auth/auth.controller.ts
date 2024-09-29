import { Body, Controller, Get, Post, UseGuards,Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/register.auth.dto';
import { AuthLoginDto } from './dto/login.auth.dto';
import { JwtGuard } from './guards/auth.guard';
import { Request } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  hanldeRegister(@Body() registerBody: AuthRegisterDto) {
    console.log('Petición de registro recibida:', registerBody); 
    return this.authService.registerUser(registerBody);
  }

  @Post('login')
  hanldeLogin(@Body() loginBody: AuthLoginDto) {
    console.log('Petición de loginBody recibida:', loginBody); 

    return this.authService.loginUser(loginBody)
  }

  @UseGuards(JwtGuard)
  @Get('current-user')
  currentUser(@Req() req:Request) {
  
    console.log('Request',req.user)
  }

  @Post('logout')
  logout() {}
}
