"use client"

import { Suspense } from 'react'
import PBITable from '@/components/pbi-table'


export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">PBI Management Dashboard</h1>
      
      <div className="mb-8">
        <Suspense fallback={<div>Loading PBIs...</div>}>
          <PBITable />
        </Suspense>
      </div>

      
    </div>
  )
}

