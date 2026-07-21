package models

import "github.com/golang-jwt/jwt/v5"

type Claims struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}
