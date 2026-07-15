package handlers

import (
	"net/http"
	"os"
	"strings"

	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/middlewares"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/models"
)

var logDir = "logs/"

func SetLogDir(dir string) {
	logDir = dir
}

func AdminLogs(w http.ResponseWriter, r *http.Request) {

	claims, ok := r.Context().Value(middlewares.ClaimsKey).(*models.Claims)
	if !ok || !claims.IsAdmin {
		http.Error(w, "Forbidden lau sape mpruy", http.StatusForbidden)
		return
	}

	filename := r.URL.Query().Get("file")
	if filename == "" {
		filename = "app.log"
	}

	clean := strings.ReplaceAll(filename, "../", "")

	fullpath := logDir + clean
	content, err := os.ReadFile(fullpath)
	if err != nil {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "text/plain")
	w.Write(content)

}
