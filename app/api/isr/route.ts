import { NextResponse } from 'next/server'

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const data = Array.from({ length: 10 }, (_, i) => ({
    time: new Date(Date.now() - (9 - i) * 60000).toISOString().substr(11, 8),
    transactions: Math.floor(Math.random() * 100)
  }))

  return NextResponse.json(data)
}

export const revalidate = 0 // Disable caching

