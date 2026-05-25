// Backend always sends errors in this shape (from ApiError.js):
// {
//   statusCode: 400,
//   message:    "Email already exists",
//   success:    false,
//   errors:     []
// }
//
// Axios wraps this inside error.response.data
// So we drill into it to get the actual message

export const getErrorMessage = (error) => {
  // Drill order:
  // 1. error.response.data.message  → API error message from your backend
  // 2. error.message                → Axios/network error (no internet etc.)
  // 3. fallback string              → unknown error

  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

// Usage in any component:
// const { isError, error } = useSomeMutation()
// if (isError) return <p>{getErrorMessage(error)}</p>
