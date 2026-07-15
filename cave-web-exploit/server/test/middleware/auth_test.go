package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/middlewares"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/models"
)

const testSecret = "testsecret"

func makeToken(claims *models.Claims, secret string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func validClaims(isAdmin bool) *models.Claims {
	return &models.Claims{
		Id:       1,
		Username: "testuser",
		IsAdmin:  isAdmin,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
}

func TestAuthMiddleware_ValidToken(t *testing.T) {
	token, err := makeToken(validClaims(false), testSecret)
	if err != nil {
		t.Fatal(err)
	}

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.AddCookie(&http.Cookie{Name: "kuki", Value: token})
	rr := httptest.NewRecorder()

	called := false
	handler := middlewares.AuthMiddleware(testSecret, func(w http.ResponseWriter, r *http.Request) {
		called = true
		w.WriteHeader(http.StatusOK)
	})

	handler(rr, req)

	if !called {
		t.Error("expected next handler to be called, but it wasn't")
	}
	if rr.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", rr.Code)
	}
}

func TestAuthMiddleware_NoCookie(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rr := httptest.NewRecorder()

	called := false
	handler := middlewares.AuthMiddleware(testSecret, func(w http.ResponseWriter, r *http.Request) {
		called = true
	})

	handler(rr, req)

	if called {
		t.Error("expected next handler NOT to be called")
	}
	if rr.Code != http.StatusUnauthorized {
		t.Errorf("expected 401, got %d", rr.Code)
	}
}

func TestAuthMiddleware_InvalidToken(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.AddCookie(&http.Cookie{Name: "kuki", Value: "ini.token.palsu"})
	rr := httptest.NewRecorder()

	called := false
	handler := middlewares.AuthMiddleware(testSecret, func(w http.ResponseWriter, r *http.Request) {
		called = true
	})

	handler(rr, req)

	if called {
		t.Error("expected next handler NOT to be called")
	}
	if rr.Code != http.StatusUnauthorized {
		t.Errorf("expected 401, got %d", rr.Code)
	}
}

func TestAuthMiddleware_ExpiredToken(t *testing.T) {
	claims := &models.Claims{
		Id:       1,
		Username: "testuser",
		IsAdmin:  false,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(-1 * time.Hour)), // sudah expired
			IssuedAt:  jwt.NewNumericDate(time.Now().Add(-2 * time.Hour)),
		},
	}
	token, err := makeToken(claims, testSecret)
	if err != nil {
		t.Fatal(err)
	}

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.AddCookie(&http.Cookie{Name: "kuki", Value: token})
	rr := httptest.NewRecorder()

	called := false
	handler := middlewares.AuthMiddleware(testSecret, func(w http.ResponseWriter, r *http.Request) {
		called = true
	})

	handler(rr, req)

	if called {
		t.Error("expected next handler NOT to be called for expired token")
	}
	if rr.Code != http.StatusUnauthorized {
		t.Errorf("expected 401, got %d", rr.Code)
	}
}

func TestAuthMiddleware_WrongSecret(t *testing.T) {
	token, err := makeToken(validClaims(false), "rahasialain")
	if err != nil {
		t.Fatal(err)
	}

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.AddCookie(&http.Cookie{Name: "kuki", Value: token})
	rr := httptest.NewRecorder()

	called := false
	handler := middlewares.AuthMiddleware(testSecret, func(w http.ResponseWriter, r *http.Request) {
		called = true
	})

	handler(rr, req)

	if called {
		t.Error("expected next handler NOT to be called for wrong secret")
	}
	if rr.Code != http.StatusUnauthorized {
		t.Errorf("expected 401, got %d", rr.Code)
	}
}

func TestAuthMiddleware_AdminClaimsPassedInContext(t *testing.T) {
	token, err := makeToken(validClaims(true), testSecret)
	if err != nil {
		t.Fatal(err)
	}

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.AddCookie(&http.Cookie{Name: "kuki", Value: token})
	rr := httptest.NewRecorder()

	handler := middlewares.AuthMiddleware(testSecret, func(w http.ResponseWriter, r *http.Request) {
		claims, ok := r.Context().Value(middlewares.ClaimsKey).(*models.Claims)
		if !ok {
			t.Error("claims not found in context")
			return
		}
		if !claims.IsAdmin {
			t.Error("expected IsAdmin = true in claims")
		}
		w.WriteHeader(http.StatusOK)
	})

	handler(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", rr.Code)
	}
}
