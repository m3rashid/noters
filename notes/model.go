package notes

import (
	"noters/users"
	"time"
)

type Note struct {
	ID        uint        `gorm:"primary_key;column:id" json:"id"`
	Title     string      `json:"title" gorm:"column:title;not null" validate:"required"`
	Body      string      `json:"body,omitempty" gorm:"column:body" validate:""`
	Status    string      `json:"status" gorm:"column:status" validate:"required"`
	Deleted   bool        `gorm:"column:deleted;default:false" json:",omitempty" validate:""`
	CreatedAt time.Time   `gorm:"column:createdAt; default:current_timestamp" json:"createdAt"`
	UserID    uint        `json:"userId,omitempty" gorm:"column:userId" validate:""`
	User      *users.User `json:"user,omitempty" gorm:"column:userId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" validate:""`
}
