FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN ls -la /app/node_modules/prisma

ARG DATABASE_URL
ARG RESEND_API_KEY
ARG COHERE_API_KEY
ENV DATABASE_URL=${DATABASE_URL}
ENV RESEND_API_KEY=${RESEND_API_KEY}
ENV COHERE_API_KEY=${COHERE_API_KEY}

RUN npx prisma generate

# install git 
# RUN apk update && apk add --no-cache git

# RUN npm run build

# USER root

# RUN mkdir -p /app/node_modules/.prisma /app/prisma/generated && \
#     chown -R node:node /app

# USER node

EXPOSE 3000

CMD ["npm", "run", "dev"]

