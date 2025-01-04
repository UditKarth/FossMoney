'use client'

import { useEffect } from 'react'
import { Card } from "@/components/ui/card"

export default function JPMorganAuth() {
  useEffect(() => {
    // Here you would typically:
    // 1. Get the OAuth URL from your backend
    // 2. Redirect to JPMorgan's OAuth page
    // For demo purposes, we'll just log a message
    console.log('Initiating JPMorgan Chase authentication...')
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <Card className="bg-zinc-900 border-zinc-800 p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connecting to JPMorgan Chase</h1>
          <p className="text-gray-400 mb-4">Please wait while we redirect you to securely connect your account...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white mx-auto"></div>
        </div>
      </Card>
    </div>
  )
}

