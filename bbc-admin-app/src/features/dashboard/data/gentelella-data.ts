// ─── Dashboard 1 (Overview) ──────────────────────────────────────────────────

export interface KpiTile {
  label: string
  value: string
  unit?: string
  iconColor: string
  iconBg: string
  trendPercent: number
  trendDirection: 'up' | 'down'
  trendColor: string
  trendText: string
}

export const d1KpiTiles: KpiTile[] = [
  { label: 'Total Users', value: '2,500', iconColor: '#3B82F6', iconBg: 'bg-blue-500', trendPercent: 4, trendDirection: 'up', trendColor: 'text-green-500', trendText: 'From last Week' },
  { label: 'Average Time', value: '123.5', unit: 'min', iconColor: '#06B6D4', iconBg: 'bg-cyan-500', trendPercent: 2, trendDirection: 'up', trendColor: 'text-cyan-500', trendText: 'From last Week' },
  { label: 'Total Orders', value: '1,240', iconColor: '#F59E0B', iconBg: 'bg-amber-500', trendPercent: 15, trendDirection: 'up', trendColor: 'text-green-500', trendText: 'From last Week' },
  { label: 'Total Revenue', value: '$24,567', iconColor: '#22C55E', iconBg: 'bg-green-500', trendPercent: 8, trendDirection: 'up', trendColor: 'text-green-500', trendText: 'From last Week' },
  { label: 'Conversions', value: '2,315', iconColor: '#6B7280', iconBg: 'bg-gray-500', trendPercent: 12, trendDirection: 'up', trendColor: 'text-green-500', trendText: 'From last Week' },
  { label: 'Page Views', value: '47,325', iconColor: '#1ABC9C', iconBg: 'bg-[#1ABC9C]', trendPercent: 18, trendDirection: 'up', trendColor: 'text-green-500', trendText: 'From last Week' },
]

export interface NetworkChartDataset {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string
}

export const networkActivitiesLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const networkActivitiesDatasets: NetworkChartDataset[] = [
  { label: 'Revenue', data: [12, 19, 8, 15, 22, 18, 25, 32, 28, 35, 30, 40], borderColor: '#1ABB9C', backgroundColor: 'rgba(26, 187, 156, 0.1)' },
  { label: 'Expenses', data: [8, 12, 6, 10, 15, 12, 18, 22, 20, 25, 22, 28], borderColor: '#E74C3C', backgroundColor: 'rgba(231, 76, 60, 0.1)' },
]

export interface CampaignProgress {
  name: string
  percent: number
}

export const campaignProgress: CampaignProgress[] = [
  { name: 'Facebook Campaign', percent: 80 },
  { name: 'Twitter Campaign', percent: 60 },
  { name: 'Conventional Media', percent: 40 },
  { name: 'Bill boards', percent: 50 },
]

export interface AppVersion {
  version: string
  progressWidth: number
  userCount: string
}

export const appVersions: AppVersion[] = [
  { version: '0.1.5.2', progressWidth: 66, userCount: '123k' },
  { version: '0.1.5.3', progressWidth: 45, userCount: '53k' },
  { version: '0.1.5.4', progressWidth: 25, userCount: '23k' },
  { version: '0.1.5.5', progressWidth: 5, userCount: '3k' },
  { version: '0.1.5.6', progressWidth: 2, userCount: '1k' },
]

export interface DeviceUsage {
    [key: string]: unknown
  device: string
  percentage: number
  color: string
}

export const deviceUsageData: DeviceUsage[] = [
  { device: 'IOS', percentage: 30, color: '#3498DB' },
  { device: 'Android', percentage: 10, color: '#26B99A' },
  { device: 'Blackberry', percentage: 20, color: '#9B59B6' },
  { device: 'Symbian', percentage: 15, color: '#1ABB9C' },
  { device: 'Others', percentage: 30, color: '#E74C3C' },
]

export interface ActivityItem {
  icon: string
  iconColor: string
  title: string
  source: string
  time: string
  description: string
  linkText: string
}

export const recentActivities: ActivityItem[] = [
  { icon: 'ShoppingCart', iconColor: '#26B99A', title: 'New Order Received', source: 'Customer #12455', time: '2 minutes ago', description: 'Order #ORD-12455 for $2,350.00 has been placed. Customer ordered premium package with expedited shipping.', linkText: 'View Details' },
  { icon: 'UserPlus', iconColor: '#3498DB', title: 'New User Registration', source: 'john.doe@example.com', time: '15 minutes ago', description: 'New user registered with premium membership. Account verified and welcome email sent successfully.', linkText: 'View Profile' },
  { icon: 'CreditCard', iconColor: '#F39C12', title: 'Payment Processed', source: 'Payment Gateway', time: '32 minutes ago', description: 'Payment of $1,250.00 successfully processed for Order #ORD-12453. Funds have been deposited to merchant account.', linkText: 'View Transaction' },
  { icon: 'Star', iconColor: '#E74C3C', title: 'Product Review Submitted', source: 'Sarah Johnson', time: '1 hour ago', description: '5-star review submitted for "Premium Wireless Headphones". Customer praised excellent sound quality and fast delivery.', linkText: 'Read Review' },
  { icon: 'Truck', iconColor: '#9B59B6', title: 'Shipment Dispatched', source: 'Logistics Team', time: '2 hours ago', description: 'Order #ORD-12448 has been shipped via Express Delivery. Tracking number: EX123456789. Expected delivery: Tomorrow.', linkText: 'Track Package' },
  { icon: 'TrendingUp', iconColor: '#2ECC71', title: 'Sales Milestone Achieved', source: 'System', time: '3 hours ago', description: 'Congratulations! Monthly sales target of $50,000 achieved with 5 days remaining. Current total: $52,450.', linkText: 'View Report' },
  { icon: 'AlertTriangle', iconColor: '#E67E22', title: 'Inventory Alert', source: 'Inventory System', time: '4 hours ago', description: 'Low stock alert: "Wireless Mouse Model X" has only 5 units remaining. Consider reordering to avoid stockouts.', linkText: 'Reorder Now' },
]

export interface SalesStatMetric {
  title: string
  value: string
  icon: string
  iconColor: string
}

export const salesStatMetrics: SalesStatMetric[] = [
  { title: 'Weekly Sales', value: '$12.4k this week', icon: 'dots', iconColor: '' },
  { title: 'New Users', value: '+245 this month', icon: 'UserPlus', iconColor: '#3498DB' },
  { title: 'Item Orders', value: '1,240 orders', icon: 'ShoppingBag', iconColor: '#F39C12' },
  { title: 'Growth Rate', value: '+18.2% growth', icon: 'TrendingUp', iconColor: '#26B99A' },
]

export const salesChartPoints = [
  { x: 20, y: 60 }, { x: 70, y: 40 }, { x: 120, y: 30 }, { x: 180, y: 25 }, { x: 260, y: 20 },
]

export interface OrderRow {
  orderId: string
  customer: string
  product: string
  amount: string
  status: 'Completed' | 'Processing' | 'Shipped' | 'Cancelled'
  date: string
}

export const recentOrders: OrderRow[] = [
  { orderId: '#ORD-12455', customer: 'John Smith', product: 'Premium Wireless Headphones', amount: '$299.99', status: 'Completed', date: 'Jan 15, 2029' },
  { orderId: '#ORD-12454', customer: 'Emily Johnson', product: 'Smart Watch Pro', amount: '$899.99', status: 'Processing', date: 'Jan 15, 2029' },
  { orderId: '#ORD-12453', customer: 'Michael Chen', product: 'Gaming Laptop Elite', amount: '$1,899.99', status: 'Shipped', date: 'Jan 14, 2029' },
  { orderId: '#ORD-12452', customer: 'Sarah Davis', product: 'Wireless Mouse Deluxe', amount: '$79.99', status: 'Completed', date: 'Jan 14, 2029' },
  { orderId: '#ORD-12451', customer: 'Robert Wilson', product: '4K Monitor Pro', amount: '$649.99', status: 'Cancelled', date: 'Jan 13, 2029' },
  { orderId: '#ORD-12450', customer: 'Lisa Brown', product: 'Bluetooth Speaker Premium', amount: '$199.99', status: 'Completed', date: 'Jan 13, 2029' },
  { orderId: '#ORD-12449', customer: 'David Garcia', product: 'Mechanical Keyboard RGB', amount: '$159.99', status: 'Processing', date: 'Jan 12, 2029' },
  { orderId: '#ORD-12448', customer: 'Anna Martinez', product: 'Tablet Pro 12-inch', amount: '$799.99', status: 'Shipped', date: 'Jan 12, 2029' },
]

export interface CountryStat {
  country: string
  percentage: number
}

export const visitorCountries: CountryStat[] = [
  { country: 'United States', percentage: 33 },
  { country: 'France', percentage: 27 },
  { country: 'Germany', percentage: 16 },
  { country: 'Spain', percentage: 11 },
  { country: 'Britain', percentage: 10 },
]

export const visitorsSummary = { views: '125.7k', countries: 60 }

export interface TodoItem {
  id: string
  label: string
  checked: boolean
}

export const todoItems: TodoItem[] = [
  { id: 'todo-item-1', label: 'Schedule meeting with new client', checked: false },
  { id: 'todo-item-2', label: 'Create email address for new intern', checked: false },
  { id: 'todo-item-3', label: 'Have IT fix the network printer', checked: false },
  { id: 'todo-item-4', label: 'Copy backups to offsite location', checked: false },
  { id: 'todo-item-5', label: 'Food truck fixie locavors mcsweeney', checked: false },
  { id: 'todo-item-6', label: 'Create email address for new intern', checked: false },
  { id: 'todo-item-7', label: 'Have IT fix the network printer', checked: false },
  { id: 'todo-item-8', label: 'Copy backups to offsite location', checked: false },
]

export interface WeatherForecast {
  day: string
  degrees: number
  icon: string
  wind: string
}

export const weatherCurrent = { day: 'Monday', time: '07:30 AM', location: 'Texas', condition: 'Partly Cloudy Day', temp: 23 }

export const weatherForecast: WeatherForecast[] = [
  { day: 'Mon', degrees: 25, icon: 'Sun', wind: '15 km/h' },
  { day: 'Tue', degrees: 25, icon: 'CloudRain', wind: '12 km/h' },
  { day: 'Wed', degrees: 27, icon: 'CloudSnow', wind: '14 km/h' },
  { day: 'Thu', degrees: 28, icon: 'CloudHail', wind: '15 km/h' },
  { day: 'Fri', degrees: 28, icon: 'Wind', wind: '11 km/h' },
  { day: 'Sat', degrees: 26, icon: 'Cloud', wind: '10 km/h' },
]

export const profileCompletion = 67

export interface QuickSettingItem {
  icon: string
  label: string
}

export const quickSettings: QuickSettingItem[] = [
  { icon: 'Calendar', label: 'Settings' },
  { icon: 'Menu', label: 'Subscription' },
  { icon: 'BarChart', label: 'Auto Renewal' },
  { icon: 'TrendingUp', label: 'Achievements' },
  { icon: 'BarChart', label: 'Auto Renewal' },
  { icon: 'TrendingUp', label: 'Achievements' },
  { icon: 'AreaChart', label: 'Logout' },
]

// ─── Dashboard 2 (Activity) ─────────────────────────────────────────────────

export interface D2KpiCard {
  label: string
  value: string
  subtitle: string
  icon: string
  iconColor: string
  bgColor: string
}

export const d2KpiCards: D2KpiCard[] = [
  { label: 'New Sign ups', value: '179', subtitle: 'Active registrations', icon: 'UserPlus', iconColor: '#3B82F6', bgColor: 'bg-blue-500/10' },
  { label: 'Messages', value: '1,254', subtitle: 'Customer inquiries', icon: 'MessageSquare', iconColor: '#22C55E', bgColor: 'bg-green-500/10' },
  { label: 'Analytics', value: '892', subtitle: 'Reports generated', icon: 'BarChart3', iconColor: '#06B6D4', bgColor: 'bg-cyan-500/10' },
  { label: 'Tasks Complete', value: '423', subtitle: 'Finished today', icon: 'CheckSquare', iconColor: '#F59E0B', bgColor: 'bg-amber-500/10' },
]

export const transactionSummaryLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const transactionSummaryDatasets: NetworkChartDataset[] = [
  { label: 'Sales', data: [10, 15, 12, 18, 25, 22, 30, 35, 28, 40, 38, 45], borderColor: '#E74C3C', backgroundColor: 'rgba(231, 76, 60, 0.1)' },
  { label: 'Revenue', data: [8, 12, 10, 14, 20, 18, 25, 28, 24, 32, 30, 38], borderColor: '#3498DB', backgroundColor: 'rgba(52, 152, 219, 0.1)' },
]

export interface TransactionTile {
  label: string
  value: string
}

export const transactionTiles: TransactionTile[] = [
  { label: 'Total Sessions', value: '231,809' },
  { label: 'Total Revenue', value: '$231,809' },
  { label: 'Total Users', value: '187,245' },
]

export const topAgent = { name: 'Sarah Johnson', revenue: '$4,850', sales: '18 sales today' }

export interface TeamProgress {
  label: string
  percent: number
  color: string
}

export const teamProgress: TeamProgress[] = [
  { label: 'Daily Goal', percent: 87, color: 'bg-green-500' },
  { label: 'Weekly Target', percent: 65, color: 'bg-cyan-500' },
  { label: 'Monthly KPI', percent: 72, color: 'bg-amber-500' },
]

export interface QuickStat {
  label: string
  value: string
  color: string
}

export const quickStats: QuickStat[] = [
  { label: 'Active Agents', value: '8', color: 'text-blue-500' },
  { label: 'Deals Today', value: '24', color: 'text-green-500' },
  { label: 'Satisfaction', value: '94%', color: 'text-cyan-500' },
  { label: 'Avg. Response', value: '2.3h', color: 'text-amber-500' },
]

export const weeklySalesLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const weeklySalesData = [1200, 1900, 800, 1500, 2200, 1800, 2500]

export interface PieSlice {
  name: string
  value: number
  color: string
  [key: string]: string | number
}

export const salesDistributionData: PieSlice[] = [
  { name: 'Online', value: 45, color: '#26B99A' },
  { name: 'Retail', value: 30, color: '#3498DB' },
  { name: 'Wholesale', value: 15, color: '#E74C3C' },
  { name: 'Partner', value: 10, color: '#F39C12' },
]

export const dailyActivityLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
export const dailyActivityData = [120, 80, 200, 350, 450, 380, 200]

export interface RadarDataset {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string
}

export const performanceLabels = ['Speed', 'Reliability', 'Usability', 'Security', 'Performance']
export const performanceDatasets: RadarDataset[] = [
  { label: 'Current', data: [85, 90, 78, 95, 88], borderColor: '#E67E22', backgroundColor: 'rgba(230, 126, 34, 0.2)' },
  { label: 'Target', data: [90, 95, 85, 98, 92], borderColor: '#27AE60', backgroundColor: 'rgba(39, 174, 96, 0.2)' },
]

export interface D2ActivityItem {
  icon: string
  iconBg: string
  title: string
  description: string
  time: string
}

export const d2RecentActivity: D2ActivityItem[] = [
  { icon: 'Check', iconBg: 'bg-green-500', title: 'Order #1247 Completed', description: 'Customer payment processed successfully', time: '2 hours ago' },
  { icon: 'UserPlus', iconBg: 'bg-blue-500', title: 'New User Registration', description: 'Sarah Miller joined the platform', time: '4 hours ago' },
  { icon: 'AlertTriangle', iconBg: 'bg-amber-500', title: 'System Maintenance', description: 'Scheduled maintenance tonight at 2 AM', time: '6 hours ago' },
  { icon: 'Database', iconBg: 'bg-blue-500', title: 'Daily Backup Complete', description: 'All data successfully backed up', time: '8 hours ago' },
]

export interface Review {
  name: string
  rating: number
  text: string
}

export const customerReviews: Review[] = [
  { name: 'John Anderson', rating: 4, text: 'Excellent service and fast delivery. The product quality exceeded my expectations. Highly recommended!' },
  { name: 'Maria Garcia', rating: 4, text: 'Great product quality. Customer support was very helpful and responsive.' },
]

export const reviewSummary = { averageRating: 4.8, totalReviews: '1,247' }

export interface SystemStatus {
  label: string
  statusText: string
  statusColor: string
  barWidth: number
  barColor: string
}

export const systemMonitorBars: SystemStatus[] = [
  { label: 'Server Load', statusText: 'Normal', statusColor: 'text-green-500', barWidth: 35, barColor: 'bg-green-500' },
  { label: 'Memory Usage', statusText: 'Moderate', statusColor: 'text-amber-500', barWidth: 68, barColor: 'bg-amber-500' },
  { label: 'Disk Space', statusText: 'Good', statusColor: 'text-green-500', barWidth: 45, barColor: 'bg-green-500' },
]

export const systemStats = { uptime: '99.9%', responseTime: '247ms' }

// ─── Dashboard 3 (Analytics) ────────────────────────────────────────────────

export const d3KpiTiles: KpiTile[] = [
  { label: 'Total Users', value: '2,500', iconColor: '#3B82F6', iconBg: 'bg-blue-500', trendPercent: 4, trendDirection: 'up', trendColor: 'text-green-500', trendText: 'From last Week' },
  { label: 'Average Time', value: '123.50', iconColor: '#06B6D4', iconBg: 'bg-cyan-500', trendPercent: 3, trendDirection: 'up', trendColor: 'text-green-500', trendText: 'From last Week' },
  { label: 'Total Males', value: '2,500', iconColor: '#22C55E', iconBg: 'bg-green-500', trendPercent: 34, trendDirection: 'up', trendColor: 'text-green-500', trendText: 'From last Week' },
  { label: 'Total Females', value: '4,567', iconColor: '#F59E0B', iconBg: 'bg-amber-500', trendPercent: 12, trendDirection: 'down', trendColor: 'text-red-500', trendText: 'From last Week' },
  { label: 'Collections', value: '2,315', iconColor: '#EF4444', iconBg: 'bg-red-500', trendPercent: 34, trendDirection: 'up', trendColor: 'text-green-500', trendText: 'From last Week' },
  { label: 'Connections', value: '7,325', iconColor: '#6B7280', iconBg: 'bg-gray-500', trendPercent: 34, trendDirection: 'up', trendColor: 'text-green-500', trendText: 'From last Week' },
]

export const salesOverviewLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const salesOverviewData = [65, 75, 70, 80, 85, 78, 90, 95, 88, 100, 105, 110]

export const revenueBreakdownData: PieSlice[] = [
  { name: 'Products', value: 40, color: '#3498DB' },
  { name: 'Services', value: 25, color: '#E74C3C' },
  { name: 'Subscriptions', value: 20, color: '#F39C12' },
  { name: 'Consulting', value: 15, color: '#9B59B6' },
]

export const topProductsLabels = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E']
export const topProductsData = [120, 190, 300, 500, 200]
export const topProductsColors = [
  'rgba(52, 152, 219, 0.8)',
  'rgba(26, 188, 156, 0.8)',
  'rgba(241, 196, 15, 0.8)',
  'rgba(231, 76, 60, 0.8)',
  'rgba(155, 89, 182, 0.8)',
]

export const conversionFunnelLabels = ['Visitors', 'Leads', 'Prospects', 'Customers']
export const conversionFunnelData = [1000, 400, 200, 50]
export const conversionFunnelColors = [
  'rgba(52, 152, 219, 0.9)',
  'rgba(26, 188, 156, 0.9)',
  'rgba(241, 196, 15, 0.9)',
  'rgba(231, 76, 60, 0.9)',
]

export const trafficSourcesData: PieSlice[] = [
  { name: 'Direct', value: 35, color: '#3498DB' },
  { name: 'Organic Search', value: 25, color: '#2ECC71' },
  { name: 'Social Media', value: 20, color: '#E74C3C' },
  { name: 'Referrals', value: 12, color: '#F39C12' },
  { name: 'Email', value: 8, color: '#9B59B6' },
]

export const ordersAnalyticsLabels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
export const ordersVolumeData = [82, 95, 67, 120, 89, 110, 75, 130, 98, 115, 88, 105, 72, 140, 93, 108, 85, 125, 70, 112, 96, 118, 80, 135, 91, 102, 78, 128, 87, 100]
export const ordersValueData = [3200, 4500, 2800, 5100, 3800, 4200, 3100, 5500, 4000, 4800, 3500, 4100, 2900, 5800, 3700, 4300, 3400, 5200, 2700, 4600, 3900, 4700, 3200, 5600, 3600, 4000, 3100, 5300, 3500, 4100]

export const orderStatusData: PieSlice[] = [
  { name: 'Delivered', value: 45, color: '#2ECC71' },
  { name: 'Pending', value: 25, color: '#F39C12' },
  { name: 'Shipped', value: 15, color: '#3498DB' },
  { name: 'Cancelled', value: 10, color: '#E74C3C' },
  { name: 'Processing', value: 5, color: '#95A5A6' },
]

export interface D3OrderItem {
  orderId: string
  customer: string
  amount: string
  agent: string
  time: string
  status: 'Delivered' | 'Pending' | 'Shipped' | 'Cancelled'
}

export const d3RecentOrders: D3OrderItem[] = [
  { orderId: '#12345', customer: 'John Doe', amount: '$2,300', agent: 'Agent A', time: '12 hours ago', status: 'Delivered' },
  { orderId: '#12346', customer: 'Jane Smith', amount: '$1,500', agent: 'Agent B', time: '10 hours ago', status: 'Pending' },
  { orderId: '#12347', customer: 'Mike Ross', amount: '$450', agent: 'Agent C', time: '8 hours ago', status: 'Shipped' },
  { orderId: '#12348', customer: 'Harvey Specter', amount: '$5,500', agent: 'Agent D', time: '7 hours ago', status: 'Delivered' },
  { orderId: '#12349', customer: 'Louis Litt', amount: '$800', agent: 'Agent A', time: '6 hours ago', status: 'Cancelled' },
  { orderId: '#12350', customer: 'Jessica Pearson', amount: '$1,200', agent: 'Agent B', time: '4 hours ago', status: 'Delivered' },
  { orderId: '#12351', customer: 'Robert Zane', amount: '$950', agent: 'Agent C', time: '3 hours ago', status: 'Pending' },
  { orderId: '#12352', customer: 'Donna Paulsen', amount: '$3,200', agent: 'Agent D', time: '1 hour ago', status: 'Shipped' },
]

export interface SalesAnalyticProgress {
  label: string
  percent: number
  color: string
}

export const d3SalesAnalytics = { totalSales: 156, growthRate: '92%' }
export const d3SalesProgress: SalesAnalyticProgress[] = [
  { label: 'Online Sales', percent: 75, color: 'bg-blue-500' },
  { label: 'Retail Sales', percent: 60, color: 'bg-green-500' },
  { label: 'Mobile Sales', percent: 85, color: 'bg-amber-500' },
  { label: 'B2B Sales', percent: 45, color: 'bg-cyan-500' },
]

// ─── Dashboard 4 (Sales) ────────────────────────────────────────────────────

export interface D4KpiCard {
  label: string
  value: string
  icon: string
  iconColor: string
  bgColor: string
  trendPercent: number
  trendDirection: 'up' | 'down'
  trendColor: string
  trendText: string
}

export const d4KpiCards: D4KpiCard[] = [
  { label: 'Top Sale', value: '$8,450.00', icon: 'DollarSign', iconColor: '#3B82F6', bgColor: 'bg-blue-500/10', trendPercent: 4, trendDirection: 'up', trendColor: 'text-green-500', trendText: 'from last week' },
  { label: 'Total Profit', value: '$24,380.00', icon: 'TrendingUp', iconColor: '#22C55E', bgColor: 'bg-green-500/10', trendPercent: 12, trendDirection: 'up', trendColor: 'text-green-500', trendText: 'from last week' },
  { label: 'New Orders', value: '1,204', icon: 'ShoppingCart', iconColor: '#06B6D4', bgColor: 'bg-cyan-500/10', trendPercent: 25, trendDirection: 'up', trendColor: 'text-green-500', trendText: 'from last week' },
  { label: 'New Customers', value: '43', icon: 'Users', iconColor: '#F59E0B', bgColor: 'bg-amber-500/10', trendPercent: 5, trendDirection: 'down', trendColor: 'text-red-500', trendText: 'from last week' },
]

export const d4SalesStatsLabels = ['Q1', 'Q2', 'Q3', 'Q4']
export const d4SalesStatsData = [12000, 15000, 18000, 22000]
export const d4SalesStatsColors = [
  'rgba(52, 152, 219, 0.8)',
  'rgba(26, 188, 156, 0.8)',
  'rgba(241, 196, 15, 0.8)',
  'rgba(231, 76, 60, 0.8)',
]

export const d4WeeklySalesLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const d4WeeklySalesData = [1200, 1900, 800, 1500, 2200, 1800, 2500]

export interface TopProduct {
  name: string
  category: string
  price: string
  unitsSold: string
}

export const topProductsList: TopProduct[] = [
  { name: 'MacBook Pro 16"', category: 'Electronics', price: '$2,399', unitsSold: '1,234 sold' },
  { name: 'iPhone 15 Pro', category: 'Mobile Phones', price: '$999', unitsSold: '2,156 sold' },
  { name: 'Samsung 4K TV', category: 'Home Entertainment', price: '$1,299', unitsSold: '567 sold' },
  { name: 'AirPods Pro', category: 'Audio', price: '$249', unitsSold: '3,421 sold' },
  { name: 'Gaming Laptop', category: 'Computers', price: '$1,899', unitsSold: '345 sold' },
  { name: 'Wireless Mouse', category: 'Accessories', price: '$79', unitsSold: '1,890 sold' },
]

export const revenueByLocationLabels = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa']
export const revenueByLocationData = [2400, 1800, 3200, 800, 600, 400]
export const revenueByLocationColors = [
  'rgba(52, 152, 219, 0.8)',
  'rgba(26, 188, 156, 0.8)',
  'rgba(241, 196, 15, 0.8)',
  'rgba(230, 126, 34, 0.8)',
  'rgba(155, 89, 182, 0.8)',
  'rgba(231, 76, 60, 0.8)',
]

export interface D4OrderRow {
  orderId: string
  customer: string
  date: string
  total: string
  status: 'Completed' | 'Processing' | 'Shipped' | 'Cancelled'
}

export const d4LatestOrders: D4OrderRow[] = [
  { orderId: '#ORD-12345', customer: 'John Smith', date: '2032-01-15', total: '$1,250.00', status: 'Completed' },
  { orderId: '#ORD-12346', customer: 'Emily Johnson', date: '2032-01-15', total: '$875.50', status: 'Processing' },
  { orderId: '#ORD-12347', customer: 'Michael Chen', date: '2032-01-14', total: '$2,150.75', status: 'Completed' },
  { orderId: '#ORD-12348', customer: 'Sarah Davis', date: '2032-01-14', total: '$650.00', status: 'Shipped' },
  { orderId: '#ORD-12349', customer: 'Robert Wilson', date: '2032-01-13', total: '$1,480.25', status: 'Cancelled' },
  { orderId: '#ORD-12350', customer: 'Lisa Brown', date: '2032-01-13', total: '$920.00', status: 'Completed' },
  { orderId: '#ORD-12351', customer: 'David Garcia', date: '2032-01-12', total: '$1,125.50', status: 'Processing' },
  { orderId: '#ORD-12352', customer: 'Anna Martinez', date: '2032-01-12', total: '$775.00', status: 'Shipped' },
  { orderId: '#ORD-12353', customer: 'James Taylor', date: '2032-01-11', total: '$2,340.00', status: 'Completed' },
  { orderId: '#ORD-12354', customer: 'Maria Rodriguez', date: '2032-01-11', total: '$560.75', status: 'Processing' },
]
