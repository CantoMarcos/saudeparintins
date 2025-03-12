import { registerAs } from "@nestjs/config";

export default registerAs("jwt",()=>{
    return {
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_TOKEN_AUDIENCE,
        issuer: process.env.JWT_TOKEN_ISSUER,
        jwtTime: Number(process.env.JWT_TIME ?? 3600),
        jwrRefreshTime: Number(process.env.JWT_REFRESH_TIME)
    }
} )