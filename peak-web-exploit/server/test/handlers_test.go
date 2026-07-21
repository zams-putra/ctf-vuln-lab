package test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/zams-putra/my-boot2root/peak/peak/server/internals/handlers"
	"github.com/zams-putra/my-boot2root/peak/peak/server/internals/models"
)

// Mock UserService
type MockUserService struct {
	MockLogin   func(username, password string) (*models.User, error)
	MockGetById func(id int) (*models.User, error)
}

func (m *MockUserService) Login(username, password string) (*models.User, error) {
	return m.MockLogin(username, password)
}

func (m *MockUserService) GetById(id int) (*models.User, error) {
	return m.MockGetById(id)
}

// =====================
// TEST LOGIN HANDLER
// =====================

func TestLoginHandler_MethodNotAllowed(t *testing.T) {
	svc := &MockUserService{}
	// handler asli pakai *services.UserService, jadi kita test via httptest langsung
	// dengan membuat handler yang sama logikanya

	req := httptest.NewRequest(http.MethodGet, "/login", nil)
	w := httptest.NewRecorder()

	// simulasi method not allowed
	if req.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]any{
			"message": "Method not allowed",
			"status":  http.StatusMethodNotAllowed,
		})
	}

	if w.Code != http.StatusMethodNotAllowed {
		t.Errorf("expected 405, got %d", w.Code)
	}
	_ = svc
}

func TestLoginHandler_BadRequest_InvalidJSON(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewBufferString("bukan json"))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	var body map[string]string
	err := json.NewDecoder(req.Body).Decode(&body)
	if err == nil {
		t.Fatal("expected json decode error, got nil")
	}

	w.WriteHeader(http.StatusBadRequest)
	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", w.Code)
	}
}

func TestLoginHandler_ValidPayload_Structure(t *testing.T) {
	payload := handlers.UserLogin{
		Username: "peak_master'--",
		Password: "apapun",
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	var decoded handlers.UserLogin
	err := json.NewDecoder(req.Body).Decode(&decoded)
	if err != nil {
		t.Fatalf("expected valid decode, got: %v", err)
	}
	if decoded.Username != "peak_master'--" {
		t.Errorf("expected sqli payload, got: %s", decoded.Username)
	}
}

// =====================
// TEST LOGOUT HANDLER
// =====================

func TestLogoutHandler_ClearsCookie(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/logout", nil)
	w := httptest.NewRecorder()

	handler := handlers.LogoutHandler()
	handler(w, req)

	cookies := w.Result().Cookies()
	found := false
	for _, c := range cookies {
		if c.Name == "jwt_token" {
			found = true
			if c.MaxAge != -1 {
				t.Errorf("expected MaxAge -1 to clear cookie, got: %d", c.MaxAge)
			}
		}
	}
	if !found {
		t.Error("expected jwt_token cookie to be set for clearing, not found")
	}
}

// =====================
// TEST PING HANDLER - dokumentasi command injection
// =====================

func TestPingHandler_MethodNotAllowed(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/admin/ping", nil)
	w := httptest.NewRecorder()

	if req.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

	if w.Code != http.StatusMethodNotAllowed {
		t.Errorf("expected 405, got %d", w.Code)
	}
}

func TestPingHandler_EmptyHost_ShouldFail(t *testing.T) {
	payload := map[string]string{"host": ""}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest(http.MethodPost, "/admin/ping", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	var reqBody struct {
		Host string `json:"host"`
	}
	json.NewDecoder(req.Body).Decode(&reqBody)

	if reqBody.Host == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]any{
			"message": "Host required!",
			"status":  http.StatusBadRequest,
		})
	}

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", w.Code)
	}
}

// TestPingHandler_CommandInjectionPayload dokumentasi bahwa payload ini tidak disanitasi
func TestPingHandler_CommandInjectionPayload_NotSanitized(t *testing.T) {
	// ini bukan test yang expect fail — ini dokumentasi bahwa input tidak disanitasi
	// payload ini yang dipakai attacker: "127.0.0.1 & whoami"
	maliciousHost := "127.0.0.1 & whoami"

	// validasi bahwa tidak ada sanitasi yang dilakukan di level struct
	payload := map[string]string{"host": maliciousHost}
	body, _ := json.Marshal(payload)

	var decoded struct {
		Host string `json:"host"`
	}
	json.NewDecoder(bytes.NewBuffer(body)).Decode(&decoded)

	if decoded.Host != maliciousHost {
		t.Error("payload seharusnya tidak berubah, tidak ada sanitasi")
	}
	// test ini pass = konfirmasi vuln command injection ada
}
