import { api } from '@/lib/api';
import type { 
  Product, 
  Category, 
  Order, 
  InventoryMovement, 
  InventoryAlert,
  ProductFilters,
  OrderFilters,
  ProductAnalytics,
  DashboardMetrics
} from '@/types/product';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

class ProductService {
  // Product Management
  async getProducts(filters?: ProductFilters, page = 1, limit = 20): Promise<ApiResponse<{ products: Product[]; pagination: any }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      )
    });

    const response = await api.get(`/products?${params}`);
    return response.data;
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }

  async createProduct(product: Partial<Product>): Promise<ApiResponse<Product>> {
    const response = await api.post('/products', product);
    return response.data;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    const response = await api.put(`/products/${id}`, updates);
    return response.data;
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }

  async bulkUpdateProducts(ids: string[], updates: Partial<Product>): Promise<ApiResponse<void>> {
    const response = await api.patch('/products/bulk', { ids, updates });
    return response.data;
  }

  async bulkDeleteProducts(ids: string[]): Promise<ApiResponse<void>> {
    const response = await api.delete('/products/bulk', { data: { ids } });
    return response.data;
  }

  async duplicateProduct(id: string): Promise<ApiResponse<Product>> {
    const response = await api.post(`/products/${id}/duplicate`);
    return response.data;
  }

  async exportProducts(filters?: ProductFilters): Promise<Blob> {
    const params = new URLSearchParams(
      filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      )
    );

    const response = await api.get(`/products/export?${params}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Category Management
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await api.get('/categories');
    return response.data;
  }

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  }

  async createCategory(category: Partial<Category>): Promise<ApiResponse<Category>> {
    const response = await api.post('/categories', category);
    return response.data;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<ApiResponse<Category>> {
    const response = await api.put(`/categories/${id}`, updates);
    return response.data;
  }

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }

  async getCategoryHierarchy(): Promise<ApiResponse<Category[]>> {
    const response = await api.get('/categories/hierarchy');
    return response.data;
  }

  // Order Management
  async getOrders(filters?: OrderFilters, page = 1, limit = 20): Promise<ApiResponse<{ orders: Order[]; pagination: any }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      )
    });

    const response = await api.get(`/orders?${params}`);
    return response.data;
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<Order>> {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  }

  async addOrderNote(id: string, note: string): Promise<ApiResponse<void>> {
    const response = await api.post(`/orders/${id}/notes`, { note });
    return response.data;
  }

  async refundOrder(id: string, amount?: number, reason?: string): Promise<ApiResponse<void>> {
    const response = await api.post(`/orders/${id}/refund`, { amount, reason });
    return response.data;
  }

  async exportOrders(filters?: OrderFilters): Promise<Blob> {
    const params = new URLSearchParams(
      filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      )
    );

    const response = await api.get(`/orders/export?${params}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Inventory Management
  async getInventoryMovements(productId?: string, page = 1, limit = 20): Promise<ApiResponse<{ movements: InventoryMovement[]; pagination: any }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(productId && { productId })
    });

    const response = await api.get(`/inventory/movements?${params}`);
    return response.data;
  }

  async addInventoryMovement(movement: Partial<InventoryMovement>): Promise<ApiResponse<InventoryMovement>> {
    const response = await api.post('/inventory/movements', movement);
    return response.data;
  }

  async adjustInventory(productId: string, variantId: string | null, quantity: number, reason: string): Promise<ApiResponse<void>> {
    const response = await api.post('/inventory/adjust', {
      productId,
      variantId,
      quantity,
      reason
    });
    return response.data;
  }

  async getInventoryAlerts(): Promise<ApiResponse<InventoryAlert[]>> {
    const response = await api.get('/inventory/alerts');
    return response.data;
  }

  async acknowledgeAlert(alertId: string): Promise<ApiResponse<void>> {
    const response = await api.patch(`/inventory/alerts/${alertId}/acknowledge`);
    return response.data;
  }

  async getStockLevels(): Promise<ApiResponse<any[]>> {
    const response = await api.get('/inventory/stock-levels');
    return response.data;
  }

  // Analytics
  async getProductAnalytics(productId: string, period = '30d'): Promise<ApiResponse<ProductAnalytics>> {
    const response = await api.get(`/analytics/products/${productId}?period=${period}`);
    return response.data;
  }

  async getDashboardMetrics(period = '30d'): Promise<ApiResponse<DashboardMetrics>> {
    const response = await api.get(`/analytics/dashboard?period=${period}`);
    return response.data;
  }

  async getSalesAnalytics(period = '30d'): Promise<ApiResponse<any>> {
    const response = await api.get(`/analytics/sales?period=${period}`);
    return response.data;
  }

  async getInventoryAnalytics(): Promise<ApiResponse<any>> {
    const response = await api.get('/analytics/inventory');
    return response.data;
  }

  // Image Upload
  async uploadProductImage(productId: string, file: File, isPrimary = false): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('isPrimary', isPrimary.toString());

    const response = await api.post(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteProductImage(productId: string, imageId: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/products/${productId}/images/${imageId}`);
    return response.data;
  }

  // Search and Suggestions
  async searchProducts(query: string, limit = 10): Promise<ApiResponse<Product[]>> {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  }

  async getProductSuggestions(partial: string): Promise<ApiResponse<string[]>> {
    const response = await api.get(`/products/suggestions?q=${encodeURIComponent(partial)}`);
    return response.data;
  }

  async getPopularProducts(limit = 10): Promise<ApiResponse<Product[]>> {
    const response = await api.get(`/products/popular?limit=${limit}`);
    return response.data;
  }
}

export const productService = new ProductService();