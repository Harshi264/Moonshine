import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
  const db = getDB();
  const orders = db.orders || [];
  const products = db.products || [];
  const reviews = db.reviews || [];

  // Order statistics
  const totalOrders = orders.length;
  const newOrders = orders.filter((o) => o.status === 'New').length;
  const pendingOrders = orders.filter((o) => ['Contacted', 'Confirmed', 'Preparing', 'Ready'].includes(o.status)).length;
  const completedOrders = orders.filter((o) => ['Shipped', 'Delivered'].includes(o.status)).length;
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;

  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const avgOrderValue = totalOrders - cancelledOrders > 0
    ? Math.round(totalRevenue / (totalOrders - cancelledOrders))
    : 0;

  // Products statistics
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock <= 5 && p.stock > 0);
  const outOfStockProducts = products.filter((p) => p.stock === 0 || p.status === 'out_of_stock');
  const productsOnSale = products.filter((p) => p.isSale || (p.salePrice && p.salePrice < p.price));

  // Category sales breakdown
  const salesByCategory: Record<string, { count: number; revenue: number }> = {};
  orders.forEach((o) => {
    if (o.status === 'Cancelled') return;
    o.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      const cat = prod ? prod.category : 'Other';
      if (!salesByCategory[cat]) {
        salesByCategory[cat] = { count: 0, revenue: 0 };
      }
      salesByCategory[cat].count += item.quantity;
      salesByCategory[cat].revenue += item.price * item.quantity;
    });
  });

  // Review statistics
  const totalReviews = reviews.length;
  const approvedReviews = reviews.filter((r) => r.status === 'approved');
  const avgRating = approvedReviews.length > 0
    ? Number((approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1))
    : 5.0;

  // Recent 6 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return NextResponse.json({
    success: true,
    metrics: {
      totalOrders,
      newOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      avgOrderValue,
      totalProducts,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      productsOnSaleCount: productsOnSale.length,
      totalReviews,
      avgRating,
    },
    salesByCategory,
    lowStockProducts,
    outOfStockProducts,
    recentOrders,
  });
}
