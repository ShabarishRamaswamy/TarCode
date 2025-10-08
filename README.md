# TarCode
Self-Hosted LeetCode.

Just a personal project made out of curiosity.

# Design Decisions
I have quickly understood that this problem is not so straightforward.
I have chosen these design decisions for V1:
- I will read the output and answer from StdOut. Last printed line will be considered as the output of the program.
- I will only be testing V1 with `int` and `string` outputs. Rest will be done in later versions.

# Current State of Frontend:
<img src="./frontend/dev-docs/Screenshot 2025-10-04 at 4.30.29 PM.png" />

# Instruction for Running
NOTE: Make sure to have docker on system.
I use podman for development.

1. Git clone the code
1. `docker build -t tarcode .`
1. `docker run -d -p 8000:8000 --name tarcode-app tarcode`
1. Open `localhost:8000` in a browser

# Features
- [x] React app for the Code Editor UI.
- [x] Go Server for Compilation and Running the code.
- [x] Test cases and server side validation of the test cases against the source code.

- [] Hide/Unhide test cases