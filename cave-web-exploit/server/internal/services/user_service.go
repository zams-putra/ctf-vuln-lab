package services

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/models"
	"golang.org/x/crypto/bcrypt"
)

type UserRepositoryInterface interface {
	RegisterUser(username, password string) (*models.User, error)
	FindByUsername(username string) (*models.User, error)
}

type UserService struct {
	UserRepo  UserRepositoryInterface
	JWTSecret string
}

func (s *UserService) Register(username, password string) (*models.User, error) {
	if len(username) < 3 || len(username) > 32 {
		return nil, fmt.Errorf("Minimal username 3 - 32 panjangnya")
	}

	if len(password) < 8 {
		return nil, fmt.Errorf("Minimal password 8 panjangnya")
	}
	return s.UserRepo.RegisterUser(username, password)
}

func (s *UserService) Login(username, password string) (string, error) {
	user, err := s.UserRepo.FindByUsername(username)
	if err != nil {
		return "", fmt.Errorf("User gada: %w", err)
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", fmt.Errorf("password salah")
	}

	token, err := s.generateToken(user)
	if err != nil {
		return "", fmt.Errorf("gagal generate token: %w", err)
	}

	return token, err

}

// ----------------------------------------------

func (s *UserService) generateToken(user *models.User) (string, error) {
	claims := models.Claims{
		Id:       user.Id,
		Username: user.Username,
		IsAdmin:  user.IsAdmin,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.JWTSecret))
}

func (s *UserService) GenerateAdminToken() (string, error) {
	adminUser := &models.User{
		Id:       1,
		Username: "Admin",
		IsAdmin:  true,
	}
	return s.generateToken(adminUser)
}
