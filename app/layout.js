import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '../components/SessionProvider'
import { getServerSession } from 'next-auth'
import "@uploadthing/react/styles.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "/app/api/uploadthing/core";


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ecommerce Website',
  description: 'Number One Site For Products',
}
const routerConfig = extractRouterConfig(ourFileRouter);

export default async function RootLayout({ children}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextSSRPlugin routerConfig={routerConfig} />
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
