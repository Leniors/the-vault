import Link from 'next/link'
import { FaYoutube, FaInstagram, FaTwitter } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo or Site Name */}
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold tracking-tight">The Vault</h3>
          <p className="text-sm text-gray-400 mt-2">
            © {new Date().getFullYear()} The Vault. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex gap-6 text-sm text-gray-300">
          <Link href="/">Home</Link>
          <Link href="/#products">Products</Link>
          <Link href="/#events">Events</Link>
          <Link href="/#about">About</Link>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube size={24} className="hover:text-red-500 transition" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={24} className="hover:text-pink-500 transition" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter size={24} className="hover:text-blue-400 transition" />
          </a>
        </div>
      </div>
    </footer>
  )
}
