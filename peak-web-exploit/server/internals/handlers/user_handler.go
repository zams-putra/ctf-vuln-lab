package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/zams-putra/my-boot2root/peak/peak/server/internals/models"
	"github.com/zams-putra/my-boot2root/peak/peak/server/internals/services"
)

var jwtSecret = []byte("dragonballz")

type UserLogin struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func LoginHandler(s *services.UserService) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		if r.Method != http.MethodPost {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusMethodNotAllowed)
			encoder := json.NewEncoder(w)
			encoder.SetIndent("", " ")
			json.NewEncoder(w).Encode(map[string]any{
				"message": "Method not allowed",
				"status":  http.StatusMethodNotAllowed,
			})
			return
		}

		var req UserLogin
		err := json.NewDecoder(r.Body).Decode(&req)

		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			encoder := json.NewEncoder(w)
			encoder.SetIndent("", " ")
			json.NewEncoder(w).Encode(map[string]any{
				"message": "Bad request",
				"status":  http.StatusBadRequest,
			})
			return

		}

		user, err := s.Login(req.Username, req.Password)
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			encoder := json.NewEncoder(w)
			encoder.SetIndent("", " ")
			json.NewEncoder(w).Encode(map[string]any{
				"message": err.Error(),
				"status":  http.StatusUnauthorized,
			})
			return

		}

		claims := models.Claims{
			Id:       user.Id,
			Username: user.Username,
			Role:     user.Role,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			},
		}

		// setup jwt ini with algo hs256
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenStr, err := token.SignedString(jwtSecret)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     "jwt_token",
			Value:    tokenStr,
			HttpOnly: true,
			Path:     "/",
			// Secure: true, -> kalo https
			SameSite: http.SameSiteLaxMode,
		})

		// response api nya kalau berhasil
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		encoder := json.NewEncoder(w)
		encoder.SetIndent("", " ")
		json.NewEncoder(w).Encode(map[string]any{
			"message": fmt.Sprintf("Login success, hello %s (%s)", user.Username, user.Role),
			// "token":   tokenStr, buat tes di postman aja, di prod mah ga aman nanti ketauan
			"status": http.StatusOK,
		})

	}
}

func LogoutHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		http.SetCookie(w, &http.Cookie{
			Name:   "jwt_token",
			Value:  "",
			MaxAge: -1,
			Path:   "/",
		})
	}
}
