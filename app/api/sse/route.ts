import { NextResponse } from 'next/server'

export async function GET() {
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      while (true) {
        const data = {
          time: new Date().toISOString().substr(11, 8),
          transactions: Math.floor(Math.random() * 100)
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  })

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}

