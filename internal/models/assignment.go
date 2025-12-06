package models

import (
	"github.com/google/uuid"
	"time"
)

type Assignment struct {
	ID          uuid.UUID `db:"id"`
	Title       string    `db:"title"`
	Description string    `db:"description"`
	DueDate     time.Time `db:"due_date"`
	Status      string    `db:"status"`
	TeacherID   uuid.UUID `db:"teacher_id"`
}
