FROM golang:1.25 AS buildernya
WORKDIR /server
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o seed_table /server/cmd/seed/create_table
RUN CGO_ENABLED=0 GOOS=linux go build -o seed_data /server/cmd/seed/insert_data
RUN CGO_ENABLED=0 GOOS=linux go build -o go_server /server/cmd/app

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends chromium ca-certificates fonts-liberation dumb-init && rm -rf /var/lib/apt/lists/*

WORKDIR /server

RUN adduser flags_are_here_dude

COPY --from=buildernya /server/go_server .
COPY --from=buildernya /server/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY --from=buildernya /server/seed_table /usr/local/bin/seed_table
COPY --from=buildernya /server/seed_data /usr/local/bin/seed_data
RUN mkdir logs
COPY logs /server/logs

RUN chmod +x /usr/local/bin/seed_table
RUN chmod +x /usr/local/bin/seed_data
RUN chmod +x /usr/local/bin/entrypoint.sh


EXPOSE 8080

ENTRYPOINT [ "dumb-init", "--", "entrypoint.sh" ]
CMD [ "./go_server" ]