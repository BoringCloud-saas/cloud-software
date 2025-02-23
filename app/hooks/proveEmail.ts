"use client"

import axios from "axios"

const useEmail = () => {
    const proveEmail = async (ID: string) => {
        try {
            const response = await axios.post("https://85fa1bc9fb46.ngrok.app/api/email", {
                historyID: ID,
            })
            console.log(response.data)
            return response
        } catch (err) {
            console.error("auth hook catch err: ", err)
        }
    }

    return { proveEmail }
}

export default useEmail
