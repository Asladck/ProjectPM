package service

import (
	"Pjpro/internal/models"
	"Pjpro/internal/repository"
	"crypto/sha1"
	"errors"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/sirupsen/logrus"
	"time"
)

type AuthService struct {
	rep repository.Auth
}

const (
	salt        = "adaodkwapd210k1d221"
	signingKeyA = "qweqroqwro123e21edwqdl@@"
	signingKeyR = "wqretgehrgkrm1o3rm3f3p"
	tokenTTL    = 30 * time.Minute
	tokenRTTL   = 7 * 24 * time.Hour
)

type tokenClaims struct {
	jwt.StandardClaims
	UserId string `json:"id"`
}

func NewAuthService(repo repository.Auth) *AuthService {
	return &AuthService{rep: repo}
}
func signToken(token *jwt.Token) (interface{}, error) {
	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		return nil, errors.New("Invalid signing method")
	}
	return []byte(signingKeyA), nil
}
func (s *AuthService) ParseToken(accessToken string) (string, error) {
	token, err := jwt.ParseWithClaims(accessToken, &tokenClaims{}, signToken)
	if err != nil {
		return "", err
	}
	claims, ok := token.Claims.(*tokenClaims)
	if !ok {
		return "", errors.New("token claims are not of type *tokenClaims")
	}
	return claims.UserId, nil
}
func (s *AuthService) Create(user models.SignUpRequest) (string, error) {
	if len(user.Password) < 8 {
		logrus.Fatalf("User's password is shorter than 8 symbols: %v")
		return "", errors.New("short password")
	}
	user.Password = generatePasswordHash(user.Password)

	return s.rep.Create(models.User{
		Email:    user.Email,
		Name:     user.Name,
		Surname:  user.Surname,
		Password: user.Password,
		Role:     user.Role,
	})
}

func (s *AuthService) GenerateToken(password, email string) (string, string, error) {
	user, err := s.rep.GetUser(generatePasswordHash(password), email)
	if err != nil {
		return "", "", err
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &tokenClaims{
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(tokenTTL).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
		user.Id})
	refToken := jwt.NewWithClaims(jwt.SigningMethodHS256, &tokenClaims{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(tokenRTTL).Unix(),
		},
		UserId: user.Id,
	})
	rt, err := refToken.SignedString([]byte(signingKeyR))
	at, err := token.SignedString([]byte(signingKeyA))
	return at, rt, err
}

func (s *AuthService) ParseRefToken(tokenR string) (string, error) {
	token, err := jwt.ParseWithClaims(tokenR, &tokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(signingKeyR), nil
	})
	if err != nil {
		return "", err
	}
	claims, ok := token.Claims.(*tokenClaims)
	if !ok || !token.Valid {
		return "", errors.New("invalid refresh token")
	}
	return claims.UserId, nil
}

func (s *AuthService) GenerateAccToken(userId string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &tokenClaims{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(tokenTTL).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
		UserId: userId,
	})
	return token.SignedString([]byte(signingKeyA))
}

func generatePasswordHash(password string) string {
	hash := sha1.New()
	hash.Write([]byte(password))
	return fmt.Sprintf("%x", hash.Sum([]byte(salt)))
}
