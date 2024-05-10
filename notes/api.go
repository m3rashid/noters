package notes

import (
	"fmt"
	"noters/utils"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func createNote(ctx *fiber.Ctx) error {
	userId := ctx.Locals("userId").(uint)
	fmt.Println("User ID: ", userId)

	note := Note{
		UserID: userId,
	}
	if err := ctx.BodyParser(note); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request"})
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
	fmt.Println("User ID: ", userId)

	note := Note{}
	if err := ctx.BodyParser(note); err != nil {
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
	fmt.Println("User ID: ", userId)

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

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Note deleted"})
}

func getNotes(ctx *fiber.Ctx) error {
	userId := ctx.Locals("userId").(uint)
	fmt.Println("User ID: ", userId)

	Limit, err := strconv.Atoi(ctx.Params("limit"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request"})
	}

	Skip, err := strconv.Atoi(ctx.Params("skip"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request"})
	}

	fmt.Println("Limit: ", Limit, " and Skip: ", Skip)

	skip := max(Skip, 0)
	limit := min(Limit, 30)

	db, err := utils.GetDb()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	notes := []Note{}
	if err := db.Where("userId = ?", userId).Order("id DESC").Limit(limit).Offset(skip).Find(&notes).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"notes": notes,
		"count": len(notes),
	})
}
