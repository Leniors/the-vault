import Link from 'next/link'
import React from 'react'

const Logo = () => {
  return (
    <div className='fixed top-5 left-5 z-50 flex gap-4 items-center'>
        <Link href="/" className="flex items-center justify-center">
        <img
            src="/thevaultlogo.png"
            alt="The Vault Logo"
            className="w-12 h-12 md:w-40 md:h-40 object-cover rounded-full shadow-lg"
        />
        </Link>
    </div>
  )
}

export default Logo