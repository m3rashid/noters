package notes

import (
	"fmt"
	"noters/utils"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func createNote(ctx *fiber.Ctx) error {
	userId := ctx.Locals("userId").(uint)
	note := Note{
		UserID: userId,
	}
	if err := ctx.BodyParser(&note); err != nil {
		fmt.Println(err.Error())
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request"})
	}

	if note.Status == "" || (note.Status != "todo" && note.Status != "in_progress" && note.Status != "done") {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request, Status must be todo, in_progress or done"})
	}

	validate := validator.New()
	if err := validate.Struct(note); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request, Validation Failed"})
	}

	db, err := utils.GetDb()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	if err := db.Create(&note).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(note)
}

func updateNote(ctx *fiber.Ctx) error {
	userId := ctx.Locals("userId").(uint)

	note := Note{}
	if err := ctx.BodyParser(&note); err != nil {
		fmt.Println(err.Error())
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request"})
	}

	validate := validator.New()
	if err := validate.Struct(note); err != nil || note.ID == 0 {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request, Validation Failed"})
	}

	db, err := utils.GetDb()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	oldNote := Note{}
	if err := db.Where("id = ?", note.ID).First(&oldNote).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Note not found"})
	}

	if oldNote.UserID != userId {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	if err := db.Save(&note).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	return ctx.Status(fiber.StatusOK).JSON(note)
}

func deleteNote(ctx *fiber.Ctx) error {
	userId := ctx.Locals("userId").(uint)

	deleteBody := struct {
		ID uint `json:"id" validate:"required"`
	}{}

	if err := ctx.BodyParser(&deleteBody); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request"})
	}

	validate := validator.New()
	if err := validate.Struct(deleteBody); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request, Validation Failed"})
	}

	db, err := utils.GetDb()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	oldNote := Note{}
	if err := db.Where("id = ?", deleteBody.ID).First(&oldNote).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Note not found"})
	}

	if oldNote.UserID != userId {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	note := Note{}
	if err := db.Where("id = ?", deleteBody.ID).First(&note).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Note not found"})
	}

	note.Deleted = true
	if err := db.Save(&note).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Note deleted"})
}

func getNotes(ctx *fiber.Ctx) error {
	userId := ctx.Locals("userId").(uint)

	db, err := utils.GetDb()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	notes := []Note{}
	if err := db.Where("\"userId\" = ? and deleted = false", userId).Order("id DESC").Find(&notes).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"notes": notes,
		"count": len(notes),
	})
}
