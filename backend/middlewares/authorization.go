package middlewares

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/NaruebeTh1/K-BASE/entity"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RequireAuthAdmin(c *gin.Context) {
	tokenString := c.Request.Header.Get("AuthorizationAdmin")
	if tokenString == "" {
		c.AbortWithStatus(http.StatusUnauthorized)
	}
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		if token.Header["alg"] != "HS256" {
			return nil, fmt.Errorf("Unexpected algorithm: %v", token.Header["alg"])
		}
		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return []byte(os.Getenv("SECRET")), nil
	})
	if err != nil || token == nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok {

		expClaim, ok := claims["exp"].(float64)
		if !ok {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		if float64(time.Now().Unix()) > expClaim {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		var a entity.Admin

		if err := entity.DB().First(&a, claims["id"]).Error; err != nil {
		}
		if a.ID == 0 {
			c.AbortWithStatus(http.StatusUnauthorized)
		}
		c.Set("admin", a)

		c.Next()
	} else {
		c.AbortWithStatus(http.StatusUnauthorized)
	}
}

func RequireAuthUser(c *gin.Context) {
	tokenString := c.Request.Header.Get("AuthorizationUser")
	if tokenString == "" {
		c.AbortWithStatus(http.StatusUnauthorized)
	}
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		if token.Header["alg"] != "HS256" {
			return nil, fmt.Errorf("Unexpected algorithm: %v", token.Header["alg"])
		}
		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return []byte(os.Getenv("SECRET")), nil
	})
	if err != nil || token == nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok {

		expClaim, ok := claims["exp"].(float64)
		if !ok {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		if float64(time.Now().Unix()) > expClaim {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		var u entity.User
		if err := entity.DB().First(&u, claims["id"]).Error; err != nil {
		}
		if u.ID == 0 {
			c.AbortWithStatus(http.StatusUnauthorized)
		}
		c.Set("user", u)

		c.Next()
	} else {
		c.AbortWithStatus(http.StatusUnauthorized)
	}
}
