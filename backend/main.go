package main

import (
	"log"
	"net/http"

	"github.com/ShabarishRamaswamy/TarCode/backend/src"
)

func main() {
	// Tell Go where to find the static files (the React build)
	server := src.GetRoutes()

	// Start the server on port 8000 and log any errors
	log.Println("Listening on :8000...")
	err := http.ListenAndServe(":8000", server)
	if err != nil {
		log.Fatal(err)
	}
}
