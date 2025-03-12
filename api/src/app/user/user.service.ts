import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { ProfileService } from 'src/app/profile/profile.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly profileService: ProfileService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, username, password, status, profile_id } = createUserDto;

    await this.checkIfEmailExists(email);

    await this.checkIfUsernameExists(username);

    await this.profileService.findOne(profile_id);

    const hashedPassword = await this.hashingService.hash(password);

    const user = new User();
    user.name = name;
    user.email = email;
    user.username = username;
    user.passwordHash = hashedPassword;
    user.status = status;
    user.profile_id = profile_id;

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, tokenPayloadDto: TokenPayloadDto): Promise<User> {
    // Garante que o usuário só possa editar seus próprios dados
    if (tokenPayloadDto.id_user !== id) {
        throw new ForbiddenException("You can only update your own data.");
    }

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedFields: Partial<User> = {};

    for (const key in updateUserDto) {
        if (updateUserDto[key] !== undefined && updateUserDto[key] !== user[key]) {
            updatedFields[key] = updateUserDto[key];
        }
    }

    if (Object.keys(updatedFields).length === 0) {
        return user;
    }

    if (updatedFields.profile_id) {
        await this.profileService.findOne(updatedFields.profile_id);
    }

    if (updatedFields.username) {
        await this.validateUsername(updatedFields.username, user.id);
    }

    if (updatedFields.email) {
        await this.validateEmail(updatedFields.email, user.id);
    }

    if (updateUserDto.password !== undefined) {
      updatedFields.passwordHash = await this.hashingService.hash(updateUserDto.password);
  }
  

    Object.assign(user, updatedFields);
    return this.userRepository.save(user);
}


  async remove(id: number, tokenPayloadDto: TokenPayloadDto): Promise<void> {
    // Garante que o usuário só possa deletar sua própria conta
    if (tokenPayloadDto.id_user !== id) {
        throw new ForbiddenException("You can only delete your own account.");
    }

    const user = await this.findOne(id);
    await this.userRepository.remove(user);
}


    private async checkIfEmailExists(email: string): Promise<void> {
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new ConflictException(`Email "${email}" is already in use.`);
      }
    }
  
    private async checkIfUsernameExists(username: string): Promise<void> {
      const existingUser = await this.userRepository.findOne({ where: { username } });
      if (existingUser) {
        throw new ConflictException(`Username "${username}" is already in use.`);
      }
    }

    private async validateUsername(username: string, userId: number): Promise<void> {
      const existingUser = await this.userRepository.findOne({ where: { username } });
      if (existingUser && existingUser.id !== userId) {
          throw new ConflictException(`Username "${username}" is already in use.`);
      }
  }
  
    private async validateEmail(email: string, userId: number): Promise<void> {
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser && existingUser.id !== userId) {
          throw new ConflictException(`Email "${email}" is already in use.`);
      }
  }
  
}
