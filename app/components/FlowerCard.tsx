'use client'

import { motion } from 'framer-motion'
import { Flower } from '../types/flower'

interface FlowerCardProps {
  flower: Flower
  onClick?: () => void
  isSelected?: boolean
}

export default function FlowerCard({ flower, onClick, isSelected = false }: FlowerCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden rounded-lg shadow-md cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'ring-2 ring-primary shadow-lg bg-primary/5' 
          : 'bg-surface hover:shadow-lg'
        }
      `}
      onClick={onClick}
      layout
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl">{flower.emoji}</div>
          <div className="text-xs text-foreground/60 font-medium bg-surface-variant px-2 py-1 rounded-full">
            {flower.season}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-foreground mb-1">
          {flower.japaneseName}
        </h3>
        <p className="text-sm text-foreground/70 mb-3">
          {flower.name}
        </p>
        
        <div className="mb-4">
          <p className="text-sm font-medium text-primary">
            {flower.meaning}
          </p>
        </div>
        
        <p className="text-xs text-foreground/60 leading-relaxed">
          {flower.description}
        </p>
      </div>
      
      {isSelected && (
        <motion.div
          layoutId="selected-indicator"
          className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      )}
    </motion.div>
  )
}