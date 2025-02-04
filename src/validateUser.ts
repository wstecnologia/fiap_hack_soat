import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const COGNITO_REGION = "us-east-1"; // Substitua pela sua região
const USER_POOL_ID = "us-east-1_Bgxd4H73r"; // Substitua pelo seu User Pool ID

const client = jwksClient({
  jwksUri: `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`,
});

function getKey(header: any, callback: (err: Error | null, key?: string) => void) {
  client.getSigningKey(header.kid, (err:Error, key:any) => {
    if (err) {
      callback(err);
    } else {
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    }
  });
}

export async function validarToken(token: string): Promise<JwtPayload | null> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) {
        console.error("Erro ao validar token:", err.message);
        reject(null);
      } else {
        resolve(decoded as JwtPayload);
      }
    });
  });
}

// Exemplo de uso:
(async () => {
  try {
    //const token = "eyJraWQiOiJPczNpWUFqTHZ1b3ZFOHJMQ2JJSHJBd0lHWUp3RlQ1aktJRGVLNGRQTXFJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4NGU4ZDRmOC1iMDQxLTcwMzEtYzk1OS0wMTgxNDgzODEzMWQiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9CZ3hkNEg3M3IiLCJjbGllbnRfaWQiOiI4dmE2aWs5NmFuNzlqaWZtM3JrZmtsb3NzIiwib3JpZ2luX2p0aSI6IjhiZTM1M2FmLTM1NGEtNDY0Zi1hMDQxLWQ1ZmY0NGNjMzIwZCIsImV2ZW50X2lkIjoiZGVlNGM4OGEtODliNy00YzFkLWFkMDEtODhhNGU0ZDM0N2YyIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTczODcwMTE5MywiZXhwIjoxNzM4NzA0NzkzLCJpYXQiOjE3Mzg3MDExOTMsImp0aSI6IjMwNzAwNzJmLWFhMGYtNDhjMy05MDk0LWFkMTczMGFjYzlmYiIsInVzZXJuYW1lIjoic2F2aW9kYmEifQ.bnF-4UReeTJxGC2PyAIrYJJBpm7BC1o5fOXGlahQhBdZJrMzQQYtMG8-31tX5evJR0qRQu5PF3jhXcE4SobzTwBb1oQCXZLr-FIQLcRh_4cv25uM2XhHnSbxqpJHV5Z5dxpQVrQGW2RwBT89-o7xiyfdaGC3E9ZqnQ0BMQ8AqPluCPs4Gs8N8VDovE1lhAeMzspkV9RqNB8DkzZn7qHsbkMuJuU7f6Q3Xb2gRSvncX_k_Vp2Xs1j4MIgSTucYHDuRbb9VBIQcUC61vh0NNuGFa-v02_oT9kqS3vpLPciyuyVAtFe3omAc024xdLcIF5DxxA6ylSDwQ8wAkeMOn54oA"; // Substitua pelo token retornado no login
    const token = "abcdef"
    const resultado = await validarToken(token);
    console.log("Token válido!", resultado);
  } catch (error) {
    console.log("Token inválido!");
  }
})();
