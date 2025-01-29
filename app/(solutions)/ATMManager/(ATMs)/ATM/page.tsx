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
      
      {/* <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">ATM Cassettes</h2>
        <ATMCassettes />
      </div> */}

      <div className="mb-8">
        <Suspense fallback={<div>Loading ATM data...</div>}>
          <ATMTable />
        </Suspense>
      </div>

      {/* <div className="mb-8">
        <Suspense fallback={<div>Loading ATM data...</div>}>
          <ATMHeatMap />
        </Suspense>
      </div> */}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Suspense fallback={<div>Loading ISR chart...</div>}>
            <ISRChart />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<div>Loading SSE chart...</div>}>
            <SSEChart />
          </Suspense>
        </div>
      </div> */}
    </div>
  )
}

