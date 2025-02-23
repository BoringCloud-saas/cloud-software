"use client"

import { useState, useEffect } from "react"

import Navigation from "./components/Navigation"

import useAuth from "../hooks/useAuth"
import useGmail from "../hooks/watchRequest"
import useEmail from "../hooks/proveEmail"

export default function Page() {
  // custom hooks
  const { proveAuth } = useAuth()
  const { watchRequest } = useGmail()
  const { proveEmail } = useEmail()

  // Setze den initialen Wert auf "username" als Platzhalter
  const [username, setUsername] = useState("username")

  useEffect(() => {
      const fetchAuth = async () => {
        const response = await proveAuth()
        const name = response?.data?.name
        if (typeof name === "string") {
          setUsername(name)

        }
      }
      fetchAuth()
  }, [])

  useEffect(() => {
    const createEventSource = () => {
        const eventSource = new EventSource("/api")

        eventSource.onopen = () => {
          console.log("Verbindung geöffnet");
        };

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);  // Parsen der JSON-Daten
          console.log(data.historyID);
          let ID: string | null = null;

          if (data && data.historyID) {
            ID = String(data.historyID);
          }

          if (ID !== null) {
            const fetch = async () => {
              const response = await proveEmail(ID);
            }
            fetch()
          }
        }

        eventSource.onerror = () => {
          console.error("Verbindung fehlgeschlagen");
          eventSource.close();  // Schließe die Verbindung bei Fehler
  
          // Versuche, die Verbindung nach 5 Sekunden wieder aufzubauen
          setTimeout(createEventSource, 5000);  // Wiederverbindung nach 5 Sekunden
        };

        return eventSource;
    }

    const eventSource = createEventSource();

    return () => {
      eventSource.close();  // Schließe die Verbindung, wenn die Komponente unmountet
    };
  }, [])

  useEffect(() => {
    const fetchAuth = async () => {
      const response = await watchRequest()
    }
    fetchAuth()
  }, [])

  return (
    <div className="flex flex-col h-screen w-full p-4 bg-[#fafafa]">
      <Navigation name={username} />
    </div>
  )
}
