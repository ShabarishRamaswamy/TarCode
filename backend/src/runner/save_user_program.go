package runner

import (
	"os"
)

func SaveUserProgram(path string, userProgram []byte) error {
	return os.WriteFile(path, userProgram, 0644)
}
