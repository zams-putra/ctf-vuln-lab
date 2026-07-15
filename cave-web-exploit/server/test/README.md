# Unit Tests - Cave CTF Lab

- generate by AI btw ini unit test nya

## File Structure

Taruh file test ini sesuai package-nya:

```
server/
├── configs/
│   └── config.go
├── internals/
│   ├── bot/
│   │   └── admin_bot.go
│   ├── handlers/
│   │   ├── admin_handler.go
│   │   ├── admin_handler_test.go      ← taruh di sini
│   │   ├── roasting_handler.go
│   │   ├── roasting_handler_test.go   ← taruh di sini
│   │   ├── testing_handler.go
│   │   ├── user_handler.go
│   │   └── user_handler_test.go       ← taruh di sini
│   ├── helper/
│   │   ├── helper.go
│   │   └── helper_test.go             ← taruh di sini
│   ├── middlewares/
│   │   ├── auth_middleware.go
│   │   └── auth_middleware_test.go    ← taruh di sini
│   ├── models/
│   ├── repositories/
│   └── services/
│       ├── user_service.go
│       ├── user_service_test.go        ← taruh di sini
│       ├── roasting_service.go
│       └── roasting_service_test.go   ← taruh di sini
└── main.go
```

## Perubahan yang WAJIB di source code sebelum test bisa compile

### 1. Tambah interface di handlers (supaya mock bisa dipakai)

Di `user_handler.go`, ubah field struct:
```go
// Tambah interface dulu
type UserServiceInterface interface {
    Register(username, password string) (*models.User, error)
    Login(username, password string) (string, error)
}

// Ubah struct
type UserHandler struct {
    UserService UserServiceInterface  // bukan *services.UserService
}
```

Di `roasting_handler.go`:
```go
type RoastingServiceInterface interface {
    AddComment(roaster, comment string) (*models.Roasting, error)
    GetAllComment() ([]models.Roasting, error)
}

type RoastingHandler struct {
    RoastingService RoastingServiceInterface
}
```

### 2. Tambah interface di services (supaya mock repo bisa dipakai)

Di `user_service.go`:
```go
type UserRepoInterface interface {
    RegisterUser(username, password string) (*models.User, error)
    FindByUsername(username, password string) (*models.User, error)
}

type UserService struct {
    UserRepo  UserRepoInterface  // bukan *repositories.UserRepository
    JWTSecret string
}
```

Di `roasting_service.go`:
```go
type RoastingRepoInterface interface {
    CreateRoasting(roaster, comment string) (*models.Roasting, error)
    GetAllRoasting() ([]models.Roasting, error)
}

type RoastingService struct {
    RoastingRepo RoastingRepoInterface
}
```

### 3. Export SetLogDir di admin_handler.go

```go
var logDir = "/var/log/cave"

// Tambah ini
func SetLogDir(dir string) {
    logDir = dir
}
```

## Cara run

```bash
# Run semua test
go test ./...

# Run dengan verbose (lihat nama tiap test)
go test ./... -v

# Run test spesifik satu package
go test ./internals/services/... -v

# Run satu test function
go test ./internals/handlers/... -run TestLoginHandler_Success -v

# Run dengan coverage
go test ./... -cover

# Generate coverage report HTML
go test ./... -coverprofile=coverage.out
go tool cover -html=coverage.out -o coverage.html
```

## Coverage yang diharapkan

| Package     | Target Coverage |
|-------------|----------------|
| services    | ~90%+          |
| handlers    | ~85%+          |
| middlewares | ~95%+          |
| helper      | 100%           |
| admin       | ~80%+          |