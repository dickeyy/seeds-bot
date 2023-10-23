import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomeHero() {

    const imageOptions = [
        "purge",
        "ban",
        "lockdown",
        "cases",
        "logs",
    ]
    const [image, setImage] = useState(imageOptions[0])

    useEffect(() => {
        const random = Math.floor(Math.random() * imageOptions.length)
        setImage(imageOptions[random])
    }, [])

    return (
        <div className="hero min-h-screen overflow-x-hidden -mt-52">
			
			<div className="hero-content grid sm:grid-cols-5 grid-cols-1 gap-4 w-full justify-center items-center">
				
				<div className='sm:col-span-2'>
					<span className="text-5xl font-bold">
                        Easy 
                        <span className="text-primary"> moderation </span>
                        for 
						<span className="text-primary"> Discord </span>
					    servers of all size
                    </span>

					<p className="py-6 text-zinc-300">Seeds is an all-in-one Discord bot for keeping your servers safe, secure, and fun for all.</p>

				</div>

				<div className="sm:flex hidden col-span-3 flex-col justify-center items-center ml-10">
                    <img src={`/images/png/seeds-website-${image}-showcase.png`} alt="Hero" className="w-full rounded-lg" />
				</div>
			</div>
		</div>
    )
}