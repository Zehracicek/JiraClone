# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# build args
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# package.json & lock
COPY package*.json ./

RUN npm install

# source
COPY . .

# production build
RUN npm run build


# ---------- Runtime stage ----------
FROM nginx:alpine

# default nginx config'i sil
RUN rm /etc/nginx/conf.d/default.conf

# custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# build çıktısını nginx'e kopyala
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
