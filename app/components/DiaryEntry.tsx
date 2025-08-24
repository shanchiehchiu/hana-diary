'use client'

import { motion } from 'framer-motion'
import { Calendar, Flower2, Edit3, Trash2 } from 'lucide-react'
import { DiaryEntry as DiaryEntryType } from '../types/flower'
import { flowers } from '../data/flowers'

interface DiaryEntryProps {
  entry: DiaryEntryType
  onEdit?: () => void
  onDelete?: () => void
}

const getMoodEmoji = (mood: string) => {
  const moodMap: { [key: string]: string } = {
    '喜び': '😊',
    '悲しみ': '😢',
    '愛': '💕',
    '希望': '✨',
    '感謝': '🙏',
    '平和': '🕊️',
  }
  return moodMap[mood] || '💭'
}


export default function DiaryEntry({ entry, onEdit, onDelete }: DiaryEntryProps) {
  const flower = flowers.find(f => f.id === entry.flowerId)
  
  if (!flower) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-lg shadow-md p-6 border border-surface-variant/50 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{flower.emoji}</div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {entry.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <Flower2 className="w-4 h-4" />
              <span>{flower.japaneseName}</span>
              <span>•</span>
              <span className={getMoodEmoji(entry.mood)}>
                {getMoodEmoji(entry.mood)} {entry.mood}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-foreground/60 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
            title="編集"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-foreground/60 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            title="削除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-foreground/80 leading-relaxed">
          {entry.content}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm text-foreground/60">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(entry.date).toLocaleDateString('ja-JP')}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-primary font-medium">
            &quot;{flower.meaning}&quot;
          </span>
        </div>
      </div>
    </motion.div>
  )
}