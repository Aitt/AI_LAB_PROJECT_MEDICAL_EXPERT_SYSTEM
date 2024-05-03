// package controller

// import (
// 	"net/http"
// 	"github.com/NaruebeTh1/K-BASE/entity"
// 	"github.com/gin-gonic/gin"
// )

// func SearchFactByName(c *gin.Context) {
//     var fact []entity.Fact
//     name := c.Param("name")

//     // ทำการ query ข้อมูลจากฐานข้อมูลโดยค้นหาชื่อนักเรียน
//     if err := entity.DB().Where("fact_name LIKE ?", "%"+name+"%").Find(&fact).Error; err != nil {
//         c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
//         return
//     }

//     c.JSON(http.StatusOK, gin.H{"data": fact})
// }

// func CreateFact(c *gin.Context) {
// 	var fact entity.Fact

// 	if err := c.ShouldBindJSON(&fact); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	facts := entity.Fact{
// 		FactName: fact.FactName,
// 		Description: fact.Description,
// 	}

// 	if err := entity.DB().Create(&facts).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"data": facts})
// }

// func ListFact(c *gin.Context) {
// 	var fact []entity.Fact
// 	if err := entity.DB().Raw("SELECT * FROM facts").Scan(&fact).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"data": fact})
// }

// func DeleteFact(c *gin.Context) {
// 	id := c.Param("id")
// 	if tx := entity.DB().Exec("DELETE FROM facts WHERE id = ?", id); tx.RowsAffected == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "fact not found"})
// 		return
// 	}
// 	// ส่งคำตอบกลับเมื่อสร้างข้อมูลสำเร็จ
// 	c.JSON(http.StatusOK, gin.H{"data": id})
// }

package controller

import (
	"net/http"

	"github.com/NaruebeTh1/K-BASE/entity"
	"github.com/gin-gonic/gin"
)

func SearchFactByName(c *gin.Context) {
	var fact []entity.Fact
	name := c.Param("name")
	knowledgeId := c.Param("id")

	if err := entity.DB().Where("knowledge_id = ? and fact_name LIKE ?", knowledgeId, "%"+name+"%").Find(&fact).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": fact})
}

func CreateFact(c *gin.Context) {
	var fact entity.Fact
	var knowledge entity.Knowledge

	if err := c.ShouldBindJSON(&fact); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", fact.KnowledgeID).First(&knowledge); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "knowledge not found"})
		return
	}

	facts := entity.Fact{
		KnowledgeID: fact.KnowledgeID,
		FactName:    fact.FactName,
		Description: fact.Description,
	}

	if err := entity.DB().Model(&knowledge).Update("StateFact", "1").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}

	if err := entity.DB().Create(&facts).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": facts})
}

func ListFact(c *gin.Context) {
	var fact []entity.Fact
	if err := entity.DB().Raw("SELECT * FROM facts").Scan(&fact).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": fact})
}

func DeleteFact(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM facts WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "fact not found"})
		return
	}
	// ส่งคำตอบกลับเมื่อสร้างข้อมูลสำเร็จ
	c.JSON(http.StatusOK, gin.H{"data": id})
}
