package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
)

func main() {
	// Tell Go where to find the static files (the React build)
	fs := http.FileServer(http.Dir("./build"))

	server := http.NewServeMux()
	// Handle all requests by serving a file from the "build" directory
	server.Handle("/", fs)
	server.HandleFunc("/api/submission/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			body, _ := io.ReadAll(r.Body)
			fmt.Println(body)
		}
	})

	// Start the server on port 8000 and log any errors
	log.Println("Listening on :8001...")
	err := http.ListenAndServe(":8001", server)
	if err != nil {
		log.Fatal(err)
	}
}
