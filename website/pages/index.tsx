import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '@/comps/navbar'
import SEOHead from '@/comps/seoHead'
import HomeHero from '@/comps/hero/home'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  	return (
    	<main
      		className={`flex min-h-screen flex-col text-white items-center justify-between sm:px-10 px-2 ${inter.className}`}
			data-theme="primary"
    	>	

			<SEOHead title="Seeds Discord Bot" />
			<Navbar />
			<HomeHero />

    	</main>
  	)
}
