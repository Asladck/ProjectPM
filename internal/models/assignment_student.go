package models

import "github.com/google/uuid"

type AssignmentStudent struct {
	AssignmentID uuid.UUID `db:"assignment_id"`
	StudentID    uuid.UUID `db:"student_id"`
}
