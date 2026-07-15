package middlewares

import (
	"context"
	"fmt"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/helper"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/models"
)

type contextkey string

const ClaimsKey contextkey = "claims"

type AuthResponse struct {
	Messages string `json:"messages"`
	Token    string `json:"token,omitempty"`
}

func AuthMiddleware(jwtsecret string, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("kuki")
		if err != nil {
			helper.WriteJSON(w, http.StatusUnauthorized, AuthResponse{
				Messages: "Unauthorized gabole masuk",
			})
			return
		}
		claims := &models.Claims{}
		token, err := jwt.ParseWithClaims(cookie.Value, claims, func(t *jwt.Token) (any, error) {

			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			return []byte(jwtsecret), nil
		})
		if err != nil || !token.Valid {
			helper.WriteJSON(w, http.StatusUnauthorized, AuthResponse{
				Messages: "Unauthorized gabole masuk",
			})
			return
		}
		ctx := context.WithValue(r.Context(), ClaimsKey, claims)
		next(w, r.WithContext(ctx))
	}
}
