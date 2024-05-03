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

func SingupForAdmin(c *gin.Context) {
	var admin entity.Admin

	if err := c.ShouldBindJSON(&admin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(admin.PasswordA), 10)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	r := entity.Admin{
		UsernameA: admin.UsernameA,
		PasswordA: string(hash),
		TitleName: admin.TitleName,
		FullName:  admin.FullName,
		Position:  admin.Position,
	}

	if err := entity.DB().Create(&r).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success"})
}

func LoginForAdmin(c *gin.Context) {
	var body struct {
		UsernameA string
		PasswordA string
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var a entity.Admin
	if err := entity.DB().First(&a, "username_a=?", body.UsernameA).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"})
		return
	}
	if a.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"})
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(a.PasswordA), []byte(body.PasswordA))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  a.ID,
		"exp": time.Now().Add(time.Minute * 60 * 24).Unix(),
	})
	tokenString, err := token.SignedString([]byte((os.Getenv("SECRET"))))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่สามารถสร้างโทเค็นได้"})
		return
	}

	c.Header("AuthorizationAdmin", tokenString)
	c.JSON(http.StatusCreated, gin.H{"status": "success", "message": "login success", "token": tokenString, "adminId": a.ID, "result": "admin"})
}

func Example(c *gin.Context) {
	var admin entity.Admin
	a, _ := c.Get("admin")
	admin = a.(entity.Admin)

	// c.JSON(http.StatusOK, gin.H{"Id": user.ID}) //เอาแค่ ID ของUserที่ล็อคอินเข้ามา
	c.JSON(http.StatusBadRequest, gin.H{"Admin": admin}) //ได้ข้อมูลทั้งหทดของUserที่ล็อคอินเข้ามา

}

// GET /user/:id
func GetAdminByID(c *gin.Context) {
	var admin entity.Admin
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM admins WHERE id = ?", id).Scan(&admin).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": admin})
}
