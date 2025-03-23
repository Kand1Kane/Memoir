"use client"

import { useState } from "react"
import HomeMemories from "components/HomeMemories"
import TopHomeHeader from "components/TopHomeHeader"

export const HomePage = () => {
  // Lift state up to the parent component
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocations, setSelectedLocations] = useState<number[]>([])

  // Handle search query changes
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Handle location selection changes
  const handleLocationChange = (locations: number[]) => {
    setSelectedLocations(locations)
  }

  return (
    <>
      <TopHomeHeader
        onSearch={handleSearch}
        selectedLocations={selectedLocations}
        onLocationChange={handleLocationChange}
      />
      <HomeMemories searchQuery={searchQuery} selectedLocations={selectedLocations} />
    </>
  )
}

