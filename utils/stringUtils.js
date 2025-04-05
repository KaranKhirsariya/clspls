// Convert a string to pascal case with spaces
export const toSoftPascalCaseWithSpaces = (str) => {
  if (!str) return "Miscellaneous";
  
  return str
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Format errors for consistent display
export const formatError = (error) => {
  if (error.response) {
    return `API Error (${error.response.status}): ${JSON.stringify(error.response.data)}`;
  } else if (error.request) {
    return `Network Error: No response received`;
  } else {
    return `Error: ${error.message}`;
  }
}; 