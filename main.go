package main

import "100twarzygrzybiarzy/routes"

func main(){
	r := routes.SetupRoutes()
	r.Run(":8080")
}
