// logError is still used, but all JWT helpers are removed. If needed, move logError elsewhere.
export function logError(context: string, error: unknown) {
  if (error instanceof Error) {
    console.error(
      `[${context}]`,
      error.message,
      error.stack
    );
  } else {
    console.error(`[${context}]`, error);
  }
}
