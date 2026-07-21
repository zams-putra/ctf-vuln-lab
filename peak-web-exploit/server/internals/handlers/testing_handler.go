package handlers

import "net/http"

func TestingHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Testing berhasil, peak!"))
}
