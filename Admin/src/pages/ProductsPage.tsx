import React, { useState } from 'react';
import { Product } from '@/types/product';
import ProductList from '@/components/products/ProductList';
import ProductForm from '@/components/products/ProductForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Grid, List } from 'lucide-react';

const ProductsPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const handleProductCreate = () => {
    setSelectedProduct(null);
    setFormMode('create');
    setFormOpen(true);
  };

  const handleProductEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    // Could open a detailed view modal here
  };

  const handleFormSuccess = (product: Product) => {
    setFormOpen(false);
    setSelectedProduct(null);
    // Refresh the product list
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">
            Manage your product catalog, inventory, and pricing
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <ProductList
          onProductSelect={handleProductSelect}
          onProductEdit={handleProductEdit}
          onProductCreate={handleProductCreate}
          showActions={true}
          enableSelection={true}
        />
      </div>

      {/* Product Form Modal */}
      <ProductForm
        product={selectedProduct}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={handleFormSuccess}
        mode={formMode}
      />
    </div>
  );
};

export default ProductsPage;