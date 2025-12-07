package service

import (
	"Pjpro/internal/models"
	"Pjpro/internal/repository"
)

type Service struct {
	Auth
}
type Auth interface {
	Create(user models.SignUpRequest) (string, error)
	GenerateToken(password, email, role string) (string, string, error)
	ParseRefToken(tokenR string) (string, error)
	ParseToken(token string) (string, error)
	GenerateAccToken(userId string) (string, error)
}

func NewService(rep *repository.Repository) *Service {
	return &Service{Auth: NewAuthService(rep.Auth)}
}
