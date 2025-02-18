FROM node:18

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
