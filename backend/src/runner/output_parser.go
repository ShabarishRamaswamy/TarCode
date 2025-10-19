package runner

import (
	"strings"

	"github.com/ShabarishRamaswamy/TarCode/backend/src/models"
)

// This implementation has been converted: O(n^2) -> O(n)
func ParseAllOutputs(standardOutString string) []string {
	bufSplit := strings.Split(standardOutString, "\n")
	testCasesOutputs := []string{}

	// We give back the output which is just after the input tag.
	for i := 0; i < len(bufSplit)-1; i++ {
		if bufSplit[i] == models.TestCaseOutputMsg {
			if i+1 < len(bufSplit) {
				testCasesOutputs = append(testCasesOutputs, bufSplit[i+1])
			}
		}
	}
	return testCasesOutputs
}
