import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { getKBCategories } from '@/lib/bbc/store'

export function KnowledgeBase() {
  const [activeTunnel, setActiveTunnel] = useState<'sales' | 'support'>('sales')
  const categories = getKBCategories(activeTunnel)
  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <div className='flex rounded-lg border bg-muted p-1'>
            <button onClick={() => setActiveTunnel('sales')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${activeTunnel === 'sales' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}>
              Sales KB
            </button>
            <button onClick={() => setActiveTunnel('support')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${activeTunnel === 'support' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}>
              Support KB
            </button>
          </div>
        </div>
      </Header>
      <Main>
        <div className='mb-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Knowledge Base</h2>
          <p className='text-muted-foreground'>
            {activeTunnel === 'sales' ? 'Knowledge base for the Sales chatbot' : 'Knowledge base for the Support chatbot'}
          </p>
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {categories.map((cat) => (
            <div key={cat.id} className='rounded-lg border bg-card p-6 shadow-sm'>
              <div className='mb-4 flex items-center gap-3'>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cat.iconBg}`}>
                  <span className={`text-lg ${cat.iconColor}`}>📚</span>
                </div>
                <div>
                  <h3 className='font-semibold'>{cat.name}</h3>
                  <p className='text-sm text-muted-foreground'>{cat.entries.length} entries</p>
                </div>
              </div>
              <div className='space-y-2'>
                {cat.entries.map((entry) => (
                  <div key={entry.id} className='rounded-md border p-3'>
                    <h4 className='text-sm font-medium'>{entry.title}</h4>
                    <p className='mt-1 text-xs text-muted-foreground line-clamp-2'>{entry.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Main>
    </>
  )
}
