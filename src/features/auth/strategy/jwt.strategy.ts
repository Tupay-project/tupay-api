import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { envs } from 'src/shared/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  //extra el header Autorization
      ignoreExpiration: false, // Ignorar tokens expirados
      secretOrKey: envs.JWT_ACCESS_TOKEN_SECRET, 
    });
  }

  async validate(payload: JwtPayload) {
    // Aquí puedes validar el payload del JWT
    const user = await this.authService.currentUser(payload.id);
    
    if (!user) {
      throw new UnauthorizedException();
    }

    return user; // Retorna el usuario si la validación es exitosa
  }
}
