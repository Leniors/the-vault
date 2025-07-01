'use client'

import React from 'react'
import { Carousel, Card } from '@/components/ui/apple-cards-carousel'

export default function Events() {
  const cards = events.map((event, index) => (
    <Card key={event.title} card={event} index={index} />
  ))

  return (
    <div className="w-full h-full py-20 text-center bg-black text-white">
      <h2 className="max-w-6xl mx-auto text-3xl md:text-4xl font-bold font-sans mb-12 px-4">
        Upcoming Events at The Vault
      </h2>
      <Carousel items={cards} />
    </div>
  )
}

const EventContent = ({ description }: { description: string }) => (
  <div className="bg-neutral-900 dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-6 shadow-inner">
    <p className="text-neutral-300 dark:text-neutral-400 text-base md:text-lg font-sans max-w-3xl mx-auto text-center">
      {description}
    </p>
  </div>
)

const events = [
  {
    category: 'Live Show',
    title: 'The Vault Nairobi Edition',
    src: '/vaultnairobievent.png',
    content: (
      <EventContent description="Join us for a live podcast session at The Alchemist, featuring surprise guests, fire convos, and exclusive merch." />
    ),
  },
  {
    category: 'Merch Drop',
    title: 'New Merch Drop Party',
    src: '/vaultmerchevent.png',
    content: (
      <EventContent description="Celebrate the latest drop of Vault hoodies, tees, and mugs. Live DJ set, giveaways, and limited editions!" />
    ),
  },
  {
    category: 'Festival',
    title: 'Podcast x Art Festival',
    src: '/vaultartevent.png',
    content: (
      <EventContent description="A creative mashup of podcasts, music, and street art at KICC Rooftop. Don’t miss the vibes." />
    ),
  },
]
