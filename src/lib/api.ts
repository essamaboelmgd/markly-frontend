const API_URL = "https://markly-api.essamaboelmgd.cloud";

interface ApiError {
  message: string;
  status: number;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = localStorage.getItem("auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // If unauthorized, clear auth tokens
      if (response.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        // Redirect to login page
        window.location.href = "/login";
      }
      
      const error: ApiError = {
        message: await response.text() || "An error occurred",
        status: response.status,
      };
      throw error;
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }
}

export const api = new ApiClient(API_URL);

// Auth APIs
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string }>("/api/auth/login", { email, password }),
  
  register: (username: string, email: string, password: string) =>
    api.post<{ token: string }>("/api/auth/register", { username, email, password }),
  
  getProfile: () => 
    api.get<{ id: string; username: string; email: string }>("/api/me"),
};

// Bookmark APIs
export const bookmarkApi = {
  getAll: (params?: Record<string, string>) => {
    let url = "/api/bookmarks";
    if (params) {
      const queryParams = new URLSearchParams(params);
      url += `?${queryParams.toString()}`;
    }
    return api.get<any[]>(url);
  },
  getById: (id: string) => api.get<any>(`/api/bookmarks/${id}`),
  create: (data: any) => api.post<any>("/api/bookmarks", data),
  update: (id: string, data: any) => api.put<any>(`/api/bookmarks/${id}`, data),
  delete: (id: string) => api.delete<any>(`/api/bookmarks/${id}`),
  summarize: (id: string) => api.post<{ summary: string }>(`/api/agent/summarize/${id}`),
};

// Category APIs
export const categoryApi = {
  getAll: () => api.get<any[]>("/api/categories"),
  create: (data: any) => api.post<any>("/api/categories", data),
};

// Collection APIs
export const collectionApi = {
  getAll: () => api.get<any[]>("/api/collections"),
  create: (data: any) => api.post<any>("/api/collections", data),
};

// Tag APIs
export const tagApi = {
  getUserTags: () => api.get<any[]>("/api/tags/user"),
  create: (data: any) => api.post<any>("/api/tags", data),
};