import Image from "next/image";
import { useEffect, useState } from "react";
import { FaDiscord, FaPlus, FaPlusCircle, FaQuestionCircle } from "react-icons/fa";
import DiscordElement from "./discordElement";

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
        <div className="hero min-h-screen overflow-x-hidden xl:-mb-10 lg:mt-0 sm:mb-10 sm:mt-0 mt-20">
			
			<div className="hero-content grid gap-8 sm:grid-cols-1 lg:grid-cols-2 md:grid-cols-2">
				
				<div className='lg:col-span-1'>
                    <div className="leading-10">
                        <span className="sm:text-5xl text-4xl font-bold ">
                            Easy 
                            <span className="text-primary"> moderation </span>
                            for Discord servers of all sizes
                        </span>
                    </div>

					<p className="py-6 text-zinc-400">Seeds is an all-in-one Discord bot for keeping your servers safe, secure, fun, and welcoming for every member. Easily moderate and enforce rules without feeling like your learning rocket science.</p>

                    <div className="flex sm:flex-row flex-col gap-4 w-full">
                        <div className="rounded-full bg-zinc-500/20 text-zinc-300 w-fit h-fit p-2 px-3">
                            <p>🛠️ Easy tools</p> 
                        </div>

                        <div className="rounded-full bg-yellow-700/20 text-[#e3ad73] w-fit h-fit p-2 px-3">
                            <p>🪵 Useful Logs</p> 
                        </div>

                        <div className="rounded-full bg-red-400/20 text-red-300 w-fit h-fit p-2 px-3">
                            <p>🚨 Protect your server</p> 
                        </div>
                    </div>

                    <div className="flex sm:flex-row flex-col gap-4 w-full mt-8">
                        <a className="btn sm:w-[40%] w-full btn-lg btn-primary normal-case" href="/invite">
                            <FaDiscord className="text-md" /> Add to Discord
                        </a>
                        <a className="btn sm:w-[40%] w-full btn-lg btn-neutral normal-case" href="/discord">
                            <FaQuestionCircle className="text-md" /> Need help?
                        </a>
                    </div>

				</div>

				<div className="sm:flex hidden col-span-1 flex-col justify-center items-center ml-6 h-full">
                    {/* <Image src={`/images/webp/logo.webp`} alt="Seeds Logo" width={300} height={300} /> */}
                    <DiscordElement />
				</div>
			</div>
		</div>
    )
}