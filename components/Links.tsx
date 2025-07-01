'use client'

import {
  FaYoutube,
  FaSpotify,
  FaTiktok,
  FaInstagram,
  FaApple,
  FaPatreon,
} from 'react-icons/fa'

const platforms = [
  {
    name: 'YouTube',
    href: 'https://youtube.com/@thevault',
    icon: <FaYoutube className="text-red-600" />,
  },
  {
    name: 'Spotify',
    href: 'https://spotify.com/show/thevault',
    icon: <FaSpotify className="text-green-500" />,
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com/@thevault',
    icon: <FaTiktok className="text-white dark:text-white" />,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/thevault',
    icon: <FaInstagram className="text-pink-500" />,
  },
  {
    name: 'Apple Podcasts',
    href: 'https://podcasts.apple.com/thevault',
    icon: <FaApple className="text-white dark:text-white" />,
  },
  {
    name: 'Patreon',
    href: 'https://patreon.com/thevault',
    icon: <FaPatreon className="text-orange-500" />,
  },
]

export default function Links() {
  return (
    <section className="py-16 bg-black text-white text-center">
      <h2 className="text-3xl md:text-2xl font-bold mb-10">Find us on</h2>

      <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto px-3">
        {platforms.map(({ name, href, icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Find us on ${name}`}
            className="flex flex-col items-center space-y-2 hover:scale-110 transition-transform duration-200"
          >
            <div className="text-2xl">{icon}</div>
            <span className="text-xsm text-white">{name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
