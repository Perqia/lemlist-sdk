/**
 * Result type for wrapping API responses with success/error states
 */
export interface Result<T> {
    success: boolean;
    data?: T;
    error?: unknown;
}