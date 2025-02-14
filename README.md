# Processador de Vídeo FIAP

Este projeto é uma ferramenta de linha de comando desenvolvida em C# .NET, utilizando a biblioteca FFMpegCore para processar vídeos. O principal objetivo é extrair quadros (frames) de um vídeo em intervalos regulares e compactá-los em um arquivo ZIP. É uma solução ideal para análise de vídeos, geração de thumbnails, ou qualquer cenário onde seja necessário processar e extrair conteúdo visual de arquivos de vídeo.

## Funcionalidades

- **Extração de Quadros**: Extrai quadros de um vídeo em intervalos definidos de 20 segundos.
- **Salvamento de Quadros**: Salva cada quadro extraído como um arquivo JPEG na pasta especificada.
- **Compactação de Quadros**: Compacta todos os quadros extraídos em um único arquivo ZIP para facilitar o manuseio e transferência.

## Pré-requisitos

Para executar este projeto, você precisará ter:


## Como Usar

1. **Defina o Caminho do Vídeo**: Modifique a variável `videoPath` para apontar para o caminho do seu arquivo de vídeo.

```csharp
var videoPath = @"Caminho\Para\Seu\Vídeo.mp4";
```

### Scripts utéis 
Atualizar conteiner
  docker-compose down && docker-compose pull && docker-compose up -d
