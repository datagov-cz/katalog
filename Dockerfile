FROM node:21.1.0-bullseye

WORKDIR /opt/application-catalog/
COPY ./package*.json ./
RUN npm ci

COPY ./ ./


# Default configuration
ENV PORT="3000"
ENV HOST="0.0.0.0"

EXPOSE 3000

CMD ["npm", "run", "start"]

