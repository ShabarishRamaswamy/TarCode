package runner

import (
	"strings"

	"github.com/ShabarishRamaswamy/TarCode/backend/src/models"
)

// This implementation is O(n^2), this can be made O(n)
func ParseOutput(standardOutString string, testCaseNumber uint8) string {
	bufSplit := strings.Split(standardOutString, "\n")

	testCaseIter := uint8(0)

	// We give back the output which is just after the input tag.
	for i := 0; i < len(bufSplit)-1; i++ {
		if bufSplit[i] == models.TestCaseOutputMsg {
			if i+1 < len(bufSplit) {
				if testCaseIter == testCaseNumber {
					return bufSplit[i+1]
				} else {
					testCaseIter += 1
				}
			}
		}
	}
	return ""
}
