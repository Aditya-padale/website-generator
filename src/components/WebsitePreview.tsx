'use client'

import { useRef, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

interface WebsitePreviewProps {
  code: string
}

export default function WebsitePreview({ code }: WebsitePreviewProps) {
  const { theme } = useTheme()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [previewKey, setPreviewKey] = useState(0)

  useEffect(() => {
    if (code && iframeRef.current) {
      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Generated Website Preview</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
          <script src="https://unpkg.com/heroicons@2.0.16/24/outline/index.js"></script>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Inter', system-ui, sans-serif;
              line-height: 1.6;
              color: #1f2937;
            }
            html {
              scroll-behavior: smooth;
            }
            /* Custom animations */
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fadeIn 0.6s ease-out;
            }
            /* Custom gradients */
            .bg-gradient-modern {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .bg-gradient-warm {
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            }
            .bg-gradient-cool {
              background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            }
            /* Hover effects */
            .hover-lift {
              transition: all 0.3s ease;
            }
            .hover-lift:hover {
              transform: translateY(-5px);
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
          </style>
        </head>
        <body>
          ${code}
          <script>
            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
              anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              });
            });
            
            // Add loading animations
            const observerOptions = {
              threshold: 0.1,
              rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('animate-fade-in');
                }
              });
            }, observerOptions);
            
            document.querySelectorAll('section, .card, .feature').forEach(el => {
              observer.observe(el);
            });
            
            window.addEventListener('load', function() {
              window.parent.postMessage({ type: 'iframe-loaded' }, '*');
            });
          </script>
        </body>
        </html>
      `

      const blob = new Blob([fullHtml], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      
      iframeRef.current.onload = () => {
        setIsLoading(false)
      }
      
      iframeRef.current.src = url
      
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [code, previewKey])

  const handleRefresh = () => {
    setIsLoading(true)
    setPreviewKey(prev => prev + 1)
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-t-xl`}>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className={`flex-1 mx-4 px-4 py-1.5 ${theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-500'} rounded-md text-sm text-center font-mono truncate`}>
          preview.webgen.ai
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            className={`p-1.5 ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'} rounded-md transition-colors`}
            title="Refresh Preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className={`relative flex-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} rounded-b-xl overflow-hidden`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        )}
        <iframe
          key={previewKey}
          ref={iframeRef}
          className="w-full h-full border-0 bg-white"
          title="Website Preview"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  )
}
