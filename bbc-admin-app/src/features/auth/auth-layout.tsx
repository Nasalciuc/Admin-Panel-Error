import { Logo } from '@/assets/logo'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        <div className='flex flex-col items-center gap-2 mb-6'>
          <Logo className='size-10' />
          <h1 className='text-xl font-bold font-display'>BBC Admin</h1>
          <p className='text-sm text-muted-foreground'>BuyBusinessClass</p>
        </div>
        {children}
      </div>
    </div>
  )
}
