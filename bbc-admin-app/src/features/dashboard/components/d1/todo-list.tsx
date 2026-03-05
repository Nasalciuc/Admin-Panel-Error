import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { todoItems as initialTodos } from '../../data/gentelella-data'

export function TodoList() {
  const [items, setItems] = useState(initialTodos)

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t))
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>To Do List</CardTitle>
        <CardDescription>Sample tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className='space-y-3'>
          {items.map((t) => (
            <li key={t.id} className='flex items-center gap-3'>
              <Checkbox
                id={t.id}
                checked={t.checked}
                onCheckedChange={() => toggle(t.id)}
              />
              <label
                htmlFor={t.id}
                className={`text-sm ${t.checked ? 'text-muted-foreground line-through' : ''}`}
              >
                {t.label}
              </label>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
