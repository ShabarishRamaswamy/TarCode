package runner

import (
	"fmt"
	"log"
	"os/exec"

	"github.com/ShabarishRamaswamy/TarCode/backend/src/utils"
)

func CRunner(idString, lang string) string {
	// Compile and Run (C example)
	// Compile
	// NOTE: Implement a struct mapping a lang and it's expected output
	cmd := exec.Command("gcc", fmt.Sprintf("%s/%s.%s", "./submissions", idString, lang), "-o", fmt.Sprintf("%s/%s.%s", "./submissions", idString, "out"))

	stderr, err := cmd.StderrPipe()
	if err != nil {
		log.Fatal(err)
		return ""
	}

	err = cmd.Run()
	if err != nil {
		log.Printf("Command finished with error: %v; stderr: %v\n", err, utils.ReadBuffer(stderr))
		return ""
	}

	// Run this code
	cmd = exec.Command(fmt.Sprintf("%s/%s.%s", "./submissions", idString, "out"))

	// Standard Out of the executable
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		log.Fatal(err)
		return ""
	}

	if err := cmd.Start(); err != nil {
		log.Fatal(err)
		return ""
	}

	// Get the Results back
	buf := utils.ReadBuffer(stdout)
	fmt.Printf("Output: %+v\n", buf)
	return buf
}
