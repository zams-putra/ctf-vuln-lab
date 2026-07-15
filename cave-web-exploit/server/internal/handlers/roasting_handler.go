package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/helper"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/middlewares"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/models"
)

type RoastingServiceInterface interface {
	AddComment(roaster, comment string) (*models.Roasting, error)
	GetAllComment() ([]models.Roasting, error)
}

type RoastingHandler struct {
	RoastingService RoastingServiceInterface
}

type CommentRequest struct {
	Comment string `json:"comment"`
}

type CommentResponse struct {
	Messages string `json:"messages"`
}

func (h *RoastingHandler) AddComment(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middlewares.ClaimsKey).(*models.Claims)
	if !ok {
		helper.WriteJSON(w, http.StatusUnauthorized, CommentResponse{
			Messages: "Unauthorized",
		})
		return
	}

	var req CommentRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, CommentResponse{
			Messages: "Request ga valid intinya",
		})
		return
	}

	_, err = h.RoastingService.AddComment(claims.Username, req.Comment)
	if err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, CommentResponse{
			Messages: "Gagal add comment intinya: " + err.Error(),
		})
		return
	}

	helper.WriteJSON(w, http.StatusCreated, CommentResponse{
		Messages: "Berhasil di add cuy intinya mah",
	})
}

func (h *RoastingHandler) GetAllComment(w http.ResponseWriter, r *http.Request) {
	roastings, err := h.RoastingService.GetAllComment()
	if err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, CommentResponse{
			Messages: "Request ga valid intinya",
		})
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(roastings)
}
