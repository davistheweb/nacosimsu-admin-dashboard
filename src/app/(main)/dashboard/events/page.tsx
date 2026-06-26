'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EventList } from '@/components/events/event-list'
import { ROUTES } from '@/lib/constants'

export default function EventsPage() {
  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Manage your events and registrations</p>
        </div>
        <Link href={ROUTES.CREATE_EVENT}>
          <Button className="mt-4 md:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      <EventList />
    </div>
  )
}
