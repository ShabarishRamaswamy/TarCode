package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/ShabarishRamaswamy/TarCode/backend/src/models"
	"github.com/ShabarishRamaswamy/TarCode/backend/src/runner"
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
		// Output of this line: ./submissions/abc.c
		err = runner.SaveUserProgram(fmt.Sprintf("%s/%s.%s", "./submissions", idString, currentCode.Lang), []byte(currentCode.Code))
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		if currentCode.Lang == "py" {
			runner.PythonRunner(idString, currentCode.Lang)
		}

		buf := runner.CRunner(idString, currentCode.Lang)

		finalOutput := runner.ParseOutput(buf)

		runner.EvaluateTestCases(finalOutput, currentCode.Test_Cases)

		fmt.Fprintf(w, "Submission received!")
		return
	}
}
