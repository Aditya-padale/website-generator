'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Wand2, Sparkles } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  onGenerate: () => void
  isLoading: boolean
}

export default function PromptInput({ value, onChange, onGenerate, isLoading }: PromptInputProps) {
  const { theme } = useTheme()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoading && value.trim()) {
      onGenerate()
    }
  }

  const suggestions = [
    "A modern portfolio website for a photographer with dark theme",
    "An e-commerce landing page for organic skincare products",
    "A restaurant website with menu and online reservation system",
    "A SaaS landing page for a project management tool",
    "A personal blog with minimalist design and newsletter signup",
    "A fitness gym website with class schedules and trainer profiles"
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Main Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-sm rounded-2xl p-8 border shadow-2xl transition-colors duration-300`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="prompt" className={`block text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-3`}>
              Describe your dream website
            </label>
            <textarea
              ref={textareaRef}
              id="prompt"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g., Create a modern portfolio website for a graphic designer with a dark theme, animated elements, and sections for projects, about, and contact..."
              className={`w-full h-32 px-4 py-3 ${theme === 'dark' ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-lg transition-colors duration-300`}
              disabled={isLoading}
            />
          </div>

          <motion.button
            type="submit"
            disabled={!value.trim() || isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 px-8 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-lg rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-6 w-6" />
                  </motion.div>
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-6 w-6" />
                  Generate Website
                </>
              )}
            </div>
          </motion.button>
        </form>
      </motion.div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} text-center`}>
          Need inspiration? Try one of these:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              onClick={() => onChange(suggestion)}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 text-left rounded-xl border ${theme === 'dark' ? 'bg-gray-800/30 border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:border-cyan-500/50' : 'bg-white/50 border-gray-200 text-gray-600 hover:bg-white hover:border-cyan-500/50'} transition-all duration-200`}
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
