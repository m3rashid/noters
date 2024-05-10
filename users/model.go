package users

import "time"

type User struct {
	ID        uint      `gorm:"primary_key;column:id" json:"id"`
	Name      string    `json:"name" gorm:"column:name;not null" validate:"required"`
	Email     string    `json:"email" gorm:"column:email;unique;not null" validate:"required,email"`
	Password  string    `json:"password" gorm:"column:password;not null" validate:"required"`
	Deleted   bool      `gorm:"column:deleted;default:false" json:",omitempty" validate:""`
	CreatedAt time.Time `gorm:"column:createdAt; default:current_timestamp" json:"createdAt"`
}
