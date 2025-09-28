package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"

	"github.com/ShabarishRamaswamy/TarCode/backend/src/models"
	"github.com/ShabarishRamaswamy/TarCode/backend/src/utils"
)

// There will only be 1 user [For Now]
// Body: { "lang": "c", "code": "code", "test_cases": [case1, case2, ...] }
// Future Implementation Notes: Language versions.
func HandlePOSTProblem(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		idString := r.PathValue("id")
		fmt.Printf("ID: %v\n", idString)

		var currentCode models.Code
		err := json.NewDecoder(r.Body).Decode(&currentCode)
		if err != nil {
			fmt.Println(err)
			http.Error(w, "Can't read body", http.StatusBadRequest)
			return
		}
		// fmt.Printf("%+v\n", currentCode)

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
			log.Printf("Command finished with error: %v; stderr: %v\n", err, utils.ReadBuffer(stderr))
			return
		}

		// Run this code
		cmd = exec.Command(fmt.Sprintf("%s/%s.%s", "./submissions", idString, "out"))

		// Standard Out of the executable
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
		buf := utils.ReadBuffer(stdout)
		fmt.Printf("Output: %+v\n", buf)

		// outputFromTheCP
		bufSplit := strings.Split(buf, "\n")
		// for i := range bufSplit {
		// 	fmt.Printf("%+vth bufSplit: %+v", i, bufSplit[i])
		// }
		outputFromTheCP := bufSplit[len(bufSplit)-2]

		// Compare with the given test cases
		for k, v := range currentCode.Test_Cases {
			fmt.Println(k, v)

			fmt.Printf("Test Case Input -> %+v: Expected: %+v Output -> %+v\n", v.Input, v.Output, outputFromTheCP)
			if v.Output == outputFromTheCP {
				fmt.Println("Match!")
			} else {
				fmt.Println("Don't Match ahh!")
			}
		}

		fmt.Fprintf(w, "Submission received!")
		return
	}
}
