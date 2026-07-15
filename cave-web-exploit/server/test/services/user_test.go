package services_test

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/models"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/services"
	"golang.org/x/crypto/bcrypt"
)

type MockUserRepo struct{}

func (m *MockUserRepo) RegisterUser(username, password string) (*models.User, error) {
	return &models.User{
		Id:       1,
		Username: username,
		Password: password,
		IsAdmin:  false,
	}, nil
}

func (m *MockUserRepo) FindByUsername(username string) (*models.User, error) {
	// password harus HASH karena service pakai bcrypt compare
	hashed, _ := bcrypt.GenerateFromPassword([]byte("12345678"), bcrypt.DefaultCost)

	return &models.User{
		Id:       1,
		Username: username,
		Password: string(hashed),
		IsAdmin:  false,
	}, nil
}

func TestRegister(t *testing.T) {
	repo := &MockUserRepo{}
	service := services.UserService{
		UserRepo:  repo,
		JWTSecret: "testsecret",
	}

	user, err := service.Register("test", "12345678")

	assert.NoError(t, err)
	assert.Equal(t, "test", user.Username)
}

func TestLogin(t *testing.T) {
	repo := &MockUserRepo{}
	service := services.UserService{
		UserRepo:  repo,
		JWTSecret: "testsecret",
	}

	token, err := service.Login("test", "12345678")

	assert.NoError(t, err)
	assert.NotEmpty(t, token)
}
