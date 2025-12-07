package repository

import (
	"Pjpro/internal/models"
	"fmt"
	"github.com/jmoiron/sqlx"
)

type AuthRepository struct {
	db *sqlx.DB
}

func NewAuthRepository(db *sqlx.DB) *AuthRepository {
	return &AuthRepository{db: db}
}

func (r *AuthRepository) Create(user models.User) (string, error) {
	var id string
	query := fmt.Sprintf("INSERT INTO %s (name,surname,email,password_hash,role) values ($1,$2,$3,$4,$5) RETURNING id", users)
	row := r.db.QueryRow(query, user.Name, user.Surname, user.Email, user.Password, user.Role)
	if err := row.Scan(&id); err != nil {
		return "", err
	}
	return id, nil
}
func (r *AuthRepository) GetUser(password, email, role string) (models.User, error) {
	var user models.User

	query := `
		SELECT id, email, name, surname, password_hash, role
		FROM users
		WHERE email = $1 AND password_hash = $2 AND role = $3
	`

	err := r.db.Get(&user, query, email, password, role)
	return user, err
}
