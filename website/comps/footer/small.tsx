import { FaDiscord, FaInstagram, FaTwitter } from "react-icons/fa";
import Image from "next/image";

export default function SmallFooter(props:any) {
    return (
        <>
            <footer className="footer py-6 text-base-content border-t-2 border-neutral">
                <aside className="items-center grid-flow-col justify-center">
                    <Image src="/images/webp/logo.webp" width={30} height={30} alt="Seeds Logo" />
                    <div className="flex flex-col ml-2 justify-center">
                        <p>© 2023 Object LLC.</p>
                    </div>
                </aside> 
                <nav className="md:place-self-center md:justify-self-end">
                    <div className="grid grid-flow-col gap-4">

                        <a className="cursor-pointer hover:text-zinc-400 transition-all ease-in-out duration-150 text-2xl"
                            href="/discord" target="_blank"
                        >
                            <FaDiscord />
                        </a> 

                    </div>
                </nav>
            </footer>
        </>
    )
}