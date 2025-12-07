package models

import "time"

type User struct {
	Id        string    `json:"-" db:"id"`
	Email     string    `json:"email" binding:"required" db:"email"`
	Name      string    `json:"name" binding:"required" db:"name"`
	Surname   string    `json:"surname" binding:"required" db:"surname"`
	Password  string    `json:"password" binding:"required" db:"password_hash"`
	Role      string    `json:"role" binding:"required" db:"role"`
	CreatedAt time.Time `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at,omitempty" db:"updated_at"`
}
