package controller

import (
	"net/http"

	"github.com/NaruebeTh1/K-BASE/entity"
	"github.com/gin-gonic/gin"
)

// POST
func CreateRule(c *gin.Context) {
	var rule entity.Rule
	var knowledge entity.Knowledge
	var operator entity.Operator

	// bind เข้าตัวแปร rule
	if err := c.ShouldBindJSON(&rule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", rule.KnowledgeID).First(&knowledge); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "knowledge not found"})
		return
	}
	if tx := entity.DB().Where("id = ?", rule.OperatorID).First(&operator); tx.RowsAffected == 0 {
	}
	
	myrule := entity.Rule{
		ID:             rule.ID,
		KnowledgeID:    rule.KnowledgeID,
		OperatorID:     nil, // ตั้งค่าเริ่มต้นเป็น nil ก่อน
		KnowledgeTitle: rule.KnowledgeTitle,
		Node1:          rule.Node1,
		Node2:          rule.Node2,
		Result1:        rule.Result1,
		Result2:        rule.Result2,
	}
	
	// ตรวจสอบและกำหนดค่า OperatorID ถ้ามีค่า
	if rule.OperatorID != nil {
		myrule.OperatorID = rule.OperatorID
	}
	
	// ตรวจสอบและกำหนดค่า OperatorID ถ้ามีค่า
	if operator.ID != 0 {
		operatorID := operator.ID
		myrule.OperatorID = &operatorID
	}

	if err := entity.DB().Model(&knowledge).Update("StateRule", "1").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}

	if err := entity.DB().Create(&myrule).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "rule already exists"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": myrule})
}

// ฟังก์ชันลบรายการ rule
func DeleteRule(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM rules WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "rules not found"})
		return
	}
	// ส่งคำตอบกลับเมื่อสร้างข้อมูลสำเร็จ
	c.JSON(http.StatusOK, gin.H{"data": id})
}


// PUT
func UpdateRule(c *gin.Context) {
	var rule entity.Rule
	var knowledge entity.Knowledge
	var operator entity.Operator

	// ดึง id ของ rule ที่ต้องการอัปเดต
	id := c.Param("id")
	// ค้นหา rule ด้วย id
	if tx := entity.DB().Where("id = ?", id).First(&rule); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "rule not found"})
		return
	}
	// bind ข้อมูลใหม่เข้าตัวแปร rule
	if err := c.ShouldBindJSON(&rule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// ค้นหา knowledge ด้วย id
	if tx := entity.DB().Where("id = ?", rule.KnowledgeID).First(&knowledge); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "knowledge not found"})
		return
	}
	// ค้นหา operator ด้วย id
	if tx := entity.DB().Where("id = ?", rule.OperatorID).First(&operator); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "operator not found"})
		return
	}
	// อัปเดตข้อมูล rule
	updatedRule := entity.Rule{
		ID:             rule.ID,
		KnowledgeID:    rule.KnowledgeID,
		OperatorID:     nil, // ตั้งค่าเริ่มต้นเป็น nil ก่อน
		KnowledgeTitle: rule.KnowledgeTitle,
		Node1:          rule.Node1,
		Node2:          rule.Node2,
		Result1:        rule.Result1,
		Result2:        rule.Result2,
	}
	
	// ตรวจสอบและกำหนดค่า OperatorID ถ้ามีค่า
	if rule.OperatorID != nil {
		updatedRule.OperatorID = rule.OperatorID
	}
	
	// ตรวจสอบและกำหนดค่า OperatorID ถ้ามีค่า
	if operator.ID != 0 {
		operatorID := operator.ID
		updatedRule.OperatorID = &operatorID
	}

	// // ใช้ UpdateRuleById ในการอัปเดตกฎ
	if err := entity.DB().Model(&entity.Rule{}).Where("id = ?", id).Updates(updatedRule).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	// ส่งคำตอบกลับเมื่ออัปเดตข้อมูลสำเร็จ
	c.JSON(http.StatusOK, gin.H{"data": updatedRule})
}

// func UpdateRule(c *gin.Context) {
// 	var rule entity.Rule
// 	id := c.Param("id")

// 	if err := c.ShouldBindJSON(&rule); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if tx := entity.DB().Where("id = ?", id).First(&rule); tx.RowsAffected == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "rule not found"})
// 		return
// 	}

// 	if err := entity.DB().Save(&rule).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": rule})
// }




// func (server *Server) UpdateRule(c *gin.Context) {
//     id := c.Param("id")
//     if id == "" {
//         c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid rule ID"})
//         return
//     }

//     var rule entity.Rule
//     if err := c.ShouldBindJSON(&rule); err != nil {
//         c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
//         return
//     }

//     rule.ID, _ = strconv.Atoi(id)
//     err := server.DB.Save(&rule).Error
//     if err != nil {
//         c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
//         return
//     }

//     c.JSON(http.StatusOK, gin.H{"data": rule})
// }