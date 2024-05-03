package entity

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	UsernameU string `gorm:"uniqueIndex"`
	PasswordU string `gorm:"uniqueIndex"`
	TitleName string
	FullName  string
}

type Admin struct {
	gorm.Model
	UsernameA string `gorm:"uniqueIndex"`
	PasswordA string `gorm:"uniqueIndex"`
	TitleName string
	FullName  string
	Position  string

	Knowledges []Knowledge `gorm:"foreignKey:AdminID"`
}

type Knowledge struct {
	gorm.Model
	Title     string `gorm:"uniqueIndex"`
	StateRule string
	StateFact string

	Rules []Rule `gorm:"foreignKey:KnowledgeID"`
	Facts []Fact `gorm:"foreignKey:KnowledgeID"`

	AdminID *uint
	Admin   Admin `gorm:"foreignKey:AdminID"`
}

type Rule struct {
	gorm.Model
	ID  *uint // เปลี่ยนจาก unit เป็น *uint
	Node1 string
	Node2 string
	Result1 string
	Result2 string

	KnowledgeTitle string
	KnowledgeID    *uint
	Knowledge      Knowledge `gorm:"foreignKey:KnowledgeID"`

	OperatorID *uint
	Operator   Operator `gorm:"foreignKey:OperatorID"`
}

type Operator struct {
	gorm.Model
	OperatorName string `gorm:"uniqueIndex"`

	Rules []Rule `gorm:"foreignKey:OperatorID"`
}

type Fact struct {
	gorm.Model
	FactName    string `gorm:"unique" valid:"required~Please fill in information"`
	Description string

	KnowledgeID *uint
	Knowledge   Knowledge `gorm:"foreignKey:KnowledgeID"`
}
