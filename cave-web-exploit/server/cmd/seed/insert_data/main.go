package main

import (
	"database/sql"
	"log"

	"golang.org/x/crypto/bcrypt"
	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "./data.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	hashedPass, err := bcrypt.GenerateFromPassword([]byte("atminnihyh"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec("INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)", "usernamenya", string(hashedPass), 1)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("New user inserted sucessfully user balu")
}
