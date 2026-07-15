package handlers

import "net/http"

func TestingHandlers(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("berhasil noh testnya"))
}
