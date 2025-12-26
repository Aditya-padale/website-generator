'use client'

import { motion } from 'framer-motion'
import { Rocket, Loader2 } from 'lucide-react'

interface DeployButtonProps {
  onClick: () => void
  isLoading: boolean
  disabled?: boolean
}

export default function DeployButton({ onClick, isLoading, disabled = false }: DeployButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className="w-full py-4 px-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-lg rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all relative overflow-hidden"
    >
      <div className="flex items-center justify-center gap-3 relative z-10">
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-6 w-6" />
            </motion.div>
            Deploying to Vercel...
          </>
        ) : (
          <>
            <Rocket className="h-6 w-6" />
            Deploy to Vercel
          </>
        )}
      </div>
      
      {/* Animated background gradient */}
      {!disabled && !isLoading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      {/* Loading animation */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      )}
    </motion.button>
  )
}
