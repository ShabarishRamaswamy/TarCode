package models

type InputOutput struct {
	Input  string `json:"input"`
	Output string `json:"output"`
}

type Code struct {
	Lang       string        `json:"lang"`
	Code       string        `json:"code"`
	Test_Cases []InputOutput `json:"test_cases"`
}

type JudgedResult struct {
	Test_Case InputOutput `json:"test_case"`
	Result    bool        `json:"result"`
}
