package repositories

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/models"
)

type RoastingRepository struct {
	Db *sql.DB
}

func (r *RoastingRepository) CreateRoasting(roaster, comment string) (*models.Roasting, error) {

	kueri := "INSERT INTO roasting (roaster, comment, created_at) VALUES (?, ?, ?);"
	result, err := r.Db.Exec(kueri, roaster, comment, time.Now())
	if err != nil {
		return nil, fmt.Errorf("Gagal add comment roasting")
	}
	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}
	return &models.Roasting{
		Id:      int(id),
		Roaster: roaster,
		Comment: comment,
	}, nil
}

func (r *RoastingRepository) GetAllRoasting() ([]models.Roasting, error) {

	kueri := "SELECT id, roaster, comment, created_at FROM roasting"
	rows, err := r.Db.Query(kueri)
	if err != nil {
		return nil, fmt.Errorf("Gagal query roasting")
	}
	defer rows.Close()

	var roastings []models.Roasting
	for rows.Next() {
		var roasting models.Roasting
		err := rows.Scan(&roasting.Id, &roasting.Roaster, &roasting.Comment, &roasting.CreatedAt)
		if err != nil {
			return nil, fmt.Errorf("Ada yg salah di rows next")
		}
		roastings = append(roastings, roasting)
	}

	err = rows.Err()
	if err != nil {
		return nil, fmt.Errorf("Ada yg salah di rows")
	}

	return roastings, nil

}
