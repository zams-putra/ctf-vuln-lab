package test

import (
	"fmt"
	"testing"

	"github.com/zams-putra/my-boot2root/peak/peak/server/internals/models"
	"github.com/zams-putra/my-boot2root/peak/peak/server/internals/repositories"
)

type MockUserRepository struct {
	MockFindByUsername func(username, password string) (*models.User, error)
	MockFindById       func(id int) (*models.User, error)
}

func (m *MockUserRepository) FindByUsername(username, password string) (*models.User, error) {
	return m.MockFindByUsername(username, password)
}

func (m *MockUserRepository) FindById(id int) (*models.User, error) {
	return m.MockFindById(id)
}

// Buat UserService pakai interface biar bisa di-mock
type UserRepositoryInterface interface {
	FindByUsername(username, password string) (*models.User, error)
	FindById(id int) (*models.User, error)
}

type UserServiceMockable struct {
	Repo UserRepositoryInterface
}

func (s *UserServiceMockable) Login(username, password string) (*models.User, error) {
	blacklist := []string{" "}
	for _, v := range blacklist {
		if contains(username, v) {
			return nil, fmt.Errorf("Nice try, nt nt")
		}
	}
	user, err := s.Repo.FindByUsername(username, password)
	if err != nil {
		return nil, fmt.Errorf("Invalid creds")
	}
	return user, nil
}

func (s *UserServiceMockable) GetById(id int) (*models.User, error) {
	user, err := s.Repo.FindById(id)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(substr) == 0 ||
		(len(s) > 0 && len(substr) > 0 && findSubstr(s, substr)))
}

func findSubstr(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}

// =====================
// TEST LOGIN
// =====================

func TestLogin_Success(t *testing.T) {
	mockRepo := &MockUserRepository{
		MockFindByUsername: func(username, password string) (*models.User, error) {
			return &models.User{Id: 1, Username: "peak_master", Role: "user"}, nil
		},
	}
	svc := &UserServiceMockable{Repo: mockRepo}

	user, err := svc.Login("peak_master", "password123")
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}
	if user.Username != "peak_master" {
		t.Errorf("expected username peak_master, got: %s", user.Username)
	}
}

func TestLogin_WithSpaceInUsername_ShouldFail(t *testing.T) {
	mockRepo := &MockUserRepository{
		MockFindByUsername: func(username, password string) (*models.User, error) {
			return nil, fmt.Errorf("should not be called")
		},
	}
	svc := &UserServiceMockable{Repo: mockRepo}

	_, err := svc.Login("peak master", "password123")
	if err == nil {
		t.Fatal("expected error for username with space, got nil")
	}
	if err.Error() != "Nice try, nt nt" {
		t.Errorf("expected 'Nice try, nt nt', got: %s", err.Error())
	}
}

func TestLogin_SQLInjectionWithComment_ShouldPass(t *testing.T) {
	// ini test untuk dokumentasi bahwa sqli dengan comment masih lolos blacklist
	// karena blacklist hanya cek spasi, bukan --
	mockRepo := &MockUserRepository{
		MockFindByUsername: func(username, password string) (*models.User, error) {
			// simulasi sqli berhasil bypass
			return &models.User{Id: 1, Username: "peak_master", Role: "admin"}, nil
		},
	}
	svc := &UserServiceMockable{Repo: mockRepo}

	user, err := svc.Login("peak_master'--", "apapun")
	if err != nil {
		t.Fatalf("sqli dengan comment lolos blacklist tapi repo error: %v", err)
	}
	if user == nil {
		t.Fatal("expected user, got nil")
	}
}

func TestLogin_InvalidCreds(t *testing.T) {
	mockRepo := &MockUserRepository{
		MockFindByUsername: func(username, password string) (*models.User, error) {
			return nil, fmt.Errorf("user not found")
		},
	}
	svc := &UserServiceMockable{Repo: mockRepo}

	_, err := svc.Login("salah", "salah")
	if err == nil {
		t.Fatal("expected error, got nil")
	}
	if err.Error() != "Invalid creds" {
		t.Errorf("expected 'Invalid creds', got: %s", err.Error())
	}
}

// =====================
// TEST GET BY ID
// =====================

func TestGetById_Success(t *testing.T) {
	mockRepo := &MockUserRepository{
		MockFindById: func(id int) (*models.User, error) {
			return &models.User{Id: 1, Username: "peak_master", Role: "user"}, nil
		},
	}
	svc := &UserServiceMockable{Repo: mockRepo}

	user, err := svc.GetById(1)
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}
	if user.Id != 1 {
		t.Errorf("expected id 1, got: %d", user.Id)
	}
}

func TestGetById_NotFound(t *testing.T) {
	mockRepo := &MockUserRepository{
		MockFindById: func(id int) (*models.User, error) {
			return nil, fmt.Errorf("user not found")
		},
	}
	svc := &UserServiceMockable{Repo: mockRepo}

	_, err := svc.GetById(999)
	if err == nil {
		t.Fatal("expected error, got nil")
	}
}

// dummy agar import repositories tidak unused
var _ = repositories.UserRepository{}
