import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const maxDuration = 60;

export async function GET() {
  try {
    console.log('=== TESTING GEMINI API ===')
    
    const apiKey = process.env.GEMINI_API_KEY
    console.log('API Key check - exists:', !!apiKey)
    console.log('API Key length:', apiKey ? apiKey.length : 0)
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'GEMINI_API_KEY not found',
        env_keys: Object.keys(process.env).filter(key => key.includes('GEMINI'))
      }, { status: 500 })
    }
    
  // Test simple API call using Gemini 2.5 Flash
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const result = await model.generateContent('Say "Hello World" in HTML')
    const response = await result.response
    const text = response.text()
    
    return NextResponse.json({ 
      success: true,
      apiKeyLength: apiKey.length,
      testResponse: text.substring(0, 200)
    })
    
  } catch (error) {
    console.error('Gemini test error:', error)
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
