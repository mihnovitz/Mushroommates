package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"100twarzygrzybiarzy/models"
)

var mushrooms = []models.Mushroom{
	{ID: 1, Name: "Cremini", Price: 4.99},
	{ID: 2, Name: "Portobello", Price: 3.99},
	{ID: 3, Name: "Porcini", Price: 1.99},
	{ID: 4, Name: "Puffballs", Price: 2.99},
	{ID: 5, Name: "Chanterelle", Price: 5.99},
	{ID: 6, Name: "Shiitake", Price: 7.99},
	{ID: 7, Name: "Oyster", Price: 4.99},
}

// GetMushrooms zwraca listę wszystkich grzybów
func GetMushrooms(c *gin.Context) {
	c.JSON(http.StatusOK, mushrooms)
}

// GetMushroom zwraca pojedynczego grzyba po ID
func GetMushroom(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid mushroom ID"})
		return
	}

	for _, m := range mushrooms {
		if m.ID == id {
			c.JSON(http.StatusOK, m)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "mushroom not found"})
}
