import Image from "next/image";
import { FaDiscord, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
    return (
        <>
            <footer className="footer p-10 bg-base-200 text-base-content w-screen">
                <aside>
                    <Image src="/images/webp/logo.webp" width={50} height={50} alt="Seeds Logo" />
                    <div className="w-3/4">
                        <p>Making Discord safer, one server at a time.</p>
                    </div>
                </aside> 
                <nav>
                    <header className="footer-title">Seeds</header> 
                    <a className="link link-hover">Commands</a> 
                    <a className="link link-hover">Premium</a> 
                    <a className="link link-hover">Status</a> 
                    <a className="link link-hover">Blog</a>
                </nav>  
                <nav>
                    <header className="footer-title">Support</header> 
                    <a className="link link-hover">Documentation</a> 
                    <a className="link link-hover">Commands</a> 
                    <a className="link link-hover">Support Server</a> 
                    <a className="link link-hover">Contact Us</a>
                </nav>  
                <nav>
                    <header className="footer-title">Legal</header> 
                    <a className="link link-hover">Terms of use</a> 
                    <a className="link link-hover">Privacy policy</a> 
                    <a className="link link-hover">Cookie policy</a>
                </nav>
            </footer>
            <footer className="footer px-10 py-4 bg-base-200 text-base-content w-screen">
                <aside className="items-center grid-flow-col justify-center">
                    <div className="flex flex-col ml-2 justify-center">
                        
                        <p>Copyright © 2023 Object LLC.</p>
                    </div>
                </aside> 
                <nav className="md:place-self-center md:justify-self-end">

                    <div className="grid grid-flow-col w-full gap-4">
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