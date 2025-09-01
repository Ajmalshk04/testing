import React from 'react';
import { Product } from '@/types/product';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Copy, 
  Trash2, 
  Package, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  TrendingUp,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDuplicate?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onQuickOrder?: (product: Product) => void;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onQuickOrder,
  showActions = true,
  variant = 'default',
  className
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      archived: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      discontinued: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      active: <CheckCircle className="w-3 h-3" />,
      draft: <Clock className="w-3 h-3" />,
      inactive: <XCircle className="w-3 h-3" />,
      archived: <Package className="w-3 h-3" />,
      discontinued: <AlertTriangle className="w-3 h-3" />
    };
    return icons[status as keyof typeof icons] || icons.inactive;
  };

  const isLowStock = product.stock?.available <= (product.stock?.minQuantity || 5);
  const isOutOfStock = product.stock?.available === 0;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  
  if (variant === 'compact') {
    return (
      <Card className={cn('hover:shadow-md transition-shadow cursor-pointer', className)}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Image */}
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
              {product.images?.[0]?.url ? (
                <img 
                  src={product.images[0].url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-6 h-6 text-muted-foreground" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium truncate">{product.name}</h3>
                <Badge className={getStatusColor(product.status)}>
                  {getStatusIcon(product.status)}
                  <span className="ml-1 capitalize">{product.status}</span>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{product.sku}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">${product.price?.toFixed(2)}</span>
                  {hasDiscount && (
                    <span className="text-sm line-through text-muted-foreground">
                      ${product.salePrice?.toFixed(2)}
                    </span>
                  )}
                </div>
                <span className={cn(
                  'text-sm font-medium',
                  isOutOfStock ? 'text-red-600' : isLowStock ? 'text-yellow-600' : 'text-green-600'
                )}>
                  Stock: {product.stock?.available || 0}
                </span>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView?.(product)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit?.(product)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      'group hover:shadow-lg transition-all duration-200 overflow-hidden',
      'border-border/50 hover:border-border',
      className
    )}>
      {/* Product Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {product.images?.[0]?.url ? (
          <img 
            src={product.images[0].url} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onClick={() => onView?.(product)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={getStatusColor(product.status)}>
            {getStatusIcon(product.status)}
            <span className="ml-1 capitalize">{product.status}</span>
          </Badge>
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-500 text-white">
              {Math.round(((product.price - (product.salePrice || 0)) / product.price) * 100)}% OFF
            </Badge>
          </div>
        )}

        {/* Stock Alert */}
        {(isOutOfStock || isLowStock) && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="destructive">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {isOutOfStock ? 'Out of Stock' : 'Low Stock'}
            </Badge>
          </div>
        )}

        {/* Quick Actions Overlay */}
        {showActions && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
            <Button size="sm" variant="secondary" onClick={() => onView?.(product)}>
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onEdit?.(product)}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Name and Category */}
          <div>
            <h3 className="font-semibold text-lg leading-tight mb-1 line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{product.sku}</span>
              <Badge variant="outline">
                {product.category?.name || 'Uncategorized'}
              </Badge>
            </div>
          </div>

          {/* Description */}
          {variant === 'detailed' && product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Pricing */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">
                  ${hasDiscount ? product.salePrice?.toFixed(2) : product.price?.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-lg line-through text-muted-foreground">
                    ${product.price?.toFixed(2)}
                  </span>
                )}
              </div>
              {product.cost && (
                <span className="text-xs text-muted-foreground">
                  Cost: ${product.cost.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Stock and Metrics */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className={cn(
                'font-medium',
                isOutOfStock ? 'text-red-600' : isLowStock ? 'text-yellow-600' : 'text-green-600'
              )}>
                {product.stock?.available || 0} in stock
              </span>
            </div>
            
            {variant === 'detailed' && product.reviews && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.reviews.averageRating}</span>
                <span className="text-muted-foreground">({product.reviews.totalReviews})</span>
              </div>
            )}
          </div>

          {/* Brand */}
          {product.brand && (
            <div className="text-sm text-muted-foreground">
              Brand: <span className="font-medium">{product.brand}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Actions Footer */}
      {showActions && (
        <CardFooter className="p-4 pt-0 space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onQuickOrder?.(product)}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Quick Order
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(product)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(product)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Product
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate?.(product)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete?.(product)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;