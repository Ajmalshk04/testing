import React, { useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/data-table/data-table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  BarChart3,
  Clock,
  CheckCircle,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { InventoryMovement, InventoryAlert, Product } from '@/types/product';
import { ColumnDef } from '@tanstack/react-table';

const InventoryManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);
  const [adjustmentData, setAdjustmentData] = useState({
    type: 'adjustment' as const,
    quantity: 0,
    reason: ''
  });
  const [activeTab, setActiveTab] = useState('overview');

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, movementsRes, alertsRes] = await Promise.all([
        productService.getProducts({ sortBy: 'stock.available', sortOrder: 'asc' }, 1, 100),
        productService.getInventoryMovements(),
        productService.getInventoryAlerts()
      ]);

      if (productsRes.success) setProducts(productsRes.data.products);
      if (movementsRes.success) setMovements(movementsRes.data.movements);
      if (alertsRes.success) setAlerts(alertsRes.data);
    } catch (error) {
      toast.error('Failed to load inventory data');
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate inventory metrics
  const inventoryMetrics = {
    totalProducts: products.length,
    lowStock: products.filter(p => p.stock?.available <= p.stock?.minQuantity).length,
    outOfStock: products.filter(p => p.stock?.available === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.stock?.available || 0) * p.price, 0),
    totalItems: products.reduce((sum, p) => sum + (p.stock?.available || 0), 0)
  };

  // Handle stock adjustment
  const handleStockAdjustment = async () => {
    if (!selectedProduct) return;

    try {
      const response = await productService.adjustInventory(
        selectedProduct._id,
        null,
        adjustmentData.quantity,
        adjustmentData.reason
      );
      
      if (response.success) {
        toast.success('Stock adjustment completed');
        setAdjustmentOpen(false);
        setSelectedProduct(null);
        setAdjustmentData({ type: 'adjustment', quantity: 0, reason: '' });
        loadData();
      }
    } catch (error) {
      toast.error('Failed to adjust stock');
      console.error('Error adjusting stock:', error);
    }
  };

  // Acknowledge alert
  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const response = await productService.acknowledgeAlert(alertId);
      if (response.success) {
        toast.success('Alert acknowledged');
        loadData();
      }
    } catch (error) {
      toast.error('Failed to acknowledge alert');
    }
  };

  // Table columns for products
  const productColumns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Product',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">{row.original.sku}</div>
        </div>
      )
    },
    {
      accessorKey: 'stock.available',
      header: 'Current Stock',
      cell: ({ row }) => {
        const stock = row.original.stock?.available || 0;
        const minStock = row.original.stock?.minQuantity || 0;
        const isLow = stock <= minStock;
        const isOut = stock === 0;
        
        return (
          <div className={`font-medium ${
            isOut ? 'text-red-600' : isLow ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {stock}
            {isLow && <AlertTriangle className="inline w-3 h-3 ml-1" />}
          </div>
        );
      }
    },
    {
      accessorKey: 'stock.minQuantity',
      header: 'Min Stock',
      cell: ({ row }) => row.original.stock?.minQuantity || 0
    },
    {
      accessorKey: 'price',
      header: 'Value',
      cell: ({ row }) => {
        const stock = row.original.stock?.available || 0;
        const value = stock * row.original.price;
        return `$${value.toFixed(2)}`;
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedProduct(row.original);
            setAdjustmentOpen(true);
          }}
        >
          Adjust Stock
        </Button>
      )
    }
  ];

  // Table columns for movements
  const movementColumns: ColumnDef<InventoryMovement>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Date',
      cell: ({ row }) => new Date(row.original.timestamp).toLocaleDateString()
    },
    {
      accessorKey: 'productId',
      header: 'Product',
      cell: ({ row }) => {
        const product = products.find(p => p._id === row.original.productId);
        return product?.name || 'Unknown Product';
      }
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant={row.original.type === 'in' ? 'default' : 'secondary'}>
          {row.original.type === 'in' ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {row.original.type.toUpperCase()}
        </Badge>
      )
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      cell: ({ row }) => {
        const qty = row.original.quantity;
        return (
          <span className={row.original.type === 'in' ? 'text-green-600' : 'text-red-600'}>
            {row.original.type === 'in' ? '+' : '-'}{Math.abs(qty)}
          </span>
        );
      }
    },
    {
      accessorKey: 'reason',
      header: 'Reason'
    },
    {
      accessorKey: 'userName',
      header: 'User'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Monitor stock levels, track movements, and manage inventory alerts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryMetrics.totalProducts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryMetrics.totalItems.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${inventoryMetrics.totalValue.toFixed(0)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inventoryMetrics.lowStock}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inventoryMetrics.outOfStock}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>
                Current stock levels for all products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={productColumns} data={products} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Movements</CardTitle>
              <CardDescription>
                Recent stock changes and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={movementColumns} data={movements} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>
                Stock alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <div className="font-medium">{alert.productName}</div>
                        <div className="text-sm text-muted-foreground">{alert.message}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                      </Badge>
                      {!alert.isAcknowledged && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcknowledgeAlert(alert._id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No inventory alerts at this time
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock Adjustment Dialog */}
      <Dialog open={adjustmentOpen} onOpenChange={setAdjustmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock - {selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Current stock: {selectedProduct?.stock?.available || 0}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Adjustment Type</Label>
              <Select
                value={adjustmentData.type}
                onValueChange={(value) => setAdjustmentData(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adjustment">Manual Adjustment</SelectItem>
                  <SelectItem value="in">Stock In</SelectItem>
                  <SelectItem value="out">Stock Out</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={adjustmentData.quantity}
                onChange={(e) => setAdjustmentData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <Label>Reason</Label>
              <Textarea
                value={adjustmentData.reason}
                onChange={(e) => setAdjustmentData(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Reason for adjustment"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setAdjustmentOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleStockAdjustment}>
                Apply Adjustment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManagementPage;