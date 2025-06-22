'use client'
import { useState } from 'react'

export default function PoemGenerator() {
  const [poem, setPoem] = useState('')
  const [loading, setLoading] = useState(false)

  const generatePoem = async () => {
    setLoading(true)
    setPoem('')
    
    try {
      const response = await fetch('http://localhost:8000/generate-poem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: 'nature' })
      })

      if (!response.ok) {
        throw new Error('Failed to generate poem')
      }
      
      const data = await response.json()
      
      if (data.error) {
        setPoem('Sorry, there was an error generating the poem. Please try again.')
      } else {
        setPoem(data.poem)
      }
    } catch (error) {
      console.error('Error:', error)
      setPoem('Sorry, could not connect to the poem generator. Make sure your backend is running!')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ✨ AI Poem Generator
          </h1>
          <p className="text-gray-600">
            Click the button below to generate a beautiful poem
          </p>
        </div>
        
        <div className="space-y-6">
          <button
            onClick={generatePoem}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Your Poem...</span>
              </div>
            ) : (
              'Generate Poem ✨'
            )}
          </button>
          
          {poem && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                📝 Your Poem
              </h2>
              <div className="prose prose-purple max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                  {poem}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
