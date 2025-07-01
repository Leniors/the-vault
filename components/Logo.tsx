import Link from 'next/link'
import React from 'react'

const Logo = () => {
  return (
    <div className='fixed top-5 right-5 z-50 flex gap-4 items-center'>
        <Link href="/" className="flex items-center justify-center mb-4">
        <img
            src="/vaultlogo.png"
            alt="The Vault Logo"
            className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full shadow-lg"
        />
        </Link>
    </div>
  )
}

export default Logo