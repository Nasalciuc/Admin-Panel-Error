function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-60 bg-navy-900 text-white p-6 flex flex-col">
        {/* Logo Section */}
        <div className="mb-8 pb-6 border-b border-navy-700">
          <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center mb-3">
            {/* Put your logo here: <img src={yourLogo} alt="BBC Logo" className="w-10 h-10" /> */}
            <span className="text-navy-900 font-bold text-lg">B</span>
          </div>
          <p className="text-sm font-bold tracking-widest leading-tight">
            BUY<br />BUSINESS<br />CLASS
          </p>
        </div>

        {/* Navigation placeholder */}
        <nav className="flex-1 space-y-2">
          <div className="px-3 py-2 rounded-lg bg-gray-800 text-white text-sm">Dashboard</div>
        </nav>
      </div>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gold-500 mt-4 font-display text-4xl font-extrabold">Setup complet ✓</p>
        
        <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200 max-w-md">
          <h2 className="font-bold text-gray-900 mb-4">Import Logo:</h2>
          <p className="text-sm text-gray-600 mb-4">
            Copiaz logourile în <code className="bg-gray-100 px-2 py-1 rounded">src/assets/</code>
          </p>
          <p className="text-sm text-gray-600">
            Apoi actualizeaza App.tsx:
            <br/><code className="bg-gray-100 px-2 py-1 rounded text-xs">import logo from './assets/logo.png'</code>
          </p>
        </div>
      </main>
    </div>
  )
}

export default App
