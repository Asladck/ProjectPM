package handler

import (
	"Pjpro/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"net/http"
)

// @Summary      Регистрация пользователя
// @Description  Создаёт нового пользователя и возвращает его ID
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        input  body      models.User  true  "Информация о пользователе"
// @Success      200    {object}  map[string]interface{}
// @Failure      400    {object}  handler.Error
// @Failure      500    {object}  handler.Error
// @Router       /auth/sign-up [post]
func (h *Handler) signUp(c *gin.Context) {
	var input models.SignUpRequest
	if err := c.BindJSON(&input); err != nil {
		logrus.Printf("Invalid input: %v", err.Error())
		NewErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	id, err := h.service.Auth.Create(input)
	if err != nil {
		logrus.Printf("User registration failed: %v", err.Error())
		NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	logrus.Printf("User with id: %v just registered", id)
	c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
	})
}

func (h *Handler) signIn(c *gin.Context) {
	var input models.SignInInput
	if err := c.ShouldBindJSON(&input); err != nil {
		NewErrorResponse(c, http.
			StatusBadRequest, err.Error())
		return
	}
	tokenA, tokenR, err := h.service.Auth.GenerateToken(input.Password, input.Email)
	if err != nil {
		NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, map[string]interface{}{
		"access_token":  tokenA,
		"refresh_token": tokenR,
	})
}

// Refresh token request
// @Description Refresh token for getting new access token
type refreshInput struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

// @Summary      Обновление Access токена
// @Description  Генерирует новый access токен по refresh токену
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        input  body      refreshInput  true  "Refresh токен"
// @Success      200    {object}  map[string]interface{}
// @Failure      400    {object}  handler.Error
// @Failure      500    {object}  handler.Error
// @Router       /auth/refresh [post]
func (h *Handler) refreshHandler(c *gin.Context) {
	var input refreshInput
	if err := c.ShouldBindJSON(&input); err != nil {
		NewErrorResponse(c, http.
			StatusBadRequest, err.Error())
		return
	}
	userId, err := h.service.Auth.ParseRefToken(input.RefreshToken)
	if err != nil {
		NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	newAccessToken, err := h.service.Auth.GenerateAccToken(userId)
	if err != nil {
		NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"access_token": newAccessToken,
	})
}
