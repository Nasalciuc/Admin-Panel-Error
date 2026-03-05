import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { recentOrders } from '../../data/gentelella-data'

const statusStyles: Record<string, string> = {
  Completed: 'bg-green-500 text-white hover:bg-green-500',
  Processing: 'bg-amber-500 text-black hover:bg-amber-500',
  Shipped: 'bg-cyan-500 text-white hover:bg-cyan-500',
  Cancelled: 'bg-red-500 text-white hover:bg-red-500',
}

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className='hidden md:table-cell'>Product</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='hidden lg:table-cell'>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((o) => (
              <TableRow key={o.orderId}>
                <TableCell className='font-medium'>{o.orderId}</TableCell>
                <TableCell>{o.customer}</TableCell>
                <TableCell className='hidden md:table-cell'>{o.product}</TableCell>
                <TableCell>{o.amount}</TableCell>
                <TableCell>
                  <Badge className={statusStyles[o.status]}>{o.status}</Badge>
                </TableCell>
                <TableCell className='hidden lg:table-cell'>{o.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
