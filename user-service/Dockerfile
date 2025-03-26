FROM node:16-alpine

WORKDIR /app

# Sadece package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# node_modules klasörünü geçici olarak yeniden adlandır
RUN mv node_modules node_modules_docker

# Tüm kaynak kodlarını kopyala
COPY . .

# Host makinesinden kopyalanan node_modules klasörünü sil (eğer varsa)
RUN rm -rf node_modules

# Docker içinde derlenen modülleri geri yükle
RUN mv node_modules_docker node_modules

EXPOSE 3001

CMD ["npm", "start"]