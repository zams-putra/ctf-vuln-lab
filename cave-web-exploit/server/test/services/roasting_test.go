package services

import (
	"errors"
	"strings"
	"testing"

	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/models"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/services"
)

// ---- Mock RoastingRepository ----

type mockRoastingRepo struct {
	AddComment    func(roaster, comment string) (*models.Roasting, error)
	GetAllComment func() ([]models.Roasting, error)
}

func (m *mockRoastingRepo) CreateRoasting(roaster, comment string) (*models.Roasting, error) {
	return m.AddComment(roaster, comment)
}

func (m *mockRoastingRepo) GetAllRoasting() ([]models.Roasting, error) {
	return m.GetAllComment()
}

func newRoastingService(repo *mockRoastingRepo) *services.RoastingService {
	return &services.RoastingService{RoastingRepo: repo}
}

// ---- AddComment Tests ----

func TestAddComment_Success(t *testing.T) {
	repo := &mockRoastingRepo{
		AddComment: func(roaster, comment string) (*models.Roasting, error) {
			return &models.Roasting{Id: 1, Roaster: roaster, Comment: comment}, nil
		},
	}
	svc := newRoastingService(repo)

	roasting, err := svc.AddComment("putra", "ini comment valid")
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}
	if roasting.Comment != "ini comment valid" {
		t.Errorf("expected comment 'ini comment valid', got '%s'", roasting.Comment)
	}
}

func TestAddComment_EmptyComment(t *testing.T) {
	svc := newRoastingService(&mockRoastingRepo{})

	_, err := svc.AddComment("putra", "")
	if err == nil {
		t.Fatal("expected error for empty comment, got nil")
	}
}

func TestAddComment_CommentTooLong(t *testing.T) {
	svc := newRoastingService(&mockRoastingRepo{})

	longComment := strings.Repeat("a", 501)
	_, err := svc.AddComment("putra", longComment)
	if err == nil {
		t.Fatal("expected error for comment > 500 chars, got nil")
	}
}

func TestAddComment_ExactlyMaxLength(t *testing.T) {
	repo := &mockRoastingRepo{
		AddComment: func(roaster, comment string) (*models.Roasting, error) {
			return &models.Roasting{Id: 1, Roaster: roaster, Comment: comment}, nil
		},
	}
	svc := newRoastingService(repo)

	exactComment := strings.Repeat("a", 500)
	_, err := svc.AddComment("putra", exactComment)
	if err != nil {
		t.Fatalf("expected no error for 500-char comment, got: %v", err)
	}
}

func TestAddComment_RepoError(t *testing.T) {
	repo := &mockRoastingRepo{
		AddComment: func(roaster, comment string) (*models.Roasting, error) {
			return nil, errors.New("db error")
		},
	}
	svc := newRoastingService(repo)

	_, err := svc.AddComment("putra", "valid comment")
	if err == nil {
		t.Fatal("expected repo error, got nil")
	}
}

// ---- GetAllComment Tests ----

func TestGetAllComment_Success(t *testing.T) {
	repo := &mockRoastingRepo{
		GetAllComment: func() ([]models.Roasting, error) {
			return []models.Roasting{
				{Id: 1, Roaster: "putra", Comment: "test comment"},
				{Id: 2, Roaster: "user2", Comment: "test comment 2"},
			}, nil
		},
	}
	svc := newRoastingService(repo)

	roastings, err := svc.GetAllComment()
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}
	if len(roastings) != 2 {
		t.Errorf("expected 2 roastings, got %d", len(roastings))
	}
}

func TestGetAllComment_Empty(t *testing.T) {
	repo := &mockRoastingRepo{
		GetAllComment: func() ([]models.Roasting, error) {
			return []models.Roasting{}, nil
		},
	}
	svc := newRoastingService(repo)

	roastings, err := svc.GetAllComment()
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}
	if len(roastings) != 0 {
		t.Errorf("expected 0 roastings, got %d", len(roastings))
	}
}

func TestGetAllComment_RepoError(t *testing.T) {
	repo := &mockRoastingRepo{
		GetAllComment: func() ([]models.Roasting, error) {
			return nil, errors.New("db error")
		},
	}
	svc := newRoastingService(repo)

	_, err := svc.GetAllComment()
	if err == nil {
		t.Fatal("expected repo error, got nil")
	}
}
