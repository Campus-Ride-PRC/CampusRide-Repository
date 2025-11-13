# ===== BUILD STAGE =====
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install -g @angular/cli @ionic/cli
RUN npm install

COPY . .


EXPOSE 8100
CMD ["ionic", "serve", "--host=0.0.0.0", "--port=8100", "--disable-host-check"]
