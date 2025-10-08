package runner

import (
	"errors"
	"fmt"
	"log"

	"github.com/ShabarishRamaswamy/TarCode/backend/src/models"
)

func RunProcessingLoop(idString string, currentCode models.Code) (interface{}, error) {
	// Output of this line: ./submissions/abc.c
	filePath := fmt.Sprintf("%s/%s.%s", "./submissions", idString, currentCode.Lang)
	err := SaveUserProgram(filePath, []byte(currentCode.Code))
	if err != nil {
		log.Printf("Failed to save user program to %s: %v", filePath, err)
		// http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return nil, err
	}

	switch currentCode.Lang {
	case "py":
		return nil, PythonRunner(idString, currentCode.Lang)

	case "c":
		allTestCaseOutcomes := []models.JudgedResult{}

		for _, test_case := range currentCode.Test_Cases {
			fmt.Printf("%+v\n", test_case)

			// Output of this line: stdout buffer
			buf := CRunner(idString, currentCode.Lang)

			// Output of this line: Last non-empty print statement
			finalOutput := ParseOutput(buf)

			// Output of this line: True/False if each test case passes
			allTestCaseOutcomes = append(allTestCaseOutcomes, EvaluateTestCases(finalOutput, test_case))
		}
		return allTestCaseOutcomes, nil

	default:
		return nil, errors.New("unimplemented language")
	}
}
