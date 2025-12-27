import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI, GenerateContentResult } from '@google/generative-ai'

export const maxDuration = 30; // Reduced to 30 seconds for better reliability

export async function POST(request: NextRequest) {
  console.log('=== GENERATE WEBSITE API CALLED ===')
  
  try {
    console.log('API Route called - checking environment variables...')
    
    const apiKey = process.env.GEMINI_API_KEY
    console.log('API Key check - exists:', !!apiKey)
    console.log('API Key length:', apiKey ? apiKey.length : 0)
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    let prompt
    try {
      const body = await request.json()
      prompt = body.prompt
      console.log('Received prompt:', prompt?.substring(0, 100) + '...')
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    console.log('Initializing Gemini AI...')
    let genAI, model
    try {
      genAI = new GoogleGenerativeAI(apiKey)
      console.log('GoogleGenerativeAI instance created')
      // Use Gemini 2.5 Flash model (stable version)
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
Create a modern HTML website for: "${prompt}"

REQUIREMENTS:
1. Use Tailwind CSS via CDN for styling
2. Make it fully responsive (mobile-first)
3. Include smooth animations and hover effects
4. Use modern HTML5 semantic elements
5. Add proper meta tags and accessibility
6. Include interactive elements with JavaScript

STRUCTURE:
- Navigation bar with smooth scroll
- Hero section with compelling design
- 2-3 content sections (features/about/services)
- Contact section with CTA
- Professional footer

DESIGN:
- Modern color palette with gradients
- Professional typography (Inter font)
- Subtle shadows and rounded corners
- Hover effects and transitions
- Mobile-responsive navigation
- Loading states and feedback

TECHNICAL:
- Return ONLY the content for inside <body> tag
- Do NOT include DOCTYPE, html, head, or body tags
- Use Tailwind CSS classes for all styling
- Add JavaScript for interactions
- Ensure semantic HTML structure

Make it visually impressive and production-ready with modern 2024 UI/UX standards.
`

    console.log('Generating content with Gemini...')
    let result, response, generatedCode
    
    try {
      // Add timeout handling for Gemini API call
      const genPromise = model.generateContent(enhancedPrompt)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Generation timeout - please try with a simpler prompt')), 25000)
      })
      
      result = await Promise.race([genPromise, timeoutPromise])
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

    return new NextResponse(JSON.stringify({ 
      code: cleanedCode.trim(),
      prompt: prompt 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })

  } catch (error) {
    console.error('=== DETAILED ERROR IN GENERATE-WEBSITE API ===')
    console.error('Error type:', typeof error)
    console.error('Error instance:', error)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    // Check if it's a timeout error
    let errorMessage = 'Failed to generate website'
    let isTimeout = false
    
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        errorMessage = 'Request timed out. Please try with a simpler prompt.'
        isTimeout = true
      } else {
        errorMessage = error.message
      }
    }
    
    // Always return valid JSON with proper headers
    const errorResponse = {
      error: errorMessage,
      isTimeout,
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      suggestion: isTimeout ? 'Try using a shorter, more specific prompt' : 'Please check your input and try again'
    }
    
    return new NextResponse(JSON.stringify(errorResponse), {
      status: isTimeout ? 408 : 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })
  }
}
