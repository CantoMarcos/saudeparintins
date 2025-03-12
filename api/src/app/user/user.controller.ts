import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { RoutePolicyGuard } from 'src/auth/guards/route-policy.guard';
import { SetRoutePolicy } from 'src/auth/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  
  @SetRoutePolicy(RoutePolicies.findAllUsers)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(@Param('id') id: string,
  @Body() updateUserDto: UpdateUserDto,
  @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.userService.update(+id, updateUserDto, tokenPayload);
  }


  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, 
  @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.userService.remove(+id, tokenPayload);
  }
}
