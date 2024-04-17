"use client"

import AdminLayout from "@/components/AdminLayout"
import { useSession } from "next-auth/react"

export default function Home() {
  const {data:session} = useSession();

  return <AdminLayout>
    <div className="text-blue-900 flex justify-between">
      <h2>
        hello, <b>{session?.user?.name}</b>
      </h2>
      <div className="flex bg-gray-200 text-black gap-1 rounded-lg">
        <img src={session?.user?.image} alt="img" className="w-6 h-6"/>
        <span className="px-2">
          {session?.user?.name}
        </span>
      </div>
    </div>
  </AdminLayout>
}
