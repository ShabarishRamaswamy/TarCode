package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/ShabarishRamaswamy/TarCode/backend/src/models"
	"github.com/ShabarishRamaswamy/TarCode/backend/src/runner"
)

func HandlePOSTProblem(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		idString := r.PathValue("id")
		log.Printf("Got submission for ID: %s", idString)

		var currentCode models.Code
		err := json.NewDecoder(r.Body).Decode(&currentCode)
		if err != nil {
			log.Printf("Failed to decode request body for ID %s: %v", idString, err)
			http.Error(w, "Can't read body", http.StatusBadRequest)
			return
		}

		testCaseOutcome, err := runner.RunProcessingLoop(idString, currentCode)
		if err != nil {
			log.Printf("Failed to handle the request with ID %s: %v", idString, err)
			// TODO: This can be 400 or 500
			http.Error(w, "Failed to handle your request", http.StatusBadRequest)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(testCaseOutcome.([]models.JudgedResult))
		return
	}
}
