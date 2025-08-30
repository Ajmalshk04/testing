import api from '../lib/api';

// Export all interfaces
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  isEmailVerified: boolean;
  lastLogin?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  }

  async logout(refreshToken?: string): Promise<ApiResponse> {
    const response = await api.post('/auth/logout', { refreshToken });
    return response.data;
  }

  async logoutAll(): Promise<ApiResponse> {
    const response = await api.post('/auth/logout-all');
    return response.data;
  }

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    const response = await api.get('/auth/me');
    return response.data;
  }

  async updateProfile(data: Partial<Pick<User, 'name' | 'email'>>): Promise<ApiResponse<{ user: User }>> {
    const response = await api.put('/auth/profile', data);
    return response.data;
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse> {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  }

  async getSessions(): Promise<ApiResponse<{ sessions: any[] }>> {
    const response = await api.get('/auth/sessions');
    return response.data;
  }

  async revokeSession(sessionId: string): Promise<ApiResponse> {
    const response = await api.delete(`/auth/sessions/${sessionId}`);
    return response.data;
  }
}

export const authService = new AuthService();