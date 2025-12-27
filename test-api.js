#!/usr/bin/env node

// Simple test script to verify the API works locally
const testAPI = async () => {
  try {
    console.log('Testing local API...')
    
    const response = await fetch('http://localhost:3000/api/generate-website', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: 'Create a simple landing page for a coffee shop' 
      }),
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    const responseText = await response.text()
    console.log('Raw response length:', responseText.length)
    console.log('Raw response preview:', responseText.substring(0, 200))
    
    try {
      const data = JSON.parse(responseText)
      console.log('✅ JSON parsing successful!')
      console.log('Response keys:', Object.keys(data))
      if (data.code) {
        console.log('✅ Generated code length:', data.code.length)
      } else {
        console.log('❌ No code in response')
      }
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError.message)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testAPI()
