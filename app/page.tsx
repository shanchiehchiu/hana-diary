'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, BookOpen, Heart, Filter, Search } from 'lucide-react'
import { DiaryEntry as DiaryEntryType } from './types/flower'
import { flowers } from './data/flowers'
import DiaryEntry from './components/DiaryEntry'
import DiaryForm from './components/DiaryForm'
import FlowerCard from './components/FlowerCard'

export default function Home() {
  const [entries, setEntries] = useState<DiaryEntryType[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<DiaryEntryType | null>(null)
  const [selectedSeason, setSelectedSeason] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // ローカルストレージから日記を読み込み
  useEffect(() => {
    const savedEntries = localStorage.getItem('flower-diary-entries')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    } else {
      // デモ用のサンプルデータ
      const sampleEntries: DiaryEntryType[] = [
        {
          id: 'sample-1',
          flowerId: 'sakura',
          title: '春の始まり',
          content: '今日は公園で満開の桜を見つけました。淡いピンクの花びらが風に舞い散る様子は本当に美しく、新しい季節への希望を感じました。桜の花言葉「純潔、精神美、優美な女性」のように、心も新たに清らかな気持ちでスタートしたいと思います。',
          mood: '希望',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'sample-2',
          flowerId: 'rose',
          title: '母への愛',
          content: '母の日に赤いバラを贈りました。母の笑顔を見ていると、これまでの愛情深い支えに心から感謝の気持ちが湧いてきます。バラの花言葉「愛、美、情熱」は、まさに母への想いそのものです。',
          mood: '愛',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]
      setEntries(sampleEntries)
    }
  }, [])

  // 日記をローカルストレージに保存
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('flower-diary-entries', JSON.stringify(entries))
    }
  }, [entries])

  const handleSaveEntry = (entryData: Omit<DiaryEntryType, 'id' | 'createdAt'>) => {
    if (editingEntry) {
      // 編集モード
      setEntries(prev => prev.map(entry => 
        entry.id === editingEntry.id 
          ? { ...entryData, id: editingEntry.id, createdAt: editingEntry.createdAt }
          : entry
      ))
      setEditingEntry(null)
    } else {
      // 新規作成
      const newEntry: DiaryEntryType = {
        ...entryData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      setEntries(prev => [newEntry, ...prev])
    }
    setIsFormOpen(false)
  }

  const handleDeleteEntry = (id: string) => {
    if (confirm('この日記を削除してもよろしいですか？')) {
      setEntries(prev => prev.filter(entry => entry.id !== id))
    }
  }

  const handleEditEntry = (entry: DiaryEntryType) => {
    setEditingEntry(entry)
    setIsFormOpen(true)
  }

  // フィルタリングされた日記
  const filteredEntries = entries.filter(entry => {
    const flower = flowers.find(f => f.id === entry.flowerId)
    if (!flower) return false

    const matchesSeason = selectedSeason === 'all' || flower.season === selectedSeason
    const matchesSearch = searchQuery === '' || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flower.japaneseName.includes(searchQuery) ||
      flower.name.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSeason && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="bg-surface shadow-sm border-b border-surface-variant/50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                🌸 花語日記
              </h1>
              <p className="text-foreground/70 mt-1">
                美しい花の言葉と共に想いを綴る
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsFormOpen(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 flex items-center gap-2 transition-all shadow-md"
            >
              <Plus className="w-5 h-5" />
              新しい日記
            </motion.button>
          </motion.div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* フィルターとサーチ */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-5 h-5" />
              <input
                type="text"
                placeholder="タイトル、内容、花の名前で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-surface-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-foreground/60" />
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="px-4 py-3 rounded-lg border border-surface-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            >
              <option value="all">すべての季節</option>
              <option value="春">春</option>
              <option value="夏">夏</option>
              <option value="秋">秋</option>
              <option value="冬">冬</option>
            </select>
          </div>
        </div>

        {/* 日記一覧 */}
        <AnimatePresence mode="popLayout">
          {filteredEntries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              {entries.length === 0 ? (
                <>
                  <BookOpen className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground/70 mb-2">
                    まだ日記がありません
                  </h3>
                  <p className="text-foreground/50 mb-6">
                    あなたの想いを花の言葉と共に綴ってみましょう
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsFormOpen(true)}
                    className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 inline-flex items-center gap-2 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    最初の日記を作成
                  </motion.button>
                </>
              ) : (
                <>
                  <Heart className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground/70 mb-2">
                    検索条件に一致する日記が見つかりません
                  </h3>
                  <p className="text-foreground/50">
                    検索条件やフィルターを変更してお試しください
                  </p>
                </>
              )}
            </motion.div>
          ) : (
            <div className="space-y-6">
              {filteredEntries.map((entry) => (
                <DiaryEntry
                  key={entry.id}
                  entry={entry}
                  onEdit={() => handleEditEntry(entry)}
                  onDelete={() => handleDeleteEntry(entry.id)}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* 花の種類紹介セクション（日記がない場合） */}
        {entries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              花の言葉を知る 🌺
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {flowers.slice(0, 8).map((flower) => (
                <FlowerCard key={flower.id} flower={flower} />
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* 日記作成/編集フォーム */}
      <DiaryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingEntry(null)
        }}
        onSave={handleSaveEntry}
        entry={editingEntry || undefined}
      />
    </div>
  )
}
