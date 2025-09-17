package main

import (
	"log"
	"net/http"
)

func main() {
	// Tell Go where to find the static files (the React build)
	fs := http.FileServer(http.Dir("./build"))

	// Handle all requests by serving a file from the "build" directory
	http.Handle("/", fs)

	// Start the server on port 8000 and log any errors
	log.Println("Listening on :8000...")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal(err)
	}
}
