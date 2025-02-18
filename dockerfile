FROM node:18

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de configuração do pacote
COPY package*.json ./

# Copie o restante dos arquivos da aplicação
COPY . .

# Gere o Prisma Client
RUN npx prisma generate

# Construa a aplicação
RUN npm run build

# Exponha a porta que a aplicação irá usar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
