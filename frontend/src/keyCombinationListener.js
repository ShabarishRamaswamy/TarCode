/**
 * Creates and returns a keydown event handler function.
 * This function encapsulates the state and logic for detecting the key sequence.
 * @param {Function} callback The function to execute when the sequence is successful.
 * @returns {Function} An event handler function to be attached to a keydown event.
 */
export const createKeydownHandler = (callback) => {
  let lastAction = null;
  let timeoutId = null;

  return (event) => {
    const isModifierPressed = event.ctrlKey || event.metaKey;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 65 is the keyCode for the 'A' key.
    if (isModifierPressed && event.keyCode === 65) {
      // ⬇️ THIS LINE IS THE ONLY CHANGE ⬇️
      // event.preventDefault(); // REMOVE THIS LINE
      
      console.log("✅ Action: Select All (Ctrl+A) detected. Letting editor handle it.");
      lastAction = 'select-all';

      timeoutId = setTimeout(() => {
        lastAction = null;
      }, 1500);

    } 
    // 86 is the keyCode for the 'V' key.
    else if (isModifierPressed && event.keyCode === 86 && lastAction === 'select-all') {
      // We still prevent default here because we have custom paste logic.
      event.preventDefault();
      console.log("🚀 SUCCESS: Custom paste sequence detected inside editor.");
      
      if (callback) {
        callback(event);
      }
      
      lastAction = null;
    } 
    else {
      lastAction = null;
    }
  };
};