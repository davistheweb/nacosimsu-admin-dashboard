'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EventForm } from '@/components/events/event-form'
import { ROUTES } from '@/lib/constants'

export default function CreateEventPage() {
  return (
    <div className="space-y-8 p-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href={ROUTES.EVENTS}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create Event</h1>
      </div>

      <div className="rounded-lg border border-border bg-card p-8">
        <EventForm />
      </div>
    </div>
  )
}
