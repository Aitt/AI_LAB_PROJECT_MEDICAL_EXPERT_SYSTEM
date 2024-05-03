package entity

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func SetupDatabase() {
	database, err := gorm.Open(sqlite.Open("data.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	database.AutoMigrate(
		&User{},
		&Admin{},
		&Knowledge{},
		&Operator{},
		&Rule{},
		&Fact{},
	)

	db = database

	Operator := []Operator{
		{OperatorName: "AND"},
		{OperatorName: "OR"},
	}
	for _, OperatorOfCase := range Operator {
		db.Create(&OperatorOfCase)
	}
}
