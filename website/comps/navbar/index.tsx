import Image from "next/image";
import { FaBars, FaCrown, FaDiscord, FaPlus, FaPlusCircle } from "react-icons/fa";
import { AiFillGift } from "react-icons/ai";

export default function Navbar() {
    return (
        <div className="navbar rounded-lg fixed top-2 backdrop-blur-lg bg-transparent lg:px-10 px-2">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <FaBars className="text-2xl" />
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
                        <li><a href="/commands">Commands</a></li>
                        <li>
                        <a>Resources</a>
                        <ul className="p-2">
                            <li><a href="https://docs.seedsbot.xyz" target="_blank">Documentation</a></li>
                            <li><a href="/support">Support Server</a></li>
                        </ul>
                        </li>
                        <li className="text-primary font-bold"><a href="/invite">
                            <FaPlusCircle className="text-md" />
                            Invite
                        </a></li>
                    </ul>
                </div>
                <a className="btn btn-ghost normal-case text-xl font-bold" href="/">
                    <Image src="/images/webp/logo.webp" alt="Logo" width={32} height={32} />
                    Seeds
                </a>

                <ul className="menu menu-horizontal hidden lg:flex px-1 text-zinc-300">
                    <li><a href="/commands">Commands</a></li>
                    <li tabIndex={0}>
                        <details>
                        <summary>Resources</summary>
                        <ul className="p-2  bg-base-200">
                            <li><a href="https://docs.seedsbot.xyz" target="_blank">Documentation</a></li>
                            <li><a href="/support">Support Server</a></li>
                        </ul>
                        </details>
                    </li>
                    <li className="text-primary font-bold"><a href="/invite">
                        <FaPlusCircle className="text-md" />
                        Invite
                    </a></li>
                </ul>
            </div>
            <div className="navbar-start hidden lg:flex">
                
            </div>
            <div className="navbar-end gap-4">
                <a className="btn btn-ghost text-yellow-300 bg-yellow-300/20 justify-center items-center hover:bg-yellow-300/10 normal-case"
                    href="/premium"
                >
                    <FaCrown className="text-2xl" />
                    Premium
                </a>
                <a className="btn btn-ghost justify-center items-center normal-case"
                    href="/login"
                >
                    <FaDiscord className="text-2xl" />
                    Log In
                </a>
            </div>
        </div>
    )
}   