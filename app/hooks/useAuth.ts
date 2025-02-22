"use client"

import axios from "axios"
import { useState } from "react"

const useAuth = () => {
    const [status, setStatus] = useState<number | null>(null)

    const proveAuth = async () => {
        try {
            const response = await axios.post("https://5247d8da751e.ngrok.app/google/proveAuth")
            return response
        } catch (err) {
            window.location.href = "https://5247d8da751e.ngrok.app/signin"
            console.error("auth hook catch err: ", err)
        }
    }

    return { proveAuth, status }
}

export default useAuth