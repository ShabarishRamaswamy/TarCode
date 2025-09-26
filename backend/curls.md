Python Example
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "lang": "python",
  "code": "for _ in range(5):\n    print(\"Hello, World!\")",
  "test_cases": [
    {
      "input": "",
      "output": "Hello, World!\\nHello, World!\\nHello, World!\\nHello, World!\\nHello, World!\\n"
    }
  ]
}' http://localhost:8001/api/submission/123
```

C Example
```bash
curl -X POST -H "Content-Type: application/json" -d '{"lang": "c", "code": "#include <stdio.h>\n\nint main() {\n    for (int i = 0; i < 5; i++) {\n        printf(\"Hello, World!\\n\");\n    }\n    return 0;\n}", "test_cases": [{"input": "", "output": "Hello, World!"}]}' http://localhost:8001/api/submission/123
```