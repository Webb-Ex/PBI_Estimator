"use client"

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartSkeleton } from './chart-skeleton'

const fetchData = async () => {
  const res = await fetch('/api/isr', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch data')
  return res.json()
}

export default function ISRChart() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const newData = await fetchData()
        setData(newData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching ISR data:', error)
      }
    }

    loadData()
    const interval = setInterval(loadData, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return <ChartSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ISR (Incremental Static Regeneration)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="transactions" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

