package middlewares

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/zams-putra/my-boot2root/peak/peak/server/internals/models"
)

var jwtSecret = []byte("dragonballz")

func JwtMiddleware(next http.HandlerFunc, reqRole string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// pake bearer - 1
		// authHeader := r.Header.Get("Authorization")    //ambil value dari header ini
		// if !strings.HasPrefix(authHeader, "Bearer ") { // kalau depannya ga ada ini lakuin :
		// 	w.WriteHeader(http.StatusUnauthorized)
		// 	return
		// }
		// tokenStr := strings.TrimPrefix(authHeader, "Bearer ") // potong depannya

		// pake kuki - 2
		cookie, err := r.Cookie("jwt_token")
		if err != nil {
			// fmt.Println("Cookie error:", err)
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]any{
				"message": "LOGIN DULU LAH!",
				"status":  http.StatusUnauthorized,
			})
			return
		}
		tokenStr := cookie.Value
		// fmt.Println("kuki", cookie)
		claims := &models.Claims{}

		// dia secure kalau ada ini: jwt.WithValidMethods([]string{"HS256"})
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (any, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			// fmt.Println("Cookie error:", err)
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]any{
				"message": "TOKEN GA VALID!",
				"status":  http.StatusUnauthorized,
			})
			return
		}
		if reqRole != "" && claims.Role != reqRole {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(map[string]any{
				"message": "Forbidden, gabole",
				"status":  http.StatusForbidden,
			})
			return
		}

		ctx := context.WithValue(r.Context(), "claims", claims)

		next(w, r.WithContext(ctx))
	}
}
