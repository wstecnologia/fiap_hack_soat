# Processador de Vídeo FIAP

Este projeto é uma ferramenta de linha de comando desenvolvida em typescript, utilizando a biblioteca fluent-ffmpeg para processar vídeos. 
O principal objetivo é extrair quadros (frames) de um vídeo em intervalos regulares e compactá-los em um arquivo ZIP. É uma solução ideal para análise de vídeos, geração de thumbnails, ou qualquer cenário onde seja necessário processar e extrair conteúdo visual de arquivos de vídeo.

## Funcionalidades

- **Extração de Quadros**: Extrai quadros de um vídeo em intervalos definidos de 20 segundos.
- 
- **Salvamento de Quadros**: Salva cada quadro extraído como um arquivo JPEG na pasta especificada.
- 
- **Compactação de Quadros**: Compacta todos os quadros extraídos em um único arquivo ZIP para facilitar o manuseio e transferência.


## Instalação.
**Comandos para iniciar:**

- Npm install
- Npm run build
- Npm start
*OBS.: Para utilização e necessario renomear o arquivo .env_exemplo para .env E adicionar os valores de cada parametro.*

### Scripts utéis 
Atualizar conteiner local com dados do dockerhub
  docker-compose down && docker-compose pull && docker-compose up -d

Buildar imagem local
  docker build -t wstecnologia/hack_soat_video_processor .