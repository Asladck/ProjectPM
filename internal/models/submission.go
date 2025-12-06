package models

import (
	"github.com/google/uuid"
	"time"
)

type Submission struct {
	ID            uuid.UUID `db:"id"`
	FileName      string    `db:"file_name"`
	FilePath      string    `db:"file_path"`
	IsLate        bool      `db:"is_late"`
	SubmittedTime time.Time `db:"submitted_time"`
	StudentID     uuid.UUID `db:"student_id"`
	AssignmentID  uuid.UUID `db:"assignment_id"`
}
