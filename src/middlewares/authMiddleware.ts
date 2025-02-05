import dotenv from 'dotenv';
import { GetVerificationKey, expressjwt as jwt } from 'express-jwt';
import jwks from 'jwks-rsa';

// Carregar variáveis de ambiente
dotenv.config();

// Construir a URL do JWKS
//const jwksUri = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`;
const jwksUri = `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_pn7ZlntjN/.well-known/jwks.json`




// {
//   "app_client_id": {
//     "sensitive": false,
//     "type": "string",
//     "value": "69nl5mdd8o1qfu1gkdbkp3p572"
//   },
//   "identity_pool_id": {
//     "sensitive": false,
//     "type": "string",
//     "value": "us-east-1:c6b1c5fa-550e-4a1e-af80-4a324867f881"
//   },
//   "user_pool_id": {
//     "sensitive": false,
//     "type": "string",
//     "value": "us-east-1_pn7ZlntjN"
//   }
// }



// Configurar o middleware de validação de token
export const authMiddleware = jwt({
  secret: jwks.expressJwtSecret({
    cache: true, // Cache das chaves JWKS
    rateLimit: true, // Limitar requisições ao JWKS
    jwksRequestsPerMinute: 5, // Número máximo de requisições por minuto
    jwksUri, // URL do JWKS
  }) as GetVerificationKey,
  audience: process.env.COGNITO_CLIENT_ID, // ID do Client do Cognito
  issuer: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`, // Issuer do token
  algorithms: ['RS256'], // Algoritmo de assinatura
});

// Middleware para tratamento de erros
export const errorHandler = (err: any, req: any, res: any, next: any) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
  res.status(500).json({ message: 'Erro interno no servidor.' });
};