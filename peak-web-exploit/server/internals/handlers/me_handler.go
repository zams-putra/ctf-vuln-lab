package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/zams-putra/my-boot2root/peak/peak/server/internals/models"
)

func MeHandler(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(*models.Claims)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"id":       claims.Id,
		"username": claims.Username,
		"role":     claims.Role,
	})
}
