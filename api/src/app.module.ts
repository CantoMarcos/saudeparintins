import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './app/user/user.module';
import { ProfilModule } from './app/profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { RouteModule } from './app/route/route.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'mysql'>('DATABASE_TYPE') as 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: configService.get<boolean>('DATABASE_AUTOLOAD'),
        synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE'),
      })
    }),
    UserModule,
    ProfilModule,
    RouteModule,
    AuthModule
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
