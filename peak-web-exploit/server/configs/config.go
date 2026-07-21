package configs

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

type Config struct {
	HttpAddr string
}

func Load() *Config {
	return &Config{
		HttpAddr: ":8080",
	}
}

func InitDB() *sql.DB {
	db, err := sql.Open("sqlite3", "./data.db")
	if err != nil {
		log.Fatal(err)
	}

	return db

}
