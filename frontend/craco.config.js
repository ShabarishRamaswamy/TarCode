// craco.config.js
module.exports = {
    devServer: (devServerConfig) => {
      // Modify the client overlay settings
      devServerConfig.client = {
        ...devServerConfig.client,
        overlay: {
          // Keep the default behavior for compiler errors
          errors: true,
          // Keep the default behavior for warnings
          warnings: true,
          // Suppress specific runtime errors
          runtimeErrors: (error) => {
            // Check if the error message matches the ResizeObserver loop error
            if (
              error?.message &&
              (error.message.includes("ResizeObserver loop completed with undelivered notifications") ||
               error.message.includes("ResizeObserver loop limit exceeded"))
            ) {
              // Returning false dismisses the error overlay for this specific error
              console.warn("Suppressed ResizeObserver loop error overlay.");
              return false;
            }
            // Returning true shows the overlay for all other runtime errors
            return true;
          },
        },
      };
  
      return devServerConfig;
    },
  };