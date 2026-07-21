package main

import (
	"log"
	"net/http"

	"github.com/zams-putra/my-boot2root/peak/peak/server/configs"
	"github.com/zams-putra/my-boot2root/peak/peak/server/internals/handlers"
	"github.com/zams-putra/my-boot2root/peak/peak/server/internals/middlewares"
	"github.com/zams-putra/my-boot2root/peak/peak/server/internals/repositories"
	"github.com/zams-putra/my-boot2root/peak/peak/server/internals/services"
)

func main() {

	cfg := configs.Load()
	db := configs.InitDB()
	defer db.Close()

	userRepo := &repositories.UserRepository{Db: db}
	userService := &services.UserService{Repo: userRepo}

	mux := http.NewServeMux()
	mux.HandleFunc("/test", handlers.TestingHandler)

	// cookie session etc
	mux.HandleFunc("/login", handlers.LoginHandler(userService))
	mux.HandleFunc("/logout", handlers.LogoutHandler())
	mux.HandleFunc("/me", middlewares.JwtMiddleware(handlers.MeHandler, ""))

	// set handler nya di kasih middleware dulu dan harus admin value func midware nya
	mux.HandleFunc("/admin", middlewares.JwtMiddleware(handlers.AdminHandler(), "admin"))
	mux.HandleFunc("/admin/users/", middlewares.JwtMiddleware(handlers.GetUserByIdHandler(userService), ""))
	mux.HandleFunc("/admin/ping", middlewares.JwtMiddleware(handlers.PingHandler(), "admin"))

	log.Println("run at http://127.0.0.1:8080")
	http.ListenAndServe(cfg.HttpAddr, middlewares.CorsMiddleware(mux))

}
