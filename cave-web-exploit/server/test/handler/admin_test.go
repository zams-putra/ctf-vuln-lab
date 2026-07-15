package handler_test

import (
	"context"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/handlers"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/middlewares"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/models"
)

func withAdminClaims(r *http.Request) *http.Request {
	claims := &models.Claims{
		Id:       1,
		Username: "Admin",
		IsAdmin:  true,
	}
	ctx := context.WithValue(r.Context(), middlewares.ClaimsKey, claims)
	return r.WithContext(ctx)
}

func withNonAdminClaims(r *http.Request) *http.Request {
	claims := &models.Claims{
		Id:       2,
		Username: "biasa",
		IsAdmin:  false,
	}
	ctx := context.WithValue(r.Context(), middlewares.ClaimsKey, claims)
	return r.WithContext(ctx)
}

func TestAdminLogs_Forbidden_NonAdmin(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/admin/logs", nil)
	req = withNonAdminClaims(req)
	rr := httptest.NewRecorder()

	handlers.AdminLogs(rr, req)

	if rr.Code != http.StatusForbidden {
		t.Errorf("expected 403 for non-admin, got %d", rr.Code)
	}
}

func TestAdminLogs_Forbidden_NoClaims(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/admin/logs", nil)
	rr := httptest.NewRecorder()

	handlers.AdminLogs(rr, req)

	if rr.Code != http.StatusForbidden {
		t.Errorf("expected 403 for no claims, got %d", rr.Code)
	}
}

func TestAdminLogs_PathTraversalBlocked(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/admin/logs?file=../etc/passwd", nil)
	req = withAdminClaims(req)
	rr := httptest.NewRecorder()

	handlers.AdminLogs(rr, req)

	if rr.Code != http.StatusForbidden {
		t.Errorf("expected 403 for path traversal, got %d", rr.Code)
	}
}

func TestAdminLogs_FileNotFound(t *testing.T) {
	tmpDir := t.TempDir()
	handlers.SetLogDir(tmpDir + "/")
	defer handlers.SetLogDir("/var/log/cave/")

	req := httptest.NewRequest(http.MethodGet, "/admin/logs?file=gaada.log", nil)
	req = withAdminClaims(req)
	rr := httptest.NewRecorder()

	handlers.AdminLogs(rr, req)

	if rr.Code != http.StatusNotFound {
		t.Errorf("expected 404 for missing file, got %d", rr.Code)
	}
}

func TestAdminLogs_Success_WithRealFile(t *testing.T) {
	tmpDir := t.TempDir()
	logContent := []byte("[2024-01-01] INFO Server started")
	err := os.WriteFile(filepath.Join(tmpDir, "app.log"), logContent, 0644)
	if err != nil {
		t.Fatal(err)
	}

	handlers.SetLogDir(tmpDir + "/")
	defer handlers.SetLogDir("/var/log/cave/")

	req := httptest.NewRequest(http.MethodGet, "/admin/logs?file=app.log", nil)
	req = withAdminClaims(req)
	rr := httptest.NewRecorder()

	handlers.AdminLogs(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", rr.Code)
	}

	body := rr.Body.String()
	if body != string(logContent) {
		t.Errorf("expected log content '%s', got '%s'", logContent, body)
	}
}

func TestAdminLogs_DefaultFile_WhenNoParam(t *testing.T) {
	tmpDir := t.TempDir()
	logContent := []byte("default app.log content")
	err := os.WriteFile(filepath.Join(tmpDir, "app.log"), logContent, 0644)
	if err != nil {
		t.Fatal(err)
	}

	handlers.SetLogDir(tmpDir + "/")
	defer handlers.SetLogDir("/var/log/cave/")

	req := httptest.NewRequest(http.MethodGet, "/admin/logs", nil)
	req = withAdminClaims(req)
	rr := httptest.NewRecorder()

	handlers.AdminLogs(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected 200 with default app.log, got %d", rr.Code)
	}
}

// Test LFI bypass — intentional vuln buat lab
// "....//secret.txt" → filter hapus "../" → jadi "../secret.txt" → path traversal berhasil
func TestAdminLogs_LFI_DoubledSlashBypass(t *testing.T) {
	tmpDir := t.TempDir()

	secretContent := []byte("flag{ini_flagnya_harusnya}")
	err := os.WriteFile(filepath.Join(tmpDir, "secret.txt"), secretContent, 0644)
	if err != nil {
		t.Fatal(err)
	}

	logSubDir := filepath.Join(tmpDir, "logs")
	os.Mkdir(logSubDir, 0755)
	handlers.SetLogDir(logSubDir + "/")
	defer handlers.SetLogDir("/var/log/cave/")

	req := httptest.NewRequest(http.MethodGet, "/admin/logs?file=....//secret.txt", nil)
	req = withAdminClaims(req)
	rr := httptest.NewRecorder()

	handlers.AdminLogs(rr, req)

	t.Logf("LFI bypass result: status=%d body=%s", rr.Code, rr.Body.String())

	if rr.Code == http.StatusOK {
		t.Log("✓ LFI bypass berhasil — vuln berfungsi sebagai intended")
	} else {
		t.Log("✗ LFI bypass belum work — filter terlalu ketat atau path ga resolve dengan benar")
	}
}
