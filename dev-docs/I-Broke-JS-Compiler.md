Code:

```js
export function ParseCodeAndReturnIO(code) {
    var inputs = [],
        expectedOutputs = [],
        codeSplit = code.split("\n")

    for (var i = 0; i < codeSplit.length; i++) {
        if (codeSplit[i].includes("Test Case Input")) {
            inputs.push(processLine(codeSplit[i], "Test Case Input: "))
        } else if (codeSplit[i].includes("Test Case Expected Output")){
            expectedOutputs.push(processLine(codeSplit[i], "Test Case Expected Output: "))
        }
    }
    return [inputs, expectedOutputs]
}

function processLine(lineOfCode, msg) {
    // NOTE: This will break in multi-line string prints
    var splitOfLine = lineOfCode.split(msg)
    var spltOfSplitOfLine = (splitOfLine[splitOfLine.length - 1]).split("\n")
    console.log(spltOfSplitOfLine, splitOfLine[splitOfLine.length - 1])
    console.log(msg, spltOfSplitOfLine[spltOfSplitOfLine.length - 1]);
    return spltOfSplitOfLine[spltOfSplitOfLine.length - 1];
}
```

Output when using Browser Console:
<img src="./Screenshot 2025-10-10 at 11.23.48 PM.png" />

Output when running through React:

<img src="./Screenshot 2025-10-10 at 11.23.57 PM.png" />