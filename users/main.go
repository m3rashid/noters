package users

import (
	"noters/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Post("/auth/login", credentialsLogin)
	app.Post("/auth/register", credentialsRegister)
	app.Get("/auth/user", utils.CheckAuthMiddleware, getUser)
}
