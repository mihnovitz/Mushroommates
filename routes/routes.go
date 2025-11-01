package routes

import (
	"github.com/gin-gonic/gin"
    "100twarzygrzybiarzy/controllers"
)

func SetupRoutes() *gin.Engine  {
	router := gin.Default()

	router.GET("/mushrooms", controllers.GetMushrooms)
	router.GET("/mushrooms/:id", controllers.GetMushroom)

	return router
}
