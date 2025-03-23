"use client"

import { useMemo, useState } from "react"
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"

interface HomeMemoriesProps {
  searchQuery: string
  selectedLocations: number[]
}

interface memoryType {
  id: number
  title: string
  subtitle: string
  count: number
  created_at: Date
  image_url: string
  locationId?: number // Added locationId for filtering by location
}

// Sample data for demonstration
const getImageSource = (path: string) => {
  try {
    switch (path) {
      case "outdoor-boys":
        return require("../assets/outdoor-boys.jpg")
      case "family-sunset":
        return require("../assets/family-sunset.jpg")
      case "office-chat":
        return require("../assets/office-chat.jpg")
      case "jessica":
        return require("../assets/jessica.jpg")
      default:
        console.warn("Image not found for path:", path)
        return null // Avoid returning undefined
    }
  } catch (error) {
    console.error("Error loading image:", error)
    return null
  }
}

const memoryData: memoryType[] = [
  {
    id: 1,
    title: "Outdoor Boys",
    subtitle: "Free time after Midterm",
    count: 50,
    // 8 days ago (should show up in This Month)
    created_at: new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000),
    image_url: "outdoor-boys",
    locationId: 1, // Toronto
  },
  {
    id: 2,
    title: "Family Sunset",
    subtitle: "Lovely family reunion",
    count: 67,
    // 2 days ago (should show up in This Week and This Month)
    created_at: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
    image_url: "family-sunset",
    locationId: 2, // New York
  },
  {
    id: 3,
    title: "Office Chat",
    subtitle: "Team meeting vibes",
    count: 10,
    // 35 days ago (likely not in current week and depending on the month, may or may not be in current month)
    created_at: new Date(new Date().getTime() - 35 * 24 * 60 * 60 * 1000),
    image_url: "office-chat",
    locationId: 3, // Tokyo
  },
]

// Middle Section Component
const HomeMemories = ({ searchQuery, selectedLocations }: HomeMemoriesProps) => {
  const [selectedTab, setSelectedTab] = useState("All Memories")

  const TABS = ["All Memories", "This Week", "This Month"]

  // Calculate filtered memories based on the selected tab, search query, and selected locations
  const filteredData = useMemo(() => {
    // First filter by time period
    let timeFilteredData = memoryData

    if (selectedTab === "This Week") {
      // Assuming week starts on Sunday. Find start of week.
      const currentDate = new Date()
      const startOfWeek = new Date(currentDate)
      startOfWeek.setHours(0, 0, 0, 0)
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
      timeFilteredData = memoryData.filter((memory) => memory.created_at >= startOfWeek)
    } else if (selectedTab === "This Month") {
      const currentDate = new Date()
      timeFilteredData = memoryData.filter((memory) => {
        return (
          memory.created_at.getMonth() === currentDate.getMonth() &&
          memory.created_at.getFullYear() === currentDate.getFullYear()
        )
      })
    }

    // Then filter by search query
    let searchFilteredData = timeFilteredData
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      searchFilteredData = timeFilteredData.filter(
        (memory) => memory.title.toLowerCase().includes(query) || memory.subtitle.toLowerCase().includes(query),
      )
    }

    // Finally filter by selected locations
    if (selectedLocations.length > 0) {
      return searchFilteredData.filter((memory) =>
        memory.locationId ? selectedLocations.includes(memory.locationId) : false,
      )
    }

    return searchFilteredData
  }, [selectedTab, searchQuery, selectedLocations])

  const renderCard = ({ item }: { item: memoryType }) => {
    return (
      <View className="w-[48%] bg-white rounded-lg overflow-hidden mb-4 relative shadow">
        {/* Image Section */}
        <View className="relative">
          <Image source={getImageSource(item.image_url)} className="w-full h-32" resizeMode="cover" />
          {/* Count bubble */}
          <View className="absolute top-2 right-2 bg-white rounded-full px-2 py-1">
            <Text className="text-black text-xs">{item.count}</Text>
          </View>
        </View>

        {/* Text Section */}
        <View className="p-2">
          <Text className="font-bold text-base">{item.title}</Text>
          <Text className="text-gray-500 text-xs">{item.subtitle}</Text>
        </View>

        {/* Plus Button (floating at bottom-right) */}
        <TouchableOpacity className="absolute bottom-2 right-2 bg-pink-500 rounded-full p-2">
          <Ionicons name="add" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    )
  }

  // Display a message when no results are found
  const renderEmptyList = () => (
    <View className="flex-1 justify-center items-center py-10">
      <Ionicons name="search-outline" size={48} color="#ccc" />
      <Text className="text-gray-500 mt-4 text-center">No memories found for "{searchQuery}"</Text>
      <Text className="text-gray-400 text-center mt-2">Try adjusting your search or filters</Text>
    </View>
  )

  return (
    <View className="flex-1 bg-white px-4 pt-4 pb-2">
      {/* Tab Row */}
      <View className="flex-row mb-4">
        {TABS.map((tab) => {
          const isActive = tab === selectedTab
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              className={`rounded-full px-4 py-2 mr-2 ${isActive ? "bg-pink-500" : "bg-gray-200"}`}
            >
              <Text className={isActive ? "text-white" : "text-black"}>{tab}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Grid of Cards */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={renderCard}
        ListEmptyComponent={renderEmptyList}
        className="mt-4"
      />
    </View>
  )
}

export default HomeMemories

