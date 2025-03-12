import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from './dto/login.dto';
import { Repository } from "typeorm";
import { User } from "src/app/user/entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Profile } from "src/app/profile/entity/profile.entity"; // ✅ Importando a entidade Profile
import { ProfileHasPolicy } from "src/app/profile/entity/profile_has_route_policy.entity";
import { ProfileHasRoute } from "src/app/route/entity/profile_has_route";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>, // ✅ Repositório para buscar o nome do Profile
        @InjectRepository(ProfileHasPolicy)
        private readonly profileHasPolicyRepository: Repository<ProfileHasPolicy>,
        private readonly hashingService: HashingService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService,
        @InjectRepository(ProfileHasRoute)
        private readonly profileHasRouteRepository: Repository<ProfileHasRoute>,
    ){}

    async login(loginDto: LoginDto) {
        let passwordIsValid = false;
        let throwError = true;
    
        const user = await this.userRepository.findOneBy({
            username: loginDto.username
        });
    
        if (!user) {
            throw new UnauthorizedException("Usuário não encontrado");
        }
    
        if (!user.status) {
            throw new UnauthorizedException("Usuário inativo");
        }
    
        // Checar senha
        passwordIsValid = await this.hashingService.compare(
            loginDto.password,
            user.passwordHash
        );
    
        if (passwordIsValid) {
            throwError = false;
        }
    
        if (throwError) {
            throw new UnauthorizedException("Usuário ou senha inválido");
        }

        // ✅ Buscar o nome do Profile baseado no ID
        const profile = await this.profileRepository.findOneBy({ id: user.profile_id });

        if (!profile) {
            throw new UnauthorizedException("Perfil não encontrado");
        }

        // ✅ Buscar permissões do Profile
        const policiesPermissions = await this.profileHasPolicyRepository.find({
            where: { profile: { id: user.profile_id } },
            relations: ['routePolicy']
        });

        const policies = policiesPermissions.map(p => p.routePolicy.name);

        // ✅ Buscar rotas do Profile usando profile_id
        const routesPermissions = await this.profileHasRouteRepository.find({
            where: { profile: { id: user.profile_id } },
            relations: ['routePolicy']
        });

        // ✅ Filtrar apenas as rotas que NÃO têm subrotas
        const routes = routesPermissions
            .map(p => p.routePolicy.name)
            .filter(route => (route.match(/\//g) || []).length <= 1);


        // ✅ Passar ID e Nome do Profile no Token
        return this.createTokens(user, user.profile_id, profile.name, policies, routes);
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto) {
        try {
            const { id_user } = await this.jwtService.verifyAsync(
                refreshTokenDto.refreshToken,
                this.jwtConfiguration
            );
    
            const user = await this.userRepository.findOneBy({ id: id_user });
    
            if (!user) {
                throw new UnauthorizedException("Usuário não encontrado");
            }
    
            if (!user.status) {
                throw new UnauthorizedException("Usuário inativo");
            }

            // ✅ Buscar o nome do Profile baseado no ID
            const profile = await this.profileRepository.findOneBy({ id: user.profile_id });

            if (!profile) {
                throw new UnauthorizedException("Perfil não encontrado");
            }

            // ✅ Buscar permissões do Profile
            const policiesPermissions = await this.profileHasPolicyRepository.find({
                where: { profile: { id: user.profile_id } },
                relations: ['routePolicy']
            });

            const policies = policiesPermissions.map(p => p.routePolicy.name);

                        // ✅ Buscar rotas do Profile usando profile_id
            const routesPermissions = await this.profileHasRouteRepository.find({
                where: { profile: { id: user.profile_id } },
                relations: ['routePolicy']
            });

            // ✅ Filtrar apenas as rotas que NÃO têm subrotas
            const routes = routesPermissions
                .map(p => p.routePolicy.name)
                .filter(route => (route.match(/\//g) || []).length <= 1);

            return this.createTokens(user, user.profile_id, profile.name, policies, routes);
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }
    
    private async signJwtAsync<T>(
        id_user: number, 
        id_profile: number, 
        profile_name: string, 
        expiresIn: number, 
        policies: string[], // Já existia
        routes: string[]    // ✅ Novo campo com as rotas permitidas
    ) {
        return await this.jwtService.signAsync(
            {
                id_user,
                id_profile,
                profile_name, 
                policies, // Mantido
                routes    // ✅ Agora inclui as rotas permitidas
            },
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn
            }
        );
    }    

    private async createTokens(user: User, id_profile: number, profile_name: string, policies: string[], routes: string[]) {
        const acessToken = await this.signJwtAsync(
            user.id,
            id_profile,
            profile_name,
            this.jwtConfiguration.jwtTime,
            policies,
            routes // ✅ Agora passando as rotas permitidas
        );
    
        const refreshToken = await this.signJwtAsync(
            user.id,
            id_profile,
            profile_name,
            this.jwtConfiguration.jwrRefreshTime,
            policies,
            routes
        );
    
        return {
            acessToken,
            refreshToken
        };
    }
}
