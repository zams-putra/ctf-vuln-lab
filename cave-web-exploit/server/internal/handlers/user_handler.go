package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/helper"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/models"
)

type AuthRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type AuthResponse struct {
	Messages string `json:"messages"`
	Token    string `json:"token,omitempty"`
}

type UserServiceInterface interface {
	Register(username, password string) (*models.User, error)
	Login(username, password string) (string, error)
}

type UserHandler struct {
	UserService UserServiceInterface
}

func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req AuthRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, AuthResponse{
			Messages: "Request ga valid",
		})
		log.Println(err)
		return
	}

	_, err = h.UserService.Register(req.Username, req.Password)
	if err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, AuthResponse{
			Messages: "Error pokoknya mah: " + err.Error(),
		})
		return
	}

	helper.WriteJSON(w, http.StatusCreated, AuthResponse{
		Messages: "Register user success",
	})
}

func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req AuthRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, AuthResponse{
			Messages: "Request ga valid",
		})
		return
	}

	token, err := h.UserService.Login(req.Username, req.Password)
	if err != nil {
		helper.WriteJSON(w, http.StatusUnauthorized, AuthResponse{
			Messages: "Invalid creds lah ya",
		})
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "kuki",
		Value:    token,
		HttpOnly: false,
		Path:     "/",
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	})

	helper.WriteJSON(w, http.StatusOK, AuthResponse{
		Messages: "Login success",
		Token:    token,
	})

}
