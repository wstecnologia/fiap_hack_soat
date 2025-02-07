import dotenv from "dotenv";
import { expressjwt as jwt } from "express-jwt";
import jwks from "jwks-rsa";

dotenv.config();

export const authMiddleware = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,    
  }) as jwks.GetVerificationKey, // Força o tipo para GetVerificationKey
  audience: process.env.COGNITO_CLIENT_ID,
  issuer: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
  algorithms: ["RS256"],
});


