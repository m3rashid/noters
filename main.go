package main

import (
	"fmt"
	"log"
	"noters/notes"
	"noters/users"
	"noters/utils"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	fmt.Println("Environment Variables Loaded")
}

func main() {
	app := fiber.New(fiber.Config{
		CaseSensitive:         true,
		PassLocalsToViews:     true,
		AppName:               os.Getenv("APP_NAME"),
		RequestMethods:        []string{"GET", "POST", "HEAD", "OPTIONS"},
		Concurrency:           256 * 1024 * 1024,
		ServerHeader:          os.Getenv("APP_NAME"),
		DisableStartupMessage: true,
		ErrorHandler: func(ctx *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return ctx.Status(code).JSON(fiber.Map{"success": false, "message": err.Error()})
		},
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowCredentials: true,
	}))

	app.Get("/", func(ctx *fiber.Ctx) error {
		return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Welcome to Noters API"})
	})

	users.Setup(app)
	notes.Setup(app)

	if os.Getenv("SERVER_MODE") == "development" {
		app.Use(logger.New())
	}

	db, err := utils.GetDb()
	if err != nil {
		log.Fatal("Error connecting to database")
	}
	db.AutoMigrate(&users.User{}, &notes.Note{})

	log.Println("Server is running in " + os.Getenv("SERVER_MODE") + " mode.")
	app.Listen(":" + os.Getenv("SERVER_PORT"))
}
