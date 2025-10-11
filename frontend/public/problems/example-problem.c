#include <stdio.h>

// Function declaration (prototype)
int square(int num);

// CP function
int square(int num) {
  return num * num;
}

// Main Function
int main() {
  // Test Case 1
  printf("Test Case Input: 5\n");
  printf("Test Case Expected Output: 25\n");
  int result1 = square(5);
  printf("Test Case Actual Output:\n%d\n", result1);

  // Test Case 2
  printf("Test Case Input: 10\n");
  printf("Test Case Expected Output: 100\n");
  int result2 = square(10);
  printf("Test Case Actual Output:\n%d\n", result2);

  return 0;
}

