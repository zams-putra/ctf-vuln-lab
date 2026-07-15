package main

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "./data.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	sqlStatement := `
			CREATE TABLE IF NOT EXISTS users (
			id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL,
			password TEXT NOT NULL,
			isAdmin INTEGER NOT NULL
		);

		CREATE TABLE IF NOT EXISTS roasting (
			id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			roaster TEXT NOT NULL,
			comment TEXT NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`

	_, err = db.Exec(sqlStatement)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Tables 'users' dan 'roasting' dah dibuat tuh")

}
