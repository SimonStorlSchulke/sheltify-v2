FROM golang:tip-bookworm AS builder

ENV CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

WORKDIR /build

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o /app .

FROM alpine:3.21 AS final

COPY --from=builder /app /bin/app

EXPOSE 8000

CMD ["bin/app"]