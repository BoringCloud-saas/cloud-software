"use client"

import { useEffect, useState } from "react"
 
export default function Navigation() {
    const [signin, setSignIn] = useState(false);

    const handleRedirect = () => {
        window.location.href = "https://5247d8da751e.ngrok.app/signin"
    }

    useEffect(() => {
        if (window.location.href == "https://5247d8da751e.ngrok.app/signin") {
            setSignIn(false)
        } else {
            setSignIn(true)
        }
    }, [])

    return (
        <div className="flex justify-between items-center rounded-md bg-[#fafafa]">
            <div className="flex items-center ml-[10%]">
                <h1 className="text-2xl font-semibold text-[#000000 mr-1">SaaS</h1>
            </div>

            <div className="flex p-2 items-center mr-[10%]">
                <button
                    className="text-xs font-bold
                bg-[#ffffff] p-2 px-4 rounded-md shadow-xl border-2 border-[#e6e6e6] mr-4"
                >Contact</button>
                {signin ? (
                    <button
                    onClick={handleRedirect}
                    className="text-xs font-bold
                    bg-[#ffffff] p-2 px-4 rounded-md shadow-xl border-2 border-[#e6e6e6]"
                    >Get Started</button>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    )
}
