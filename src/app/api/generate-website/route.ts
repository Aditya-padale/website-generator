import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const maxDuration = 60; // Set max duration to 60 seconds for Vercel Hobby plan

export async function POST(request: NextRequest) {
  try {
    console.log('=== GENERATE WEBSITE API CALLED ===')
    console.log('API Route called - checking environment variables...')
    
    const apiKey = process.env.GEMINI_API_KEY
    console.log('API Key check - exists:', !!apiKey)
    console.log('API Key length:', apiKey ? apiKey.length : 0)
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }
    
    const { prompt } = await request.json()
    console.log('Received prompt:', prompt?.substring(0, 100) + '...')

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    console.log('Initializing Gemini AI...')
    let genAI, model
    try {
      genAI = new GoogleGenerativeAI(apiKey)
      console.log('GoogleGenerativeAI instance created')
      // Use Gemini 2.5 Flash model as requested
      model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
      console.log('Model instance created')
    } catch (initError) {
      console.error('Error initializing Gemini:', initError)
      return NextResponse.json({ 
        error: 'Failed to initialize AI model',
        details: initError instanceof Error ? initError.message : 'Unknown initialization error'
      }, { status: 500 })
    }

    const enhancedPrompt = `
You are an expert web designer and developer. Create a complete, modern, and visually stunning HTML website based on this description: "${prompt}"

CRITICAL REQUIREMENTS:
1. Use modern HTML5 semantic elements with proper structure
2. Include Tailwind CSS via CDN for professional styling
3. Make it fully responsive for all screen sizes (mobile-first approach)
4. Add smooth CSS animations, transitions, and hover effects
5. Include proper meta tags and accessibility features
6. Create a well-structured layout with header, main content sections, and footer
7. Use modern typography (Inter, system fonts) and professional color schemes
8. Add interactive elements and micro-animations
9. Include relevant placeholder content that fits the theme perfectly
10. Make it production-ready with pixel-perfect design

DESIGN PRINCIPLES TO FOLLOW:
- Use a cohesive color palette (prefer gradients and modern colors)
- Implement proper spacing and typography hierarchy
- Add subtle shadows, rounded corners, and modern UI elements
- Include hover effects and smooth transitions
- Use modern layout techniques (Grid, Flexbox)
- Add loading states and interactive feedback
- Include icons (use Heroicons or similar via CDN)
- Implement modern card designs and sections
- Use appropriate contrast ratios for accessibility
- Add subtle background patterns or gradients

STRUCTURE REQUIREMENTS:
- Navigation bar with smooth scroll links
- Hero section with compelling design and CTAs
- Multiple content sections (features, about, services, testimonials, etc.)
- Contact/CTA section
- Professional footer
- Responsive mobile navigation

TECHNICAL REQUIREMENTS:
- Return ONLY the HTML content for inside the <body> tag
- Do NOT include <!DOCTYPE html>, <html>, <head>, or <body> tags
- Include Tailwind CSS classes for all styling
- Add JavaScript for interactive elements (smooth scrolling, animations, mobile menu)
- Ensure all links and buttons are functional
- Use semantic HTML for better SEO and accessibility

Make this website look like it was designed by a professional agency with attention to:
- Modern UI/UX trends (2024 standards)
- Beautiful typography and spacing
- Engaging animations and interactions
- Professional color schemes and gradients
- Mobile-first responsive design
- Clean, minimalist yet engaging design

The website should be visually impressive and ready for production use.
`

    console.log('Generating content with Gemini...')
    let result, response, generatedCode
    try {
      result = await model.generateContent(enhancedPrompt)
      console.log('Content generation complete')
      response = await result.response
      console.log('Response received')
      generatedCode = response.text()
      console.log('Generated code length:', generatedCode.length)
    } catch (genError) {
      console.error('Error during content generation:', genError)
      return NextResponse.json({ 
        error: 'Failed to generate content',
        details: genError instanceof Error ? genError.message : 'Unknown generation error'
      }, { status: 500 })
    }

    // Clean up the response to ensure it's valid HTML
    let cleanedCode = generatedCode.trim()
    
    // Remove any markdown code block markers
    cleanedCode = cleanedCode.replace(/^```html\n?/, '').replace(/\n?```$/, '')
    cleanedCode = cleanedCode.replace(/^```\n?/, '').replace(/\n?```$/, '')
    
    // Ensure the code doesn't include full HTML document structure
    cleanedCode = cleanedCode.replace(/<!DOCTYPE html>/gi, '')
    cleanedCode = cleanedCode.replace(/<html[^>]*>/gi, '')
    cleanedCode = cleanedCode.replace(/<\/html>/gi, '')
    cleanedCode = cleanedCode.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
    cleanedCode = cleanedCode.replace(/<body[^>]*>/gi, '')
    cleanedCode = cleanedCode.replace(/<\/body>/gi, '')

    console.log('Cleaned code length:', cleanedCode.length)
    console.log('API request successful')

    return NextResponse.json({ 
      code: cleanedCode.trim(),
      prompt: prompt 
    })

  } catch (error) {
    console.error('=== DETAILED ERROR IN GENERATE-WEBSITE API ===')
    console.error('Error type:', typeof error)
    console.error('Error instance:', error)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    // Check if it's a Gemini API specific error
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('Gemini API Error Details:', error)
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate website',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
