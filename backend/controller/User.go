package controller

import (
	"net/http"
	"os"
	"time"

	"github.com/NaruebeTh1/K-BASE/entity"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func SingupForUser(c *gin.Context) {
	var user entity.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(user.PasswordU), 10)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	r := entity.User{
		UsernameU: user.UsernameU,
		PasswordU: string(hash),
		TitleName: user.TitleName,
		FullName:  user.FullName,
	}

	if err := entity.DB().Create(&r).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success"})
}

func LoginForUser(c *gin.Context) {
	var body struct {
		UsernameU string
		PasswordU string
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var u entity.User
	if err := entity.DB().First(&u, "username_u=?", body.UsernameU).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"})
		return
	}
	if u.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"})
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(u.PasswordU), []byte(body.PasswordU))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  u.ID,
		"exp": time.Now().Add(time.Minute * 60 * 24).Unix(),
	})
	tokenString, err := token.SignedString([]byte((os.Getenv("SECRET"))))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่สามารถสร้างโทเค็นได้"})
		return
	}

	c.Header("AuthorizationUser", tokenString)
	c.JSON(http.StatusCreated, gin.H{"status": "success", "message": "login success", "token": tokenString, "userId": u.ID, "result": "user"})
}
func ExampleGETUSER(c *gin.Context) {
	var user entity.User
	u, _ := c.Get("user")
	user = u.(entity.User)

	// c.JSON(http.StatusOK, gin.H{"Id": user.ID}) //เอาแค่ ID ของUserที่ล็อคอินเข้ามา
	c.JSON(http.StatusBadRequest, gin.H{"User": user}) //ได้ข้อมูลทั้งหทดของUserที่ล็อคอินเข้ามา

}
