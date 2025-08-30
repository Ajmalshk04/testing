import { api } from '@/lib/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

export interface UserFilters {
  search?: string;
  role?: string | string[];
  isActive?: boolean;
  isEmailVerified?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      limit: number;
    };
    filters: {
      roles: Array<{ value: string; count: number }>;
      status: Array<{ value: string; count: number }>;
    };
  };
}

class UserService {
  async getUsers(filters: UserFilters = {}, page = 1, limit = 10): Promise<UsersResponse> {
    const params = new URLSearchParams();
    
    Object.entries({ ...filters, page, limit }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/users?${params}`);
    return response.data;
  }

  async bulkUpdateUsers(userIds: string[], updates: any) {
    const response = await api.patch('/users/bulk', { userIds, updates });
    return response.data;
  }

  async bulkDeleteUsers(userIds: string[]) {
    const response = await api.delete('/users/bulk', { data: { userIds } });
    return response.data;
  }

  async exportUsers(filters: UserFilters = {}) {
    const params = new URLSearchParams(filters as any);
    params.append('format', 'csv');
    const response = await api.get(`/users/export?${params}`, { responseType: 'blob' });
    return response.data;
  }

  getRoleOptions() {
    return [
      { label: 'User', value: 'user' },
      { label: 'Admin', value: 'admin' }
    ];
  }

  getStatusOptions() {
    return [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ];
  }
}

export const userService = new UserService();