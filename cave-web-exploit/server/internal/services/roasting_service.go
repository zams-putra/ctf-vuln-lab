package services

import (
	"fmt"

	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/models"
)

type RoastingRepositoryInterface interface {
	CreateRoasting(roaster, comment string) (*models.Roasting, error)
	GetAllRoasting() ([]models.Roasting, error)
}

type RoastingService struct {
	RoastingRepo RoastingRepositoryInterface
}

func (s *RoastingService) AddComment(roaster, comment string) (*models.Roasting, error) {
	if len(comment) == 0 {
		return nil, fmt.Errorf("Kosong gitu gimana mau nambahin komen")
	}
	if len(comment) > 500 {
		return nil, fmt.Errorf("Mucho texto, jangan banyak2")
	}
	return s.RoastingRepo.CreateRoasting(roaster, comment)
}

func (s *RoastingService) GetAllComment() ([]models.Roasting, error) {

	return s.RoastingRepo.GetAllRoasting()
}
