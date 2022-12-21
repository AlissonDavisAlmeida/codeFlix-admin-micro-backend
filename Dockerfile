FROM node:16.10.0-slim

RUN apt update && apt install -y --no-install-recommends \
    git \
    ca-certificates

RUN npm install -g @nestjs/cli@8.2.5     

USER root

WORKDIR /home/node/app


CMD ["sh", "-c", "npm install && tail -f /dev/null"]
