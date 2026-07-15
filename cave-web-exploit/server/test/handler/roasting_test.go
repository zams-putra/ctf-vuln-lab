package handler_test

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/handlers"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/middlewares"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/models"
)

// ---- Mock RoastingService ----

type mockRoastingService struct {
	addCommentFn    func(roaster, comment string) (*models.Roasting, error)
	getAllCommentFn func() ([]models.Roasting, error)
}

func (m *mockRoastingService) AddComment(roaster, comment string) (*models.Roasting, error) {
	return m.addCommentFn(roaster, comment)
}

func (m *mockRoastingService) GetAllComment() ([]models.Roasting, error) {
	return m.getAllCommentFn()
}

func makeRoastingHandler(svc *mockRoastingService) *handlers.RoastingHandler {
	return &handlers.RoastingHandler{RoastingService: svc}
}

func withClaims(r *http.Request, claims *models.Claims) *http.Request {
	ctx := context.WithValue(r.Context(), middlewares.ClaimsKey, claims)
	return r.WithContext(ctx)
}

// ---- AddComment Tests ----

func TestAddComment_Success(t *testing.T) {
	svc := &mockRoastingService{
		addCommentFn: func(roaster, comment string) (*models.Roasting, error) {
			return &models.Roasting{Id: 1, Roaster: roaster, Comment: comment}, nil
		},
	}
	h := makeRoastingHandler(svc)

	body := bytes.NewBufferString(`{"comment":"ini roasting valid"}`)
	req := httptest.NewRequest(http.MethodPost, "/roasting", body)
	req.Header.Set("Content-Type", "application/json")
	req = withClaims(req, &models.Claims{Id: 1, Username: "putra"})
	rr := httptest.NewRecorder()

	h.AddComment(rr, req)

	if rr.Code != http.StatusCreated {
		t.Errorf("expected 201, got %d", rr.Code)
	}
}

func TestAddComment_NoClaims(t *testing.T) {
	h := makeRoastingHandler(&mockRoastingService{})

	body := bytes.NewBufferString(`{"comment":"test"}`)
	req := httptest.NewRequest(http.MethodPost, "/roasting", body)
	rr := httptest.NewRecorder()

	h.AddComment(rr, req)

	if rr.Code != http.StatusUnauthorized {
		t.Errorf("expected 401, got %d", rr.Code)
	}
}

func TestAddComment_InvalidJSON(t *testing.T) {
	h := makeRoastingHandler(&mockRoastingService{})

	req := httptest.NewRequest(http.MethodPost, "/roasting", bytes.NewBufferString("bukan json"))
	req = withClaims(req, &models.Claims{Username: "putra"})
	rr := httptest.NewRecorder()

	h.AddComment(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", rr.Code)
	}
}

func TestAddComment_ServiceError(t *testing.T) {
	svc := &mockRoastingService{
		addCommentFn: func(roaster, comment string) (*models.Roasting, error) {
			return nil, errors.New("comment terlalu panjang")
		},
	}
	h := makeRoastingHandler(svc)

	body := bytes.NewBufferString(`{"comment":"valid"}`)
	req := httptest.NewRequest(http.MethodPost, "/roasting", body)
	req = withClaims(req, &models.Claims{Username: "putra"})
	rr := httptest.NewRecorder()

	h.AddComment(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", rr.Code)
	}
}

// ---- GetAllComment Tests ----

func TestGetAllComment_Success(t *testing.T) {
	svc := &mockRoastingService{
		getAllCommentFn: func() ([]models.Roasting, error) {
			return []models.Roasting{
				{Id: 1, Roaster: "putra", Comment: "test 1"},
				{Id: 2, Roaster: "user2", Comment: "test 2"},
			}, nil
		},
	}
	h := makeRoastingHandler(svc)

	req := httptest.NewRequest(http.MethodGet, "/roasting", nil)
	rr := httptest.NewRecorder()

	h.GetAllComment(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", rr.Code)
	}

	var result []models.Roasting
	json.NewDecoder(rr.Body).Decode(&result)
	if len(result) != 2 {
		t.Errorf("expected 2 roastings in response, got %d", len(result))
	}
}

func TestGetAllComment_ServiceError(t *testing.T) {
	svc := &mockRoastingService{
		getAllCommentFn: func() ([]models.Roasting, error) {
			return nil, errors.New("db error")
		},
	}
	h := makeRoastingHandler(svc)

	req := httptest.NewRequest(http.MethodGet, "/roasting", nil)
	rr := httptest.NewRecorder()

	h.GetAllComment(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", rr.Code)
	}
}

func TestGetAllComment_EmptyResult(t *testing.T) {
	svc := &mockRoastingService{
		getAllCommentFn: func() ([]models.Roasting, error) {
			return []models.Roasting{}, nil
		},
	}
	h := makeRoastingHandler(svc)

	req := httptest.NewRequest(http.MethodGet, "/roasting", nil)
	rr := httptest.NewRecorder()

	h.GetAllComment(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", rr.Code)
	}
}
