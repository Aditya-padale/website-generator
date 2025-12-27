'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Sparkles, ExternalLink, Moon, Sun } from 'lucide-react'
import PromptInput from './PromptInput'
import WebsitePreview from './WebsitePreview'
import DeployButton from './DeployButton'
import { useTheme } from '@/context/ThemeContext'

export default function WebsiteGenerator() {
  const { theme, toggleTheme } = useTheme()
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployedUrl, setDeployedUrl] = useState('')
  const [currentStep, setCurrentStep] = useState('input') // 'input', 'generating', 'preview', 'deployed'

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setCurrentStep('generating')
    
    try {
      const response = await fetch('/api/generate-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || data.details || `Server error: ${response.status}`)
      }
      
      if (data.code) {
        setGeneratedCode(data.code)
        setCurrentStep('preview')
      } else {
        throw new Error(data.error || data.details || 'Failed to generate website - no code returned')
      }
    } catch (error) {
      console.error('Error generating website:', error)
      alert(`Failed to generate website: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setCurrentStep('input')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeploy = async () => {
    if (!generatedCode) return

    setIsDeploying(true)

    try {
      const response = await fetch('/api/deploy-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: generatedCode, prompt }),
      })

      const data = await response.json()
      
      if (data.url) {
        setDeployedUrl(data.url)
        setCurrentStep('deployed')
      } else {
        throw new Error(data.detail || 'Failed to deploy website')
      }
    } catch (error) {
      console.error('Error deploying website:', error)
      alert(`Failed to deploy website: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDeploying(false)
    }
  }

  const handleReset = () => {
    setPrompt('')
    setGeneratedCode('')
    setDeployedUrl('')
    setCurrentStep('input')
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20' : 'bg-gradient-to-r from-purple-200/40 via-pink-200/40 to-cyan-200/40'} animate-gradient-x`}></div>
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Globe className={`w-8 h-8 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                WebGen AI
              </span>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow-lg transition-all`}
            >
              {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-cyan-400 via-purple-500 to-pink-500' : 'from-cyan-600 via-purple-600 to-pink-600'}`}>
              AI Website Generator
            </h1>
            <p className={`text-xl md:text-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Transform your ideas into stunning websites in seconds with the power of AI.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {currentStep === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <PromptInput
                value={prompt}
                onChange={setPrompt}
                onGenerate={handleGenerate}
                isLoading={isGenerating}
              />
            </motion.div>
          )}

          {currentStep === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto mb-6"
                >
                  <Sparkles className={`w-full h-full ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                </motion.div>
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                  Creating Your Website...
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
                  AI is crafting your perfect website from your description
                </p>
              </div>
            </motion.div>
          )}

          {currentStep === 'preview' && generatedCode && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                  Your Website is Ready!
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Preview your generated website below and deploy it with one click
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="order-2 lg:order-1">
                  <WebsitePreview code={generatedCode} />
                </div>
                
                <div className="order-1 lg:order-2 space-y-6">
                  <div className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-sm rounded-xl p-6 border`}>
                    <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Generated Code</h4>
                    <pre className={`${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'} p-4 rounded-lg text-sm overflow-auto max-h-60`}>
                      <code>{generatedCode.substring(0, 500)}...</code>
                    </pre>
                  </div>

                  <div className="flex flex-col gap-4">
                    <DeployButton
                      onClick={handleDeploy}
                      isLoading={isDeploying}
                      disabled={!generatedCode}
                    />
                    
                    <button
                      onClick={handleReset}
                      className={`w-full py-3 px-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} font-medium transition-colors`}
                    >
                      Generate New Website
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'deployed' && deployedUrl && (
            <motion.div
              key="deployed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="mb-8"
              >
                <Globe className="w-24 h-24 text-green-400 mx-auto" />
              </motion.div>
              
              <h3 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                🎉 Website Deployed Successfully!
              </h3>
              
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg mb-8`}>
                Your website is now live and accessible to the world
              </p>
              
              <div className="space-y-4">
                <a
                  href={deployedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all"
                >
                  <ExternalLink className="h-5 w-5" />
                  Visit Your Website
                </a>
                
                <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                  {deployedUrl}
                </div>
                
                <button
                  onClick={handleReset}
                  className={`block mx-auto mt-8 py-3 px-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} font-medium transition-colors`}
                >
                  Create Another Website
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} py-8`}>
        <div className="container mx-auto px-6 text-center">
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Powered by Google Gemini AI and deployed on Vercel
          </p>
        </div>
      </footer>
    </div>
  )
}
