package controller

import (
	"net/http"

	"github.com/NaruebeTh1/K-BASE/entity"
	"github.com/gin-gonic/gin"
)

// POST
func CreateKnowledge(c *gin.Context) {
	var knowledge entity.Knowledge
	var admin entity.Admin

	if err := c.ShouldBindJSON(&knowledge); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", knowledge.AdminID).First(&admin); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	knowledges := entity.Knowledge{

		AdminID:   knowledge.AdminID,
		Title:     knowledge.Title,
		StateRule: "0",
		StateFact: "0",
	}

	if err := entity.DB().Create(&knowledges).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": knowledges})
}

func DeleteKnowledge(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM knowledges WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "knowledges not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

func GetKnowledge(c *gin.Context) {
	var knowledge []entity.Knowledge
	KnowledgeId := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM knowledges WHERE id = ?", KnowledgeId).Find(&knowledge).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": knowledge})
}
