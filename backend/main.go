package main

import (
	"log"
	"net/http"

	"github.com/ShabarishRamaswamy/TarCode/backend/src"
)

var PORT string = ":8000"

func main() {
	// Tell Go where to find the static files (the React build)
	server := src.GetRoutes()

	// Start the server on port 8000 and log any errors
	log.Println("Listening on ", PORT)
	err := http.ListenAndServe(PORT, server)
	if err != nil {
		log.Fatal(err)
	}
}
