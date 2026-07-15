package configs

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
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
	log.Println("awal connect")
	db, err := sql.Open("sqlite", "./data.db")
	if err != nil {
		log.Fatal(err)
	}
	log.Println("akhir connect")
	return db
}
