package main

import (
	// "net/http"

	"github.com/NaruebeTh1/K-BASE/controller"
	"github.com/NaruebeTh1/K-BASE/entity"
	"github.com/gin-gonic/gin"
	// "github.com/NaruebeTh1/K-BASE/middlewares"
)

func main() {
	entity.SetupDatabase()
	router := gin.Default()
	router.Use(CORSMiddleware())

	router.POST("/loginAdmin", controller.LoginForAdmin)
	router.POST("/singupAdmin", controller.SingupForAdmin)
	router.POST("/loginUser", controller.LoginForUser)
	router.POST("/singupUser", controller.SingupForUser)

	r := router.Group("")
	{
		// r.Use(middlewares.RequireAuthAdmin)
		// r.Use(middlewares.RequireAuthUser)

		// r.GET("/checktokenAdmin", func(c *gin.Context) { c.AbortWithStatus(http.StatusOK) })
		// r.GET("/checktokenUser", func(c *gin.Context) { c.AbortWithStatus(http.StatusOK) })

		r.GET("/getadmin/:id", controller.GetAdminByID)
		r.GET("/users", controller.ListUser)
		r.GET("/knowledges", controller.ListKnowledge)
		r.GET("/knowledges/:id", controller.GetKnowledge)
		r.GET("/rule/:id", controller.ListRule)
		r.PUT("/rule/:id", controller.UpdateRule)
		r.PATCH("/rule/:id", controller.UpdateRule)
		r.GET("/getfacts/:id", controller.ListFactByID)
		r.GET("/Operator", controller.GetOperator)
		r.GET("/fact", controller.ListFact)
		r.GET("/fact/search/:id/:name", controller.SearchFactByName)
		r.GET("/getrule", controller.GetRules)

		r.POST("/knowledge", controller.CreateKnowledge)
		r.POST("/rules", controller.CreateRule)
		r.POST("/facts", controller.CreateFact)

		r.DELETE("/knowledgeD/:id", controller.DeleteKnowledge)
		r.DELETE("/deleteRule/:id", controller.DeleteRule)
		r.DELETE("/delfact/:id", controller.DeleteFact)
	}

	router.Run()
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, AuthorizationAdmin, AuthorizationUser , accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
