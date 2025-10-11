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
    // console.log("splitOfLine", splitOfLine)
    var spltOfSplitOfLine = (splitOfLine[splitOfLine.length - 1]).split("\\n")
    // console.log("spltOfSplitOfLine", spltOfSplitOfLine)
    // console.log("spltOfSplitOfLine[spltOfSplitOfLine.length - 1]", spltOfSplitOfLine[spltOfSplitOfLine.length - 1])
    // console.log(msg, spltOfSplitOfLine[0]);
    return spltOfSplitOfLine[0];
}