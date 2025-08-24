import { z } from 'zod'

export const FlowerSchema = z.object({
  id: z.string(),
  name: z.string(),
  japaneseName: z.string(),
  meaning: z.string(),
  color: z.string(),
  season: z.enum(['春', '夏', '秋', '冬']),
  emoji: z.string(),
  description: z.string(),
})

export const DiaryEntrySchema = z.object({
  id: z.string(),
  flowerId: z.string(),
  title: z.string(),
  content: z.string(),
  mood: z.enum(['喜び', '悲しみ', '愛', '希望', '感謝', '平和']),
  date: z.string(),
  createdAt: z.string(),
})

export type Flower = z.infer<typeof FlowerSchema>
export type DiaryEntry = z.infer<typeof DiaryEntrySchema>