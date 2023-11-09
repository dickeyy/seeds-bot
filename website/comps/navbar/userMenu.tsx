import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { FaArrowCircleLeft, FaBars, FaGripVertical, FaQuestionCircle } from "react-icons/fa";
import Avatar from "../avatar";

export default function UserMenu(props: any) {

    const { user } = props

    return (
        <div className="dropdown dropdown-end">
            <label tabIndex={0}>
                <div className="flex flex-row items-center justify-center border-1 border-zinc-600 border p-1 rounded-full 
                    hover:bg-neutral-700 transition-all ease-in-out duration-150 cursor-pointer
                ">
                    <div className="w-10 flex">
                        <Avatar picture={user?.image} />
                    </div>

                    <FaBars className="text-xl text-zinc-300 ml-2 mr-2" />
                </div>
            </label>
            <div className="menu menu-sm dropdown-content mt-3 p-4 shadow bg-base-300 rounded-box w-[20em] z-[99] border border-zinc-800">
                <p className="text-xl flex flex-row font-medium">Hey, <span className="text-xl font-bold text-primary ml-1">{user?.name}</span>
                </p>
                <ul tabIndex={0} className="pl-0 w-full -ml-2 mt-4">
                    {/* <li>
                        <a className="justify-start" href='/dashboard'>
                            <FaGripVertical className="mr-2" />
                            Dashboard
                        </a>
                    </li> */}

                    <li>
                        <a className="justify-start" href="/discord" target="_blank">
                            <FaQuestionCircle className="mr-2" />
                            Need help?
                        </a>
                    </li>
                    
                    <li onClick={(e) => {
                        signOut()
                    }}>
                        <a className="justify-start text-error hover:bg-error/40 hover:text-red-400 ">
                            <FaArrowCircleLeft className="mr-2" />
                            Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}   