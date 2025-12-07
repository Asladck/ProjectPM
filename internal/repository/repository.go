package repository

import (
	"Pjpro/internal/models"
	"github.com/jmoiron/sqlx"
)

type Repository struct {
	Auth
}
type Auth interface {
	Create(user models.User) (string, error)
	GetUser(password, email, role string) (models.User, error)
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		Auth: NewAuthRepository(db),
	}
}
