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
 async currentUser(@Req() req:Request) {
  
    const user = req.user; // Esto viene del JwtGuard
    console.log('Request', user);


    if (!user) {
      return { message: 'Usuario no autenticado' };
    }

    // Llamada al servicio para obtener los detalles del usuario
    const userDetails = await this.authService.currentUser(user.id);
    if (!userDetails) {
      return { message: 'Usuario no encontrado' };
    }

    return userDetails;
  
  
  }

  @Post('logout')
  logout() {}
}
