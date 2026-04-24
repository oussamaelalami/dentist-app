// Token storage and management utilities

const TOKEN_KEY = 'adminToken';
const ADMIN_KEY = 'adminUser';

export const tokenManager = {
  // Save token
  saveToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Get token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Save admin info
  saveAdmin: (admin: any) => {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
  },

  // Get admin info
  getAdmin: () => {
    const admin = localStorage.getItem(ADMIN_KEY);
    return admin ? JSON.parse(admin) : null;
  },

  // Clear token and admin info
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

// Fetch wrapper that includes authorization header
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = tokenManager.getToken();
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });
};
