package utils

import (
	"bytes"
	"io"
)

func ReadBuffer(buf io.ReadCloser) string {
	opBuf := new(bytes.Buffer)
	opBuf.ReadFrom(buf)
	return opBuf.String()
}
