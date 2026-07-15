package models

import "github.com/golang-jwt/jwt/v5"

type Claims struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
	IsAdmin  bool   `json:"isAdmin"`
	jwt.RegisteredClaims
}
