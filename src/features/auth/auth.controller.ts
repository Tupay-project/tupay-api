import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/register.auth.dto';
import { AuthLoginDto } from './dto/login.auth.dto';

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

  @Post('current-user')
  currentUser() {}

  @Post('logout')
  logout() {}
}
