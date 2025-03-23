"use client"

import { useRef } from "react"
import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { Modal, ScrollView, Pressable } from "react-native"

interface TopHomeHeaderProps {
  onSearch: (query: string) => void
  selectedLocations: number[]
  onLocationChange: (locations: number[]) => void
}

const cityCountryOptions = [
  { id: 1, label: "Toronto, Canada" },
  { id: 2, label: "New York, USA" },
  { id: 3, label: "Tokyo, Japan" },
  { id: 4, label: "Berlin, Germany" },
  { id: 5, label: "Sydney, Australia" },
]

const TopHomeHeader = ({ onSearch, selectedLocations, onLocationChange }: TopHomeHeaderProps) => {
  const inputRef = useRef<TextInput>(null)
  const [searchText, setSearchText] = useState("")

  // State for multi-select dropdown
  const [modalVisible, setModalVisible] = useState(false)

  // Toggle selection of a city/country
  const toggleLocation = (id: number) => {
    let newLocations
    if (selectedLocations.includes(id)) {
      newLocations = selectedLocations.filter((locId) => locId !== id)
    } else {
      newLocations = [...selectedLocations, id]
    }
    onLocationChange(newLocations)
  }

  // Close modal and handle any post-selection logic here
  const handleConfirm = () => {
    setModalVisible(false)
  }

  // For displaying selected labels in the header
  const getSelectedLabels = () => {
    const labels = cityCountryOptions
      .filter((option) => selectedLocations.includes(option.id))
      .map((option) => option.label)
    return labels.length > 0 ? labels.join(", ") : "Select location(s)"
  }

  // Handle search input changes
  const handleSearchChange = (text: string) => {
    setSearchText(text)
    onSearch(text)
  }

  return (
    <View>
      {/* Black Header Section */}
      <View className="bg-black px-4 pt-10 pb-6">
        {/* Location + Dropdown Row */}
        <View className="mt-4 flex-col justify-between items-start mb-4">
          <Text className="text-white text-xs">Location</Text>
          <TouchableOpacity className="flex-row items-center" onPress={() => setModalVisible(true)}>
            <Text className="text-white text-base mr-1">{getSelectedLabels()}</Text>
            <Ionicons name="chevron-down" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search + Filter Row */}
        <View className="flex-row items-center">
          {/* Search Bar */}
          <View className="flex-1 flex-row items-center bg-gray-800 rounded-full px-3 py-2 mr-2">
            <Ionicons
              name="search"
              size={16}
              color="#ccc"
              className="m-1"
              onPress={() => {
                inputRef?.current?.focus()
              }}
            />
            <TextInput
              ref={inputRef}
              value={searchText}
              onChangeText={handleSearchChange}
              placeholder="Search Memories"
              placeholderTextColor="#ccc"
              className="flex-1 pt-0 p-2 text-lg text-white"
            />
            {searchText ? (
              <TouchableOpacity onPress={() => handleSearchChange("")}>
                <Ionicons name="close-circle" size={16} color="#ccc" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Filter Button */}
          <TouchableOpacity className="bg-pink-500 p-3 rounded-full">
            <Ionicons name="options" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for multi-select dropdown */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        {/* Wrap entire backdrop in a Pressable */}
        <Pressable onPress={() => setModalVisible(false)} className="flex-1 bg-black bg-opacity-50 justify-end">
          {/* Inner Pressable to prevent closing the modal when tapping on content */}
          <Pressable onPress={(e) => e.stopPropagation()} className="bg-white rounded-t-2xl p-4">
            <Text className="text-lg font-bold mb-4">Select Cities</Text>

            <ScrollView style={{ maxHeight: 300 }}>
              {cityCountryOptions.map((option) => {
                const isSelected = selectedLocations.includes(option.id)
                return (
                  <Pressable
                    key={option.id}
                    onPress={() => toggleLocation(option.id)}
                    className="flex-row items-center mb-3"
                  >
                    {/* Simple check icon to indicate selection */}
                    <Ionicons
                      name={isSelected ? "checkbox" : "square-outline"}
                      size={24}
                      color={isSelected ? "#3B82F6" : "#999"}
                      style={{ marginRight: 8 }}
                    />
                    <Text>{option.label}</Text>
                  </Pressable>
                )
              })}
            </ScrollView>

            {/* Action buttons */}
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity className="mr-4" onPress={() => setModalVisible(false)}>
                <Text className="text-red-500">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm}>
                <Text className="text-blue-500">Confirm</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

export default TopHomeHeader

