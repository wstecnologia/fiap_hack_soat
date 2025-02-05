import express from 'express';
import request from 'supertest';
import { authMiddleware, errorHandler } from '../middlewares/authMiddleware';

// Mock do middleware de autenticação
const app = express();
app.use(express.json());

// Rota protegida pelo middleware
app.get('/protegida', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Rota protegida acessada com sucesso!' });
});

// Rota pública para comparação
app.get('/publica', (req, res) => {
  res.status(200).json({ message: 'Rota pública acessada com sucesso!' });
});

// Middleware de tratamento de erros
app.use(errorHandler);

describe('Testes do Middleware de Autenticação', () => {
  it('Deve retornar erro 401 se o token não for fornecido', async () => {
    const response = await request(app).get('/protegida');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token inválido ou expirado.');
  });

  it('Deve retornar erro 401 se o token for inválido', async () => {
    const response = await request(app)
      .get('/protegida')
      .set('Authorization', 'Bearer token-invalido');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token inválido ou expirado.');
  });

  it('Deve permitir o acesso à rota protegida com um token válido', async () => {
    // Substitua por um token JWT válido gerado pelo Cognito
    const validToken = "eyJraWQiOiJcL2RacHpuY21RWHNxZFY4OFRYZ2JVYTd4S1BUdUl2WGlPT1wvZU1nakYwRFU9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI5NGU4ZTRhOC05MDAxLTcwZmEtMDgzZS0yMjk3YzgxMTkwOTMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9wbjdabG50ak4iLCJjbGllbnRfaWQiOiI2OW5sNW1kZDhvMXFmdTFna2Ria3AzcDU3MiIsIm9yaWdpbl9qdGkiOiIxZDU3NDMzMS02OTBjLTQyNjQtOTMxNS1hNGE5N2ZlNzM5Y2EiLCJldmVudF9pZCI6IjkyYzg4MjY5LTUxZjItNDNlMS04ZGE2LTFhYmRmZDAyOGJlZiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3Mzg3MTMyNTUsImV4cCI6MTczODcxNjg1NSwiaWF0IjoxNzM4NzEzMjU1LCJqdGkiOiIwZWUxMDI3Mi1kMTVkLTQ2N2EtOTU0ZS04MDJjOGZhMmQ0MWMiLCJ1c2VybmFtZSI6IldpbHNvbiJ9.Ym4iDptbCXOmab7C8GG97Q--ixjnT38_BLmVgeKmdh-JCvbvI7pp7m4wG1gKI-aGMXiVn07c7CvGLjTrhd_ZOOFdmf-l4ntuJ2mF-VfLtYCHEMS_4ZJNfpypZWX_p-KsNtyrCn4bwm2iXg1T3XyqAZBRxc97wJRyIQWECVNFo3TMkUhjS3K69M-fOGL05SXBIMbHL_Ee64GXOOptwNKro1RN3WBRw0s9AfpRuIlirMeR3NMW7iYiCKIyv0d1jajSkJiZxbGHbs2e7Nti2VKjUawR32wVEN-USiowUt02yklb5fk2qHq9aa7tcNFCK1LUy2KkuZIVq7nyGlY4ZIjYLA";

    const response = await request(app)
      .get('/protegida')
      .set('Authorization', `Bearer ${validToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Rota protegida acessada com sucesso!');
  });

  it('Deve permitir o acesso à rota pública sem autenticação', async () => {
    const response = await request(app).get('/publica');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Rota pública acessada com sucesso!');
  });
});