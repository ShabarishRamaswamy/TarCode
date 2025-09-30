package runner

import (
	"fmt"

	"github.com/ShabarishRamaswamy/TarCode/backend/src/models"
)

func EvaluateTestCases(output string, test_cases []models.InputOutput) {
	// Compare with the given test cases
	for k, v := range test_cases {
		fmt.Println(k, v)
		fmt.Printf("Test Case Input -> %+v: Expected: %+v Output -> %+v\n", v.Input, v.Output, output)
		if v.Output == output {
			fmt.Println("Match!")
		} else {
			fmt.Println("Don't Match ahh!")
		}
	}
}
