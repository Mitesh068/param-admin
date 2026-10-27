export const products = [
  { id: "P-1001", name: "Wireless Headphones", category: "Electronics", price: 2499, stock: 45, status: "Active", image: "🎧" },
  { id: "P-1002", name: "Smart Watch Series 5", category: "Electronics", price: 5999, stock: 12, status: "Active", image: "⌚" },
  { id: "P-1003", name: "Running Shoes", category: "Footwear", price: 1799, stock: 0, status: "Out of Stock", image: "👟" },
  { id: "P-1004", name: "Leather Wallet", category: "Accessories", price: 899, stock: 60, status: "Active", image: "👛" },
  { id: "P-1005", name: "Cotton T-Shirt", category: "Apparel", price: 499, stock: 120, status: "Active", image: "👕" },
  { id: "P-1006", name: "Bluetooth Speaker", category: "Electronics", price: 1999, stock: 8, status: "Draft", image: "🔊" },
];

export const orders = [
  { id: "ORD-8231", customer: "Aarav Shah", date: "2026-09-06", amount: 4998, items: 3, status: "Pending", payment: "UPI" },
  { id: "ORD-8232", customer: "Priya Mehta", date: "2026-09-06", amount: 1799, items: 1, status: "Shipped", payment: "Card" },
  { id: "ORD-8233", customer: "Rohan Patel", date: "2026-09-05", amount: 8497, items: 4, status: "Delivered", payment: "COD" },
  { id: "ORD-8234", customer: "Sneha Verma", date: "2026-09-05", amount: 899, items: 1, status: "Cancelled", payment: "UPI" },
  { id: "ORD-8235", customer: "Karan Joshi", date: "2026-09-04", amount: 2998, items: 2, status: "Pending", payment: "Card" },
  { id: "ORD-8236", customer: "Isha Nair", date: "2026-09-04", amount: 5999, items: 1, status: "Shipped", payment: "Net Banking" },
];

export const blogs = [
  { id: "B-01", title: "Top 10 Festive Fashion Trends for 2026", author: "Marketing Team", date: "2026-09-01", status: "Published", views: 3421 },
  { id: "B-02", title: "How to Style Your Winter Wardrobe", author: "Neha Gupta", date: "2026-08-28", status: "Published", views: 2210 },
  { id: "B-03", title: "Behind the Scenes: Our New Collection", author: "Design Team", date: "2026-08-20", status: "Draft", views: 0 },
];

export const reviews = [
  { id: "R-201", product: "Wireless Headphones", customer: "Aarav Shah", rating: 5, comment: "Excellent sound quality, worth every rupee!", date: "2026-09-05", replied: false },
  { id: "R-202", product: "Running Shoes", customer: "Priya Mehta", rating: 2, comment: "Size runs a bit small, had to exchange.", date: "2026-09-04", replied: true },
  { id: "R-203", product: "Smart Watch Series 5", customer: "Rohan Patel", rating: 4, comment: "Battery life could be better but overall great.", date: "2026-09-03", replied: false },
];

export const notifications = [
  { id: 1, type: "order", text: "New order #ORD-8235 placed by Karan Joshi", time: "5 min ago", unread: true },
  { id: 2, type: "stock", text: "Bluetooth Speaker stock is low (8 left)", time: "1 hr ago", unread: true },
  { id: 3, type: "review", text: "New 2-star review on Running Shoes", time: "3 hr ago", unread: true },
  { id: 4, type: "order", text: "Order #ORD-8231 payment confirmed", time: "6 hr ago", unread: false },
  { id: 5, type: "system", text: "Weekly sales report is ready", time: "1 day ago", unread: false },
];

export const salesData = [
  { name: "Mon", sales: 12400 },
  { name: "Tue", sales: 15800 },
  { name: "Wed", sales: 9800 },
  { name: "Thu", sales: 18200 },
  { name: "Fri", sales: 21000 },
  { name: "Sat", sales: 26500 },
  { name: "Sun", sales: 19400 },
];

export const categoryData = [
  { name: "Electronics", value: 45 },
  { name: "Apparel", value: 25 },
  { name: "Footwear", value: 15 },
  { name: "Accessories", value: 15 },
];
