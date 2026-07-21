package services

import (
	"fmt"
	"strings"

	"github.com/zams-putra/my-boot2root/peak/peak/server/internals/models"
	"github.com/zams-putra/my-boot2root/peak/peak/server/internals/repositories"
)

type UserService struct {
	Repo *repositories.UserRepository
}

func (s *UserService) Login(username, password string) (*models.User, error) {

	blacklist := []string{" "}
	for _, v := range blacklist {
		if strings.Contains(username, v) {
			return nil, fmt.Errorf("Nice try, nt nt")
		}
	}

	user, err := s.Repo.FindByUsername(username, password)
	if err != nil {
		return nil, fmt.Errorf("Invalid creds")
	}
	return user, nil

}

func (s *UserService) GetById(id int) (*models.User, error) {
	user, err := s.Repo.FindById(id)
	if err != nil {
		return nil, err
	}
	return user, nil
}
