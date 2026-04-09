export interface ApiError {
  error: string;
  details?: { field: string; message: string }[];
}
