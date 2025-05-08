type ApiOptions = {
  method: string;
  body?: any;
  headers?: Record<string, string>;
};

type ApiResponse<T = any> = {
  error?: string;
  missingKey?: string;
  result?: T;
  elements?: any;
  messageCount?: number;
  [key: string]: any;
};

/**
 * Custom API request function for calls to custom endpoints
 * that return non-standard response structures
 */
export async function customApiRequest<T = any>(
  url: string,
  options: ApiOptions
): Promise<ApiResponse<T>> {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  const requestOptions: RequestInit = {
    method: options.method,
    headers,
    credentials: 'include',
  };
  
  if (options.body) {
    requestOptions.body = typeof options.body === 'string' 
      ? options.body 
      : JSON.stringify(options.body);
  }
  
  const response = await fetch(url, requestOptions);
  
  if (!response.ok) {
    // Handle HTTP errors
    const errorText = await response.text();
    throw new Error(`HTTP Error ${response.status}: ${errorText}`);
  }
  
  return response.json();
}