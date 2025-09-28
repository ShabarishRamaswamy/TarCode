package runner

import (
	"fmt"
	"log"
	"os/exec"
)

func PythonRunner(idString, lang string) {
	// Compile & Run (PYTHON example)
	out, err := exec.Command("python3", fmt.Sprintf("%s/%s.%s", "./submissions", idString, lang)).Output()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Output: %s\n", out)
}
