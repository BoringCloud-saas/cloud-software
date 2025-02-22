"use client"

import axios from "axios"
import { useState } from "react"

const useAuth = () => {
    const [status, setStatus] = useState<number | null>(null)

    const proveAuth = async () => {
        try {
            const response = await axios.post("https://85fa1bc9fb46.ngrok.app/google/proveAuth")
            return response
        } catch (err) {
            window.location.href = "https://85fa1bc9fb46.ngrok.app/signin"
            console.error("auth hook catch err: ", err)
        }
    }

    return { proveAuth, status }
}

export default useAuth