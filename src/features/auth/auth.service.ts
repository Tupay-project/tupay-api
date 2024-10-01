import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { v4 as uuidv4 } from 'uuid';

import { User } from '../user/entities/user.entity';
import { AuthRegisterDto } from './dto/register.auth.dto';
import { generateHash, compareHash } from 'src/shared/utils/handleBycrip';
import { Role } from '../role/entities/roles.entity';
import { AuthLoginDto } from './dto/login.auth.dto';
import { UserRole } from 'src/shared/enum/roles.enum';

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
    
        // Verifica si el rol "user" existe, si no, lo crea
        let role = await this.roleRepository.findOne({ where: { name: UserRole.USER } });
        if (!role) {
          console.log('Rol user no encontrado, creando uno nuevo.');
          role = this.roleRepository.create({ name: UserRole.USER });
          await this.roleRepository.save(role);
        }
    
        // Crear nuevo usuario con la contraseña encriptada y asignar el rol de 'user'
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
        throw new HttpException('Error al registrar usuario', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
    // Método para registrar un nuevo usuario
    // public async registerUserWithRole(
    //   userBody: AuthRegisterDto,
    //   roleName: UserRole,
    //   createdBy: { id: string; name: string; email: string; roles: any } // Adaptar al tipo simplificado
    // ): Promise<User> {
    //   console.log('Registro de usuario - Datos recibidos:', userBody);
    
    //   // Verificar si el email ya existe
    //   const existingUser = await this.userRepository.findOne({ where: { email: userBody.email } });
    //   if (existingUser) {
    //     console.log('Email ya registrado:', userBody.email);
    //     throw new BadRequestException('El email ya está en uso.');
    //   }
    
    //   try {
    //     // Encriptar la contraseña
    //     const hashedPassword = await generateHash(userBody.password);
    //     console.log('Contraseña encriptada:', hashedPassword);
    
    //     // Verifica si el rol existe, si no, lo crea
    //     let role = await this.roleRepository.findOne({ where: { name: roleName } });
    //     if (!role) {
    //       console.log(`Rol ${roleName} no encontrado, creando uno nuevo.`);
    //       role = this.roleRepository.create({ name: roleName });
    //       await this.roleRepository.save(role);
    //     }
    
    //     // Crear nuevo usuario con la contraseña encriptada y asignar el rol, sin requerir todas las propiedades de User.
    //     const newUser = this.userRepository.create({
    //       ...userBody,
    //       password: hashedPassword,
    //       roles: [role],
    //       createdBy: { id: createdBy.id, name: createdBy.name, email: createdBy.email }, // Solo guardamos las propiedades relevantes
    //     });
    
    //     const savedUser = await this.userRepository.save(newUser);
    //     console.log('Usuario guardado en la base de datos:', savedUser);
    
    //     return savedUser;
    //   } catch (error) {
    //     console.error('Error en registerUserWithRole:', error);
    //     throw new HttpException('Error al registrar usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    //   }
    // }

    public async registerUserWithRole(
      userBody: AuthRegisterDto,
      roleName: UserRole,
      createdBy: { id: string; name: string; email: string; roles: any }
    ): Promise<User> {
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
  
        // Verifica si el rol existe, si no, lo crea
        let role = await this.roleRepository.findOne({ where: { name: roleName } });
        if (!role) {
          console.log(`Rol ${roleName} no encontrado, creando uno nuevo.`);
          role = this.roleRepository.create({ name: roleName });
          await this.roleRepository.save(role);
        }
  
        // Generar claves privadas solo para los roles relevantes
        let privateKey = null;
        let accessKey = null;
        if ([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.PROVIDER].includes(roleName)) {
          privateKey = uuidv4();
          accessKey = uuidv4();
        }
  
        // Crear nuevo usuario con la contraseña encriptada, asignar el rol y las claves
        const newUser = this.userRepository.create({
          ...userBody,
          password: hashedPassword,
          roles: [role],
          createdBy: { id: createdBy.id, name: createdBy.name, email: createdBy.email },
          privateKey,  // Guardar la privateKey generada
          accessKey,   // Guardar la accessKey generada
        });
  
        const savedUser = await this.userRepository.save(newUser);
        console.log('Usuario guardado en la base de datos:', savedUser);
  
        // Excluir las claves de la respuesta
        delete savedUser.privateKey;
        delete savedUser.accessKey;
  
        return savedUser;
      } catch (error) {
        console.error('Error en registerUserWithRole:', error);
        throw new HttpException('Error al registrar usuario', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
    
    



   
    async loginUser(userLoginBody: AuthLoginDto) {
        try {
          const { password, email } = userLoginBody;
          console.log('Datos recibidos en loginUser:', userLoginBody);
      
          // Buscar el usuario por email, incluyendo los roles y permisos
          const userExist = await this.userRepository.findOne({ 
            where: { email },
            relations: ['roles', 'roles.permissions'],
          });
      
          if (!userExist) {
            console.log('Usuario no encontrado para el email:', email);
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
          }
      
          console.log('Usuario encontrado:', userExist);
      
          // Verificar la contraseña
          const isCheck = await compareHash(password, userExist.password);
          if (!isCheck) {
            console.log('Contraseña incorrecta para el usuario:', email);
            throw new HttpException('Contraseña incorrecta', HttpStatus.FORBIDDEN);
          }
      
          console.log('Contraseña verificada correctamente.');
      
          // Preparar el payload para el token
          const payload = { id: userExist.id, name: userExist.name };
          const token = this.jwtService.sign(payload);
          
          console.log('JWT generado:', token);
      
          const data = {
            token,
            id: userExist.id,
            email: userExist.email,
            roles: userExist.roles.map(role => ({
              name: role.name,
              permissions: role.permissions.map(permission => permission.name),
            })),
          };
      
          console.log('Datos devueltos en el login:', data);
      
          return data;
      
        } catch (error) {
          console.error('Error en loginUser:', error.message);
          throw new HttpException(
            error.message || 'Error en el servidor al iniciar sesión',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
      

    


    // async currentUser(userId: string): Promise<User> {
    //   // Asegurarte de cargar los roles junto con el usuario
    //   return this.userRepository.findOne({
    //     where: { id: userId },
    //     relations: ['roles'],  
    //   });
    // }

    async currentUser(userId: string): Promise<User> {
      // Cargar el usuario junto con sus roles y las claves accessKey y privateKey
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['roles'],  // Asegura que cargue los roles
      });
    
      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
    
      return user; // El objeto user incluirá las claves accessKey y privateKey si están en la entidad
    }
    

    public async logout() { }
}
