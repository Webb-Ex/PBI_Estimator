"use client"

import { Suspense } from 'react'
import ATMTable from "@/components/atm-table"
import ISRChart from "@/components/isr-chart"
import SSEChart from "@/components/sse-chart"
import { ATMCassettes } from '@/components/atm-cassettes'
import ATMHeatMap from '@/components/atm-heatmap'

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">ATM Management Dashboard</h1>
      
      <div className="mb-8">
        <Suspense fallback={<div>Loading PBI data...</div>}>
          <ATMTable />
        </Suspense>
      </div>

      
    </div>
  )
}

