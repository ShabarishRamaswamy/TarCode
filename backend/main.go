package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
)

type InputOutput struct {
	Input  string
	Output string
}

type Code struct {
	Lang       string
	Code       string
	Test_Cases []InputOutput
}

func readBuffer(buf io.ReadCloser) string {
	opBuf := new(bytes.Buffer)
	opBuf.ReadFrom(buf)
	return opBuf.String()
}

func main() {
	// Tell Go where to find the static files (the React build)
	fs := http.FileServer(http.Dir("./build"))

	server := http.NewServeMux()
	// Handle all requests by serving a file from the "build" directory
	server.Handle("/", fs)

	// There will only be 1 user [For Now]
	// Body: { "lang": "c", "code": "code", "test_cases": [case1, case2, ...] }
	// Future Implementation Notes: Language versions.
	server.HandleFunc("/api/submission/{id}", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			idString := r.PathValue("id")
			fmt.Printf("ID: %v\n", idString)

			var currentCode Code
			err := json.NewDecoder(r.Body).Decode(&currentCode)
			if err != nil {
				fmt.Println(err)
				http.Error(w, "Can't read body", http.StatusBadRequest)
				return
			}
			fmt.Printf("%+v", currentCode)

			// Save the file
			err = os.WriteFile(fmt.Sprintf("%s/%s.%s", "./submissions", idString, currentCode.Lang), []byte(currentCode.Code), 0644)
			if err != nil {
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			if currentCode.Lang == "py" {
				// Compile & Run (PYTHON example)
				out, err := exec.Command("python3", fmt.Sprintf("%s/%s.%s", "./submissions", idString, currentCode.Lang)).Output()
				if err != nil {
					log.Fatal(err)
				}
				fmt.Printf("Output: %s\n", out)
				return
			}

			// Compile and Run (C example)
			// Compile
			// NOTE: Implement a struct mapping a lang and it's expected output
			cmd := exec.Command("gcc", fmt.Sprintf("%s/%s.%s", "./submissions", idString, currentCode.Lang), "-o", fmt.Sprintf("%s/%s.%s", "./submissions", idString, "out"))

			stderr, err := cmd.StderrPipe()
			if err != nil {
				log.Fatal(err)
				return
			}

			err = cmd.Run()
			if err != nil {
				log.Printf("Command finished with error: %v; stderr: %v", err, readBuffer(stderr))
				return
			}

			// Run this code
			cmd = exec.Command(fmt.Sprintf("%s/%s.%s", "./submissions", idString, "out"))
			stdout, err := cmd.StdoutPipe()
			if err != nil {
				log.Fatal(err)
				return
			}

			if err := cmd.Start(); err != nil {
				log.Fatal(err)
				return
			}

			// Get the Results back
			buf := readBuffer(stdout)

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
