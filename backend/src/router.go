package src

import (
	"net/http"

	"github.com/ShabarishRamaswamy/TarCode/backend/src/handlers"
)

func GetRoutes() *http.ServeMux {
	fs := http.FileServer(http.Dir("./build"))

	server := http.NewServeMux()
	// Handle all requests by serving a file from the "build" directory
	server.Handle("/", fs)

	server.HandleFunc("/api/submission/{id}", handlers.HandlePOSTProblem)
	return server
}
