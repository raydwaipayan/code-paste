FROM node:lts-alpine

WORKDIR /app
COPY package.json ./

RUN apk add --no-cache curl git && cd /tmp && \
    curl -#L https://github.com/tj/node-prune/releases/download/v1.0.1/node-prune_1.0.1_linux_amd64.tar.gz | tar -xvzf- && \
    mv -v node-prune /usr/local/bin && rm -rvf

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git

RUN npm install && node-prune && npm cache clean --force

COPY . ./
RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3000
CMD ["npm", "start"]

