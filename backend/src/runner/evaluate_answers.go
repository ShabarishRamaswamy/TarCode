package runner

import (
	"fmt"
	"log"

	"github.com/ShabarishRamaswamy/TarCode/backend/src/models"
)

func EvaluateTestCases(output string, test_cases models.InputOutput) (judgedResult models.JudgedResult) {
	log.Printf("Test Case Input -> %+v: Expected: %+v Output -> %+v\n", test_cases.Input, test_cases.Output, output)
	if test_cases.Output == output {
		fmt.Println("Match!")
		return models.JudgedResult{Test_Case: models.InputOutput{Input: test_cases.Input, Output: test_cases.Output}, Result: true}
	} else {
		fmt.Println("Don't Match ahh!")
		return models.JudgedResult{Test_Case: models.InputOutput{Input: test_cases.Input, Output: test_cases.Output}, Result: false}
	}
}
