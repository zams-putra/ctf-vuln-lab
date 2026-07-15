package repositories

import (
	"database/sql"
	"fmt"

	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/models"
	"golang.org/x/crypto/bcrypt"
)

type UserRepository struct {
	Db *sql.DB
}

func (r *UserRepository) RegisterUser(username, password string) (*models.User, error) {
	hashedPass, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("Gagal hash pass: %w", err)
	}
	kueri := "INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?);"
	result, err := r.Db.Exec(kueri, username, string(hashedPass), 0)
	if err != nil {
		return nil, fmt.Errorf("Gagal insert user baru: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	return &models.User{
		Id:       int(id),
		Username: username,
	}, err

}

func (r *UserRepository) FindByUsername(username string) (*models.User, error) {
	kueri := "SELECT id, username, password, isAdmin FROM users WHERE username = ?"
	row := r.Db.QueryRow(kueri, username)

	var user models.User
	var hashedPass string

	err := row.Scan(&user.Id, &user.Username, &hashedPass, &user.IsAdmin)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("Invalid users")
		}
		return nil, fmt.Errorf("ada error lah pokoknya: %w", err)
	}

	user.Password = hashedPass

	return &user, nil

}
