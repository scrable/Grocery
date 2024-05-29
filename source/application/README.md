# Local Testing

- HTTP: `http://localhost:9080/`
- HTTPS: `https://localhost:9443/`

## Docker Compose
```sh
## cwd csc648-03-sp20-team103/source/application

# install dependencies
npm install

# generate self-signed cert (first-time only)
openssl req -nodes -new -x509 -keyout server.key -out server.cert -subj '/'

# start docker compose
sudo docker-compose up
```

If Docker Compose fails to connect to the Docker daemon, ensure the Docker daemon is up (`sudo dockerd`).

## NPM
```sh
## cwd csc648-03-sp20-team103/source/application

# set NODE_ENV
export NODE_ENV=development

# install dependencies
npm install

# generate self-signed cert (first-time only)
openssl req -nodes -new -x509 -keyout server.key -out server.cert -subj '/'

# start npm build-watch & start-watch in parallel
npm run build-watch
npm run start-watch
```
