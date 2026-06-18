/**
 * Training Lab - Training Content & SOP Creator
 *
 * Features:
 * - Browse existing training content
 * - Create new training modules
 * - Generate SOPs and corrective actions
 * - Multi-language support
 * - Export to various formats
 */

import { useState } from 'react';
import {
  BookOpen,
  FileText,
  FolderOpen,
  Plus,
  Play,
  Download,
  Search,
  ChevronRight,
  Beaker,
  ShieldCheck,
  Utensils,
  Factory,
  Presentation
} from 'lucide-react';

interface TrainingLabProps {
  onContextUpdate?: (context: {
    workspace: 'training-lab';
    selection?: unknown;
    activeItem?: { id: string; name: string; type: string };
    metadata?: Record<string, unknown>;
  }) => void;
}

interface ContentCollection {
  id: string;
  name: string;
  description: string;
  icon: typeof BookOpen;
  path: string;
  items: number;
  category: 'training' | 'business' | 'education';
}

const CONTENT_COLLECTIONS: ContentCollection[] = [
  {
    id: 'chemical-sanitation',
    name: 'Chemical Sanitation',
    description: 'Complete training on chemical handling and sanitation procedures',
    icon: Beaker,
    path: 'projects/professional/food-safety/output/chemicals/',
    items: 12,
    category: 'training'
  },
  {
    id: 'shopfloor-training',
    name: 'Shopfloor Training',
    description: 'On-floor training materials for production staff',
    icon: Factory,
    path: 'projects/professional/food-safety/output/shopfloor-training/',
    items: 8,
    category: 'training'
  },
  {
    id: 'listeria-training',
    name: 'Listeria Control',
    description: 'FarmWise listeria prevention and control training',
    icon: ShieldCheck,
    path: 'projects/professional/food-safety/output/farmwise-listeria-training/',
    items: 15,
    category: 'training'
  },
  {
    id: 'food-safety-culture',
    name: 'Food Safety Culture',
    description: 'Building a strong food safety culture in your organization',
    icon: Utensils,
    path: 'projects/professional/food-safety/output/food-safety-culture/',
    items: 10,
    category: 'training'
  },
  {
    id: 'farmwise-proposal',
    name: 'FarmWise Proposal',
    description: 'Business proposal and intervention materials',
    icon: FileText,
    path: 'projects/professional/food-safety/output/farmwise-proposal/',
    items: 5,
    category: 'business'
  },
  {
    id: 'iclean-presentation',
    name: 'iClean Presentation',
    description: 'Client presentation for Sanitech partnership',
    icon: Presentation,
    path: 'projects/professional/food-safety/output/iclean-sanitech-presentation/',
    items: 20,
    category: 'business'
  },
  {
    id: 'igcse-lessons',
    name: 'IGCSE Lessons',
    description: 'Cambridge IGCSE Mathematics lesson content',
    icon: BookOpen,
    path: 'packages/backend/output/lessons/',
    items: 3,
    category: 'education'
  }
];

export default function TrainingLab({ onContextUpdate }: TrainingLabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'training' | 'business' | 'education'>('all');
  const [selectedCollection, setSelectedCollection] = useState<ContentCollection | null>(null);

  const filteredCollections = CONTENT_COLLECTIONS.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || collection.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryColors = {
    training: 'bg-green-500/20 text-green-400 border-green-500/30',
    business: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    education: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  return (
    <div className="h-full flex flex-col bg-studio-bg text-studio-text">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-studio-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white">Training Lab</h1>
            <p className="text-xs text-zinc-500">Content & SOP Creator</p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} />
          New Module
        </button>
      </div>

      {/* Search and Filter */}
      <div className="p-4 border-b border-studio-border">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search training content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-teal-500"
            />
          </div>
          <div className="flex gap-1 p-1 bg-zinc-900 rounded-lg">
            {(['all', 'training', 'business', 'education'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded text-sm capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredCollections.map((collection) => {
            const Icon = collection.icon;
            return (
              <div
                key={collection.id}
                onClick={() => {
                  setSelectedCollection(collection);
                  onContextUpdate?.({
                    workspace: 'training-lab',
                    activeItem: {
                      id: collection.id,
                      name: collection.name,
                      type: 'collection'
                    },
                    metadata: { path: collection.path }
                  });
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-teal-500/50 ${
                  selectedCollection?.id === collection.id
                    ? 'border-teal-500 bg-teal-500/10'
                    : 'border-zinc-800 bg-zinc-900/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[collection.category]}`}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[collection.category]}`}>
                    {collection.category}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{collection.name}</h3>
                <p className="text-sm text-zinc-500 mb-3">{collection.description}</p>
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>{collection.items} items</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            );
          })}
        </div>

        {filteredCollections.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p>No content found matching your search</p>
          </div>
        )}
      </div>

      {/* Selected Collection Details */}
      {selectedCollection && (
        <div className="p-4 border-t border-studio-border bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{selectedCollection.name}</h3>
              <p className="text-xs text-zinc-500 font-mono">{selectedCollection.path}</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-sm transition-colors">
                <Play size={14} />
                Preview
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-sm transition-colors">
                <Download size={14} />
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
