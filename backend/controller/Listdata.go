package controller

import (
	"net/http"

	"github.com/NaruebeTh1/K-BASE/entity"
	"github.com/gin-gonic/gin"
)

func ListUser(c *gin.Context) {
	var user []entity.User
	if err := entity.DB().Raw("SELECT * FROM users").Scan(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": user})
}

func ListKnowledge(c *gin.Context) {
	var knowledge []entity.Knowledge

	if err := entity.DB().Preload("Admin").Find(&knowledge).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": knowledge})
}

// get rule data by knowledge id
func ListRule(c *gin.Context) {
	var rule []entity.Rule
	KnowledgeId := c.Param("id")
	if err := entity.DB().Preload("Knowledge").Preload("Operator").Where("knowledge_id", KnowledgeId).Find(&rule).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": rule})
}

func GetOperator(c *gin.Context) {
	var operator []entity.Operator
	if err := entity.DB().Raw("SELECT * FROM operators").Scan(&operator).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": operator})
}

func GetRules(c *gin.Context) {
	var rule []entity.Rule

	if err := entity.DB().Preload("Knowledge").Preload("Operator").Raw("SELECT * FROM rules").Find(&rule).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": rule})
}

func ListFactByID(c *gin.Context) {
	var fact []entity.Fact
	KnowledgeId := c.Param("id")
	if err := entity.DB().Preload("Knowledge").Where("knowledge_id", KnowledgeId).Find(&fact).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": fact})
}
