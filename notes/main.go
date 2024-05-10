package notes

import (
	"noters/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/notes", utils.CheckAuthMiddleware, getNotes)
	app.Post("/notes/create", utils.CheckAuthMiddleware, createNote)
	app.Post("/notes/update", utils.CheckAuthMiddleware, updateNote)
	app.Post("/notes/delete", utils.CheckAuthMiddleware, deleteNote)
}
