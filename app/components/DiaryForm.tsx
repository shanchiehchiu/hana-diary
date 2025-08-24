'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save } from 'lucide-react'
import { DiaryEntry, Flower } from '../types/flower'
import { flowers } from '../data/flowers'
import FlowerCard from './FlowerCard'

interface DiaryFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => void
  entry?: DiaryEntry
}

const moods = ['喜び', '悲しみ', '愛', '希望', '感謝', '平和'] as const

export default function DiaryForm({ isOpen, onClose, onSave, entry }: DiaryFormProps) {
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(
    entry ? flowers.find(f => f.id === entry.flowerId) || null : null
  )
  const [title, setTitle] = useState(entry?.title || '')
  const [content, setContent] = useState(entry?.content || '')
  const [mood, setMood] = useState<typeof moods[number]>(entry?.mood || '喜び')
  const [date, setDate] = useState(entry?.date || new Date().toISOString().split('T')[0])

  const handleSave = () => {
    if (!selectedFlower || !title.trim() || !content.trim()) return

    onSave({
      flowerId: selectedFlower.id,
      title: title.trim(),
      content: content.trim(),
      mood,
      date,
    })

    // Reset form
    setSelectedFlower(null)
    setTitle('')
    setContent('')
    setMood('喜び')
    setDate(new Date().toISOString().split('T')[0])
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-surface rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {entry ? '日記を編集' : '新しい日記を作成'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-foreground/60 hover:text-foreground hover:bg-surface-variant rounded-md transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* 花選択 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-foreground">
                    花を選ぶ 🌸
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {flowers.map((flower) => (
                      <FlowerCard
                        key={flower.id}
                        flower={flower}
                        isSelected={selectedFlower?.id === flower.id}
                        onClick={() => setSelectedFlower(flower)}
                      />
                    ))}
                  </div>
                </div>

                {/* フォーム */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      タイトル
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-surface-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="今日の想いにタイトルをつけて..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        気持ち
                      </label>
                      <select
                        value={mood}
                        onChange={(e) => setMood(e.target.value as typeof moods[number])}
                        className="w-full px-4 py-2 rounded-lg border border-surface-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      >
                        {moods.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        日付
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-surface-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      内容
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-2 rounded-lg border border-surface-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                      placeholder="今日の想い、感じたことを自由に書いてください..."
                    />
                  </div>
                </div>

                {/* 選択した花の情報 */}
                {selectedFlower && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface-variant rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{selectedFlower.emoji}</span>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {selectedFlower.japaneseName} ({selectedFlower.name})
                        </h4>
                        <p className="text-sm text-primary font-medium">
                          &quot;{selectedFlower.meaning}&quot;
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/70">
                      {selectedFlower.description}
                    </p>
                  </motion.div>
                )}

                {/* アクションボタン */}
                <div className="flex justify-end gap-3 pt-4 border-t border-surface-variant">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 text-foreground/70 hover:text-foreground transition-colors"
                  >
                    キャンセル
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={!selectedFlower || !title.trim() || !content.trim()}
                    className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    保存する
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}