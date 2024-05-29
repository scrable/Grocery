# Local Testing

- HTTP: `http://localhost:8080/`
- HTTPS: `https://localhost:8443/`

## Docker Compose
```sh
## cwd csc648-03-sp20-team103/source/api

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
## cwd csc648-03-sp20-team103/source/api

# set NODE_ENV, DB_HOST, DB_USER, DB_PASS
export NODE_ENV=development
export DB_HOST=localhost
export DB_DATABASE=team103
export DB_USER=team103
export DB_PASS=team103

# install dependencies
npm install

# generate self-signed cert (first-time only)
openssl req -nodes -new -x509 -keyout server.key -out server.cert -subj '/'

# start npm start-watch
npm run start-watch
```

If you use this approach, you need to host your own MariaDB with the following tasks:
- create database user `root` with password `team103`
- create database user `team103` with password `team103`
- create database `team103`
- GRANT ALL permission to database `team103` for user `team103`
