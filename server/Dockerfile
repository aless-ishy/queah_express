FROM node:14-alpine
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app
COPY --chown=node:node . .
USER node
RUN npm install
EXPOSE 5000
CMD [ "node", "bin/www" ]





