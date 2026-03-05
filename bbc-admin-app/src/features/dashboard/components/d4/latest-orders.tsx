import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { d4LatestOrders } from '../../data/gentelella-data'

const statusStyles: Record<string, string> = {
  Completed: 'bg-green-500 text-white hover:bg-green-500',
  Processing: 'bg-amber-500 text-black hover:bg-amber-500',
  Shipped: 'bg-cyan-500 text-white hover:bg-cyan-500',
  Cancelled: 'bg-red-500 text-white hover:bg-red-500',
}

export function LatestOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className='hidden md:table-cell'>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {d4LatestOrders.map((o) => (
              <TableRow key={o.orderId}>
                <TableCell className='font-bold'>{o.orderId}</TableCell>
                <TableCell>{o.customer}</TableCell>
                <TableCell className='hidden md:table-cell'>{o.date}</TableCell>
                <TableCell className='font-bold'>{o.total}</TableCell>
                <TableCell>
                  <Badge className={statusStyles[o.status]}>{o.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
