FROM node:12.15.0

WORKDIR /mnt/app/

COPY \
. \
.

RUN \
openssl req -nodes -new -x509 -keyout server.key -out server.cert -subj '/' \
&& npm install \
&& npm run build

ENTRYPOINT ["npm", "start"]
