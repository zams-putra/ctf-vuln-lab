package main

import (
	"log"
	"net/http"
	"os"

	"github.com/zams-putra/my-boot2root/cave/cave/server/configs"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/bot"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/handlers"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/helper"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/middlewares"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/models"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/repositories"
	"github.com/zams-putra/my-boot2root/cave/cave/server/internal/services"
)

func main() {

	db := configs.InitDB()
	jwtSecret := os.Getenv("JWT_SECRET")
	log.Printf("JWT_SECRET: '%s' (len=%d)", jwtSecret, len(jwtSecret))
	defer db.Close()

	userRepo := &repositories.UserRepository{
		Db: db,
	}

	roastingRepo := &repositories.RoastingRepository{
		Db: db,
	}

	userService := &services.UserService{
		UserRepo:  userRepo,
		JWTSecret: jwtSecret,
	}
	roastingService := &services.RoastingService{
		RoastingRepo: roastingRepo,
	}

	userHandler := &handlers.UserHandler{
		UserService: userService,
	}
	roastingHandler := &handlers.RoastingHandler{
		RoastingService: roastingService,
	}

	// bot disini
	adminToken, err := userService.GenerateAdminToken()
	if err != nil {
		log.Fatal("Gagal generate admin token: ", err)
	}

	// dev
	// adminBot := &bot.AdminBot{
	// 	AdminCookie: adminToken,
	// 	TargetURL:   "http://localhost:5173/roasting",
	// }

	// prods
	adminBot := &bot.AdminBot{
		AdminCookie: adminToken,
		TargetURL:   "http://client:80/roasting",
	}
	go adminBot.Start()

	mux := http.NewServeMux()
	mux.HandleFunc("/api/test", handlers.TestingHandlers)

	mux.HandleFunc("POST /api/register", userHandler.Register)
	mux.HandleFunc("POST /api/login", userHandler.Login)

	mux.HandleFunc("GET /api/roasting", middlewares.AuthMiddleware(jwtSecret, roastingHandler.GetAllComment))
	mux.HandleFunc("POST /api/roasting", middlewares.AuthMiddleware(jwtSecret, roastingHandler.AddComment))

	mux.HandleFunc("GET /api/me", middlewares.AuthMiddleware(jwtSecret, func(w http.ResponseWriter, r *http.Request) {
		claims := r.Context().Value(middlewares.ClaimsKey).(*models.Claims)
		helper.WriteJSON(w, http.StatusOK, claims)
	}))
	mux.HandleFunc("GET /api/admin/logs", middlewares.AuthMiddleware(jwtSecret, handlers.AdminLogs))

	log.Println("Run at http://127.0.0.1:8080")
	http.ListenAndServe(":8080", mux)

}
