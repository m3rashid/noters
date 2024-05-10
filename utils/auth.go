package utils

import (
	"fmt"
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	Email  string `json:"email"`
	UserID string `json:"userId"`
	jwt.RegisteredClaims
}

func CheckAuth(tokenString string) (*Claims, error) {
	if len(tokenString) < 7 {
		return &Claims{}, nil
	}

	clientToken := tokenString[7:]
	token, err := jwt.ParseWithClaims(
		clientToken,
		&Claims{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		},
	)

	if err != nil {
		return &Claims{}, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return &Claims{}, err
	}
	return claims, nil
}

func CheckAuthMiddleware(ctx *fiber.Ctx) error {
	clientToken := ctx.Get("Authorization")
	if clientToken == "" {
		return ctx.Status(fiber.StatusUnauthorized).SendString("No Authorization header provided")
	}

	claims, err := CheckAuth(clientToken)
	if err != nil {
		ctx.Status(fiber.StatusUnauthorized).SendString(err.Error())
	}

	userIdU64, err := strconv.ParseUint(claims.UserID, 10, 32)
	if err != nil {
		return fmt.Errorf("error parsing user id: %v", err)
	}

	ctx.Locals("email", claims.Email)
	ctx.Locals("userId", uint(userIdU64))
	ctx.Locals("authorized", true)

	return ctx.Next()
}
