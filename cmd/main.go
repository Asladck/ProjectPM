package main

import (
	"Pjpro/internal/grpcserver"
	"Pjpro/internal/handler"
	"Pjpro/internal/repository"
	server "Pjpro/internal/server"
	"Pjpro/internal/service"
	ws "Pjpro/internal/ws_server"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"

	"os"
	"os/signal"
	"syscall"
)

func main() {
	logrus.SetFormatter(new(logrus.JSONFormatter))

	// Load configs
	if err := initConfig(); err != nil {
		logrus.Fatal("Config error:", err)
	}
	if err := godotenv.Load(); err != nil {
		logrus.Fatal("Env load error:", err)
	}

	// Connect PostgreSQL
	db, err := repository.NewPostgresDB(repository.Config{
		Host:     viper.GetString("db.host"),
		Port:     viper.GetString("db.port"),
		Username: viper.GetString("db.username"),
		Password: os.Getenv("PASSWORD_DB"),
		DBName:   viper.GetString("db.dbname"),
		SSLMode:  viper.GetString("db.sslmode"),
	})

	if err != nil {
		logrus.Fatal("DB error:", err)
	}

	repos := repository.NewRepository(db)
	services := service.NewService(repos)
	handlers := handler.NewHandler(services)

	// --- 1. GRPC SERVER ---
	grpcSrv, err := grpcserver.StartGRPC()
	if err != nil {
		logrus.Fatal("gRPC start error:", err)
	}

	// --- 2. HTTP API SERVER ---
	httpSrv := new(server.Server)
	go func() {
		if err := httpSrv.Run(viper.GetString("port"), handlers.InitRouter()); err != nil {
			logrus.Fatal("HTTP server error:", err)
		}
	}()
	logrus.Info("HTTP REST started on:", viper.GetString("port"))

	// --- 3. WEBSOCKET SERVER ---
	wsSrv := ws.NewWsServer("0.0.0.0:8085")
	go func() {
		if err := wsSrv.Start(); err != nil {
			logrus.Fatal("WS server error:", err)
		}
	}()
	logrus.Info("WebSocket server started on :8085")

	// graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logrus.Warn("SHUTDOWN SIGNAL RECEIVED")

	grpcSrv.GracefulStop()
	wsSrv.Stop()
	httpSrv.Shutdown()
	db.Close()
}

func initConfig() error {
	viper.AddConfigPath("configs")
	viper.SetConfigName("config")
	return viper.ReadInConfig()
}
