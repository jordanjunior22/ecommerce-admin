"use client"
import Nav from '@/components/Nav';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({children}) {

  const { data: session } = useSession();
  const [showNav, setShowNav] = useState(false);
  if (!session) {
    return (    
    <div className="bg-gray-200 w-screen h-screen flex items-center">
      <div className="text-center w-full">
        <button onClick={() => signIn('google')} className="bg-white p-2 rounded-lg">
          Login with Google
        </button>
      </div>
  </div>)
  }

  return (
    <div className='bg-gray-100 min-h-screen'>
      
      <div className='menu-icon'>
        <button onClick={()=> setShowNav(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
          </svg>
        </button>

      </div>

      <div className='flex'>
        <Nav show={showNav}/>
        <div className='flex-grow p-4'>{children}</div>
      </div>
    </div>

    
  );
}
