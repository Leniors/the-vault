'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) return
    // TODO: Add API/Appwrite logic here
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section className="bg-black text-white py-15 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Stay in the Loop
        </h2>
        <p className="text-gray-400 mb-8">
          Subscribe to The Vault newsletter for episode drops, merch updates, and exclusive content.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <div className="w-full sm:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-600 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-gray-200 transition"
            >
              Subscribe
            </button>
          </form>
        ) : (
          <p className="text-green-400 font-medium mt-4">
            ✅ Thanks for subscribing! You&apos;re officially part of the vault.
          </p>
        )}
      </div>
    </section>
  )
}
