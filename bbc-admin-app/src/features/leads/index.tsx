import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { getLeads } from '@/lib/bbc/store'

export function Leads() {
  const leads = getLeads()
  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <span className='text-sm text-muted-foreground'>{leads.length} leads</span>
        </div>
      </Header>
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Leads</h2>
            <p className='text-muted-foreground'>Leads captured from chatbot conversations</p>
          </div>
        </div>
        <div className='rounded-md border'>
          <table className='w-full'>
            <thead>
              <tr className='border-b bg-muted/50'>
                <th className='h-12 px-4 text-left font-medium text-muted-foreground'>Name</th>
                <th className='h-12 px-4 text-left font-medium text-muted-foreground'>Email</th>
                <th className='h-12 px-4 text-left font-medium text-muted-foreground'>Route</th>
                <th className='h-12 px-4 text-left font-medium text-muted-foreground'>Intent</th>
                <th className='h-12 px-4 text-left font-medium text-muted-foreground'>Score</th>
                <th className='h-12 px-4 text-left font-medium text-muted-foreground'>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className='border-b hover:bg-muted/50'>
                  <td className='p-4'><span className='font-medium'>{lead.name}</span></td>
                  <td className='p-4 text-sm text-muted-foreground'>{lead.email}</td>
                  <td className='p-4 text-sm font-mono'>{lead.route}</td>
                  <td className='p-4'><span className='rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700'>{lead.intent}</span></td>
                  <td className='p-4'><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${lead.score >= 80 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{lead.score}</span></td>
                  <td className='p-4'><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                    lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' :
                    lead.status === 'Converted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>{lead.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Main>
    </>
  )
}
