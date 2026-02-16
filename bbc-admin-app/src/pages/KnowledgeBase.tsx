import { Search, Plus, Building2, Star, Plane, CalendarCheck, HelpCircle } from 'lucide-react'
import { kbCategories } from '../data/mock'
import type { KBCategory } from '../types'

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Star,
  Plane,
  CalendarCheck,
  HelpCircle,
}

function CategoryCard({ category }: { category: KBCategory }) {
  const Icon = iconMap[category.icon] || HelpCircle

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-gold-500/30 transition cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-navy-900/5 rounded-xl flex items-center justify-center group-hover:bg-gold-500/10 transition">
          <Icon className="w-6 h-6 text-navy-900 group-hover:text-gold-500 transition" />
        </div>
        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
          {category.articleCount} articles
        </span>
      </div>
      <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
      <p className="text-xs text-gray-400 mb-4 line-clamp-2">{category.description}</p>
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-gray-400">Updated {category.lastUpdated}</span>
        <span className="text-gold-500 font-bold uppercase opacity-0 group-hover:opacity-100 transition">
          View →
        </span>
      </div>
    </div>
  )
}

export default function KnowledgeBase() {
  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Knowledge Base</h1>
          <p className="text-sm text-gray-400 mt-1">Manage AI training data and articles</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gold-500 w-64"
            />
          </div>
          <button className="bg-gold-500 text-black px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center">
            <Plus className="w-4 h-4 mr-1" /> Add Article
          </button>
        </div>
      </header>

      {/* Categories Grid */}
      <div className="grid grid-cols-3 gap-6">
        {kbCategories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  )
}
