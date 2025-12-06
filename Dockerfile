FROM golang:latest AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# static binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main ./cmd/main.go


# ---- runtime ----
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .
COPY --from=builder /app/web ./web
COPY --from=builder /app/configs ./configs
COPY --from=builder /app/.env .env

RUN chmod +x ./main

EXPOSE 9090 8085 50051

CMD ["./main"]
