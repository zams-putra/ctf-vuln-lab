package handler_test

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/handlers"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/models"
)

// ---- Mock Service ----

type mockUserService struct {
	registerFn func(username, password string) (*models.User, error)
	loginFn    func(username, password string) (string, error)
}

func (m *mockUserService) Register(username, password string) (*models.User, error) {
	return m.registerFn(username, password)
}

func (m *mockUserService) Login(username, password string) (string, error) {
	return m.loginFn(username, password)
}

func makeHandler(svc *mockUserService) *handlers.UserHandler {
	return &handlers.UserHandler{UserService: svc}
}

func toJSON(t *testing.T, v any) *bytes.Buffer {
	t.Helper()
	b, err := json.Marshal(v)
	if err != nil {
		t.Fatal(err)
	}
	return bytes.NewBuffer(b)
}

// ---- Register ----

func TestRegisterHandler_Success(t *testing.T) {
	svc := &mockUserService{
		registerFn: func(username, password string) (*models.User, error) {
			return &models.User{Id: 1, Username: username}, nil
		},
	}

	h := makeHandler(svc)

	req := httptest.NewRequest(http.MethodPost, "/register",
		toJSON(t, map[string]string{"username": "putra", "password": "password123"}))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	h.Register(rr, req)

	if rr.Code != http.StatusCreated {
		t.Errorf("expected 201, got %d", rr.Code)
	}
}

func TestRegisterHandler_InvalidJSON(t *testing.T) {
	h := makeHandler(&mockUserService{})

	req := httptest.NewRequest(http.MethodPost, "/register", bytes.NewBufferString("invalid"))
	rr := httptest.NewRecorder()

	h.Register(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", rr.Code)
	}
}

// ---- Login ----

func TestLoginHandler_Success(t *testing.T) {
	svc := &mockUserService{
		loginFn: func(username, password string) (string, error) {
			return "valid.jwt.token", nil
		},
	}

	h := makeHandler(svc)

	req := httptest.NewRequest(http.MethodPost, "/login",
		toJSON(t, map[string]string{"username": "putra", "password": "password123"}))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	h.Login(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", rr.Code)
	}

	// cek cookie
	found := false
	for _, c := range rr.Result().Cookies() {
		if c.Name == "kuki" && c.Value == "valid.jwt.token" {
			found = true
		}
	}
	if !found {
		t.Error("cookie kuki not set")
	}

	// cek response
	var resp map[string]string
	json.NewDecoder(rr.Body).Decode(&resp)

	if resp["token"] != "valid.jwt.token" {
		t.Error("token mismatch in response")
	}
}

func TestLoginHandler_InvalidJSON(t *testing.T) {
	h := makeHandler(&mockUserService{})

	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewBufferString("invalid"))
	rr := httptest.NewRecorder()

	h.Login(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", rr.Code)
	}
}

func TestLoginHandler_InvalidCreds(t *testing.T) {
	svc := &mockUserService{
		loginFn: func(username, password string) (string, error) {
			return "", errors.New("invalid")
		},
	}

	h := makeHandler(svc)

	req := httptest.NewRequest(http.MethodPost, "/login",
		toJSON(t, map[string]string{"username": "wrong", "password": "wrong"}))

	rr := httptest.NewRecorder()
	h.Login(rr, req)

	if rr.Code != http.StatusUnauthorized {
		t.Errorf("expected 401, got %d", rr.Code)
	}
}
