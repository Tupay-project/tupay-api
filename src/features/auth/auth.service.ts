import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from '../user/entities/user.entity';
import { AuthRegisterDto } from './dto/register.auth.dto';
import { generateHash, compareHash } from 'src/shared/utils/handleBycrip';
import { Role } from '../role/entities/roles.entity';
import { AuthLoginDto } from './dto/login.auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,

        // 
        private readonly jwtService: JwtService,

    ) { }

    // Método para registrar un nuevo usuario
    public async registerUser(userBody: AuthRegisterDto): Promise<User> {
        console.log('Registro de usuario - Datos recibidos:', userBody);

        // Verificar si el email ya existe
        const existingUser = await this.userRepository.findOne({ where: { email: userBody.email } });
        if (existingUser) {
            console.log('Email ya registrado:', userBody.email);
            throw new BadRequestException('El email ya está en uso.');
        }

        try {
            // Encriptar la contraseña
            const hashedPassword = await generateHash(userBody.password);
            console.log('Contraseña encriptada:', hashedPassword);

            // Verifica si el rol "admin" existe, si no, lo crea
            let role = await this.roleRepository.findOne({ where: { name: 'user' } });
            if (!role) {
                console.log('Rol admin no encontrado, creando uno nuevo.');
                role = this.roleRepository.create({ name: 'user' });
                await this.roleRepository.save(role);
            }

            // Crear nuevo usuario con la contraseña encriptada y asignar el rol
            const newUser = this.userRepository.create({
                ...userBody,
                password: hashedPassword,
                roles: [role],
            });

            const savedUser = await this.userRepository.save(newUser);
            console.log('Usuario guardado en la base de datos:', savedUser);

            return savedUser;
        } catch (error) {
            console.error('Error en registerUser:', error);
            throw error;
        }
    }



    async loginUser(userLoginBody: AuthLoginDto) {
        const { password, email } = userLoginBody;
    
        // Buscar el usuario por email, incluyendo los roles y los permisos de esos roles
        const userExist = await this.userRepository.findOne({ 
            where: { email },
            relations: ['roles', 'roles.permissions'], // Incluir la relación de roles y sus permisos
        });
    
        if (!userExist) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    
        // Comparar la contraseña ingresada con la encriptada en la base de datos
        const isCheck = await compareHash(password, userExist.password);
        if (!isCheck) throw new HttpException('PASSWORD_INVALID', HttpStatus.FORBIDDEN);
    
        // Preparar el payload para el token
        const payload = {
            id: userExist.id,
            name: userExist.name,
        };
        const token = this.jwtService.sign(payload);
    
        // Preparar la respuesta con los roles y permisos
        const data = {
            token,
            id: userExist.id,
            email: userExist.email,
            roles: userExist.roles.map(role => ({
                name: role.name,
                permissions: role.permissions.map(permission => permission.name), 
            })),
        };
    
        return data;
    }
    
    public async currentUser() { }

    public async logout() { }
}
