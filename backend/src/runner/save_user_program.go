package runner

import (
	"log"
	"os"
)

func SaveUserProgram(path string, userProgram []byte) error {
	err := os.Mkdir("./submissions", 0644)
	if err != nil && !os.IsExist(err) {
		log.Fatal(err)
		return err
	}
	return os.WriteFile(path, userProgram, 0644)
}
