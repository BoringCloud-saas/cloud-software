"use client"

import { FaGoogle } from "react-icons/fa"
import Navigation from "../components/Navigation";

export default function page() {
    const handleRedirect = () => {
        window.location.href = 'https://898893017090.ngrok.app/google'; // Weiterleitung zur externen URL
    };

    return (
        <div className="flex flex-col h-screen w-full bg-[#fafafa]">
          {/* Navigation */}
          <Navigation />
    
          {/* Sign-In Content */}
          <div className="flex flex-1 justify-center items-center">
            <div className="flex flex-col justify-center items-center w-1/4 h-1/6 p-4 rounded-xl">
              <div className="flex justify-center items-center w-full">
                <h1 className="text-4xl font-bold text-[#000000]">Log in to SaaS</h1>
              </div>
              <div
                onClick={handleRedirect}
                className="cursor-pointer flex items-center justify-center w-5/6 p-4 bg-[#000000] shadow-2xl rounded-xl mt-4"
              >
                <FaGoogle className="text-[#F7F7F7]" />
                <span className="font-bold ml-4 text-[#F7F7F7]">Continue with Google</span>
              </div>
              <div className="flex items-center justify-between w-5/6 mt-3">
                <span className="font-bold">Terms & Service</span>
                <span className="font-bold">Our Policy</span>
              </div>
            </div>
          </div>
        </div>
      );
}
