package runner

import "strings"

func ParseOutput(standardOutString string) string {
	bufSplit := strings.Split(standardOutString, "\n")

	// Last Non-Empty Stdout log is the output of the program.
	for i := len(bufSplit) - 1; i >= 0; i-- {
		if len(bufSplit[i]) > 0 {
			return bufSplit[i]
		}
	}
	return ""
}
