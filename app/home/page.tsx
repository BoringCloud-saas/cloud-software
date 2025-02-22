"use client"

import { useState, useEffect } from "react"
import Navigation from "./components/Navigation"
import useAuth from "../hooks/useAuth"

export default function Page() {
  const { proveAuth } = useAuth()

  // Setze den initialen Wert auf "username" als Platzhalter
  const [username, setUsername] = useState("username")

  useEffect(() => {
      const fetchAuth = async () => {
        const response = await proveAuth()
        const name = response?.data?.name
        if (typeof name === "string") {
          setUsername(name)
          localStorage.setItem("username", name) // Speichern im LocalStorage
        }
      }
      fetchAuth()
  }, [])

  

  return (
    <div className="flex flex-col h-screen w-full p-4 bg-[#fafafa]">
      <Navigation name={username} />
    </div>
  )
}
