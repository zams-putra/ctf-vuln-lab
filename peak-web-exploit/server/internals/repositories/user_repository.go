package repositories

import (
	"database/sql"
	"fmt"

	"github.com/zams-putra/my-boot2root/peak/peak/server/internals/models"
)

type UserRepository struct {
	Db *sql.DB
}

func (r *UserRepository) FindByUsername(username, password string) (*models.User, error) {
	kueri := fmt.Sprintf("SELECT * FROM users WHERE username = '%s' AND password = '%s'", username, password)
	// fmt.Println("QUERY:", kueri)
	rows, err := r.Db.Query(kueri)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var user []models.User
	for rows.Next() {
		var u models.User
		rows.Scan(&u.Id, &u.Username, &u.Password, &u.Role)
		user = append(user, u)
	}
	if len(user) != 1 {
		return nil, fmt.Errorf("Query ga ke 1 users, ini kayaknya lagi di sqli")
	}
	return &user[0], nil
}

func (r *UserRepository) FindById(id int) (*models.User, error) {
	kueri := fmt.Sprintf("SELECT * FROM users WHERE id = %d", id)
	row := r.Db.QueryRow(kueri)
	var u models.User
	err := row.Scan(&u.Id, &u.Username, &u.Password, &u.Role)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	}
	if err != nil {
		return nil, err
	}
	return &u, nil
}
