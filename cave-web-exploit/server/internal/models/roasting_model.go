package models

import "time"

type Roasting struct {
	Id        int       `json:"id"`
	Roaster   string    `json:"roaster"`
	Comment   string    `json:"comment"`
	CreatedAt time.Time `json:"created_at"`
}
