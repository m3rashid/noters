package users

import (
	"fmt"
	"noters/utils"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func toPartialUser(user User) fiber.Map {
	return fiber.Map{
		"id":        user.ID,
		"name":      user.Name,
		"email":     user.Email,
		"createdAt": user.CreatedAt,
	}
}

func getUser(ctx *fiber.Ctx) error {
	userId := ctx.Locals("userId").(uint)
	db, err := utils.GetDb()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal_server_error"})
	}

	user := User{}
	if err := db.Where("id = ?", userId).First(&user).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal_server_error"})
	}

	return ctx.JSON(toPartialUser(user))
}

func credentialsLogin(ctx *fiber.Ctx) error {
	loginBody := struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required"`
	}{}
	err := ctx.BodyParser(&loginBody)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request"})
	}

	validate := validator.New()
	err = validate.Struct(loginBody)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request, Validation Failed"})
	}

	db, err := utils.GetDb()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	user := User{}
	if err := db.Where("email = ?", loginBody.Email).First(&user).Error; err != nil || user.ID == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	if !verifyPassword(user.Password, loginBody.Password) {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	token, err := generateJWT(user.ID, user.Email)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	return ctx.JSON(fiber.Map{"token": token, "user": toPartialUser(user)})
}

func credentialsRegister(ctx *fiber.Ctx) error {
	registerBody := struct {
		Name     string `json:"name" validate:"required"`
		Email    string `json:"email" validate:"required,email"`
		Phone    string `json:"phone,omitempty" validate:""`
		Password string `json:"password" validate:"required"`
	}{}

	err := ctx.BodyParser(&registerBody)
	if err != nil {
		fmt.Println(err)
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request 1"})
	}

	validate := validator.New()
	err = validate.Struct(registerBody)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request 2"})
	}

	password, err := hashPassword(registerBody.Password)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	db, err := utils.GetDb()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	newUser := User{
		Name:     registerBody.Name,
		Email:    registerBody.Email,
		Password: password,
	}

	if err := db.Create(newUser).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	token, err := generateJWT(newUser.ID, registerBody.Email)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	return ctx.JSON(fiber.Map{"token": token, "user": toPartialUser(newUser)})
}
