import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { REQUEST_TOKEN_PAYLOAD_KEY, ROUTE_POLICY_KEY } from "../auth.constants";
import { RoutePolicies } from "../enum/route-policies.enum";


@Injectable()
export class RoutePolicyGuard implements CanActivate{
    constructor(
        private readonly reflector: Reflector
    ){}
    async canActivate(context: ExecutionContext):Promise<boolean>{
        const routePolicyRequired = this.reflector.get<RoutePolicies | undefined>(
            ROUTE_POLICY_KEY,
            context.getHandler(),
        );

        if(!routePolicyRequired){
            return true
        }

        const request = context.switchToHttp().getRequest();
        const tokenPayload = request[REQUEST_TOKEN_PAYLOAD_KEY];
        if(!tokenPayload){
            throw new UnauthorizedException(
                `Rota requer permissao ${routePolicyRequired}. Usuario nao logado`
            )
        }

        const {policies} = tokenPayload
        
        if (!policies.includes(routePolicyRequired)) {
            throw new UnauthorizedException(
                `Usuário não tem permissão para acessar esta rota: ${routePolicyRequired}`
            );
        }

        return true
}
}