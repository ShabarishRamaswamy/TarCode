package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
	"os/exec"
)

func main() {
	// Tell Go where to find the static files (the React build)
	fs := http.FileServer(http.Dir("./build"))

	server := http.NewServeMux()
	// Handle all requests by serving a file from the "build" directory
	server.Handle("/", fs)

	// There will only be 1 user [For Now]
	// Body: { "code": "code", "test_cases": [case1, case2, ...] }
	server.HandleFunc("/api/submission/{id}", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			body, err := io.ReadAll(r.Body)
			if err != nil {
				http.Error(w, "Can't read body", http.StatusBadRequest)
				return
			}

			idString := r.PathValue("id")
			fmt.Printf("ID: %v", idString)

			fmt.Println(string(body))

			// Save the file
			// err = os.WriteFile(fmt.Sprintf("%s/%s", "./submissions", idString), body, 0644)
			// check(err)

			// Compile & Run (PYTHON example)
			out, err := exec.Command("python3", "./submissions/123.py").Output()
			if err != nil {
				log.Fatal(err)
			}
			fmt.Printf("Output: %s\n", out)

			// Compile and Run (C example)
			// Compile
			cmd := exec.Command("gcc", "./submissions/123.c", "-o", "./submissions/123.out")
			err = cmd.Run()
			log.Printf("Command finished with error: %v", err)

			// Run this code
			cmd = exec.Command("./submissions/123.out")
			stdout, err := cmd.StdoutPipe()
			if err != nil {
				log.Fatal(err)
			}

			if err := cmd.Start(); err != nil {
				log.Fatal(err)
			}

			// Get the Results back
			buf := new(bytes.Buffer)
			buf.ReadFrom(stdout)

			fmt.Println("Outout: ", buf)

			// Compare with the given test cases

			fmt.Fprintf(w, "Submission received!")
			return
		}
	})

	// Start the server on port 8000 and log any errors
	log.Println("Listening on :8001...")
	err := http.ListenAndServe(":8001", server)
	if err != nil {
		log.Fatal(err)
	}
}
