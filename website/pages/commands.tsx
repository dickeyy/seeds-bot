import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '@/comps/navbar'
import SEOHead from '@/comps/seoHead'
import HomeHero from '@/comps/hero/home'
import Commands from '@/comps/commands'
import Footer from '@/comps/footer'
import SmallFooter from '@/comps/footer/small'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  	return (
    	<main
      		className={`flex min-h-screen flex-col text-white items-center justify-between sm:px-10 px-2 ${inter.className}`}
            data-theme="primary"
    	>	

            <SEOHead title="Seeds Discord Bot Commands" />
            <Navbar />
            
            <div className='flex flex-col items-start justify-center mt-28 w-full lg:px-10 px-2 mb-10'>
                <h1 className='sm:text-6xl text-4xl font-bold'>Commands</h1>
                <p className='sm:text-xl text-md font-normal text-zinc-400 mt-2'>Here you can find a comprehensive list of all of Seeds&rsquo; commands, as well as how to use them!</p>
                
                <div className='flex flex-col sm:text-md text-sm font-normal mb-8'>
                    <p className=' text-zinc-400 mt-6'>Parameter Structure:</p>
                    <span className='text-green-400'>{"<"}required parameter{">"} <span className='text-pink-400'>[optional parameter]</span> </span> 
                </div>

                <Commands />
            </div>

            <Footer />
            {/* <SmallFooter /> */}
			

    	</main>
  	)
}
