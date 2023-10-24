import SEOHead from "@/comps/seoHead";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Page() {

    const redirectPage = "https://discord.gg/hUsR6fRYyE"
    const router = useRouter()

    useEffect(() => {
        router.push(redirectPage)
    }, [router])

    return (
        <main
			className={`flex min-h-screen flex-col justify-center items-center px-10`}
	  		data-theme="dracula"
  		>	
	  		<SEOHead title="Join the Seeds support server" />

            <div className="justify-center items-end w-full flex ">
                <h1 className="text-2xl text-center font-medium">Redirecting</h1>
                <span className="loading loading-dots loading-xs text-primary ml-1"></span>
            </div>


            <div className="bg-base-200 text-zinc-500 rounded-md p-2 mt-4 max-w-md overflow-hidden text-ellipsis whitespace-nowrap">
                <a href={redirectPage} className="link link-hover">{redirectPage}</a>
            </div>
            <p className="text-zinc-600 italic text-sm">Click the link above if nothing happens</p>

        </main>
    )
}