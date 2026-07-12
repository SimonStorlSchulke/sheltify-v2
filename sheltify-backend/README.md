# Sheltify backend todos / ideas

- string fields need a max-ltngth system


## Run Postgres docker:
docker run --name=sheltify-db -e POSTGRES_PASSWORD=1212 -e PGPORT=5434 -d -p 5434:5434 -v docker-db:/var/lib/postgresql/data postgres:latest

docker run --detach --name sheltify-mariadb -p 3306:3306 --env MARIADB_USER=shelti
fy --env MARIADB_PASSWORD=1212 --env MARIADB_DATABASE=sheltify --env MARIADB_ROOT_PASSWORD=1212 mariadb:latest

dann im docker terminal:
`psql -U postgres`  
`CREATE DATABASE sheltify_db;`
