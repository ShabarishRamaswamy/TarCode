# LLM testing of my problem template
This document notes experiementation of my problem template 1 and how LLMs react to it.

## Gemini
```
Make me a simple c function which takes in a number and returns the square of it
```

```c
#include <stdio.h>

/**
 * @brief Calculates the square of an integer.
 * * @param num The integer to be squared.
 * @return The square of the input number.
 */
int square(int num) {
    // Return the number multiplied by itself.
    return num * num;
}

// The main function serves as the entry point of the program.
// It's used here to demonstrate the 'square' function.
int main() {
    // Define a number to test the function with.
    int number = 5;

    // Call the square function and store the result.
    int result = square(number);

    // Print the original number and its square to the console.
    printf("The square of %d is %d\n", number, result);

    // You can also test it with other numbers.
    int number2 = 12;
    int result2 = square(number2);
    printf("The square of %d is %d\n", number2, result2);

    // Return 0 to indicate that the program executed successfully.
    return 0;
}
```

```
Write me the same using this template:
```Template here.```
```

```
// CP function: square
int square(int num) {
    return num * num;
}

int main() {
    // Test Case
    int result1 = square(5);
    // Test Case Output
    printf("%d\n", result1);

    // Test Case
    int result2 = square(12);
    // Test Case Output
    printf("%d\n", result2);

    return 0;
}
```

After editing the template to add more instructions.

```
#include <stdio.h>

// Forward declaration for the competitive programming function.
int square(int num);

// The main function is used for running test cases.
int main() {
    // Test Case 1
    printf("Test Case Input: 5\nTest Case Output: 25\n");
    int result1 = square(5);
    printf("Test Case Output:\n%d\n\n", result1);

    // Test Case 2
    printf("Test Case Input: 12\nTest Case Output: 144\n");
    int result2 = square(12);
    printf("Test Case Output:\n%d\n\n", result2);

    return 0;
}

// CP function
int square(int num) {
    return num * num;
}
```