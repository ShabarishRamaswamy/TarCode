const path = require('path');

module.exports = {
  // Your existing devServer configuration to suppress the ResizeObserver error
  devServer: (devServerConfig) => {
    devServerConfig.client = {
      ...devServerConfig.client,
      overlay: {
        errors: true,
        warnings: true,
        runtimeErrors: (error) => {
          if (
            error?.message &&
            (error.message.includes("ResizeObserver loop completed with undelivered notifications") ||
             error.message.includes("ResizeObserver loop limit exceeded"))
          ) {
            console.warn("Suppressed ResizeObserver loop error overlay.");
            return false;
          }
          return true;
        },
      },
    };
    return devServerConfig;
  },
  // Add the new paths configuration to change the build output directory
  paths: {
    appBuild: path.resolve(__dirname, '../backend/build'),
  },
};

