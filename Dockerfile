# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Go backend
FROM golang:1.23-alpine AS go-builder
WORKDIR /app
COPY backend/ ./backend/
WORKDIR /app/backend
RUN go mod download
RUN go build -o main

# Stage 3: Final runtime image
FROM alpine:latest
WORKDIR /app
# Copy the Go binary from the go-builder stage
COPY --from=go-builder /app/backend/main .
# Copy the built React app from the frontend-builder stage
COPY --from=frontend-builder /app/build ./build/

EXPOSE 8000
CMD ["./main"]