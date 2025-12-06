# Sheltify backend todos / ideas

- string fields need a max-ltngth system


## Run Postgres docker:
docker run --name=sheltify-db -e POSTGRES_PASSWORD=1212 -e PGPORT=5434 -d -p 5434:5434 -v docker-db:/var/lib/postgresql/data postgres:latest


dann im docker terminal:
`psql -U postgres`  
`CREATE DATABASE sheltify_db;`
