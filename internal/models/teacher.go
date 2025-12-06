package models

import "github.com/google/uuid"

type Teacher struct {
	ID       uuid.UUID `db:"id"`
	Name     string    `db:"name"`
	Surname  string    `db:"surname"`
	Password string    `db:"password"`
	Email    string    `db:"email"`
}
