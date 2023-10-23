import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '@/comps/navbar'
import SEOHead from '@/comps/seoHead'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  	return (
    	<main
      		className={`flex min-h-screen flex-col text-white items-center justify-between p-24 ${inter.className}`}
			data-theme="primary"
    	>	

			<SEOHead title="Seeds Discord Bot" />
			<Navbar />

    	</main>
  	)
}
