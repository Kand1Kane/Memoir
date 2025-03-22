import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageSourcePropType
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface memoryType{
    id: number,
    title: string,
    subtitle: string,
    count: number,
    created_at: Date
    image_url: ImageSourcePropType
}

// Sample data for demonstration
const memoryData: memoryType[] = [
  {
    id: 1,
    title: 'Outdoor Boys',
    subtitle: 'Free time after Midterm',
    count: 50,
    // 8 days ago (should show up in This Month)
    created_at: new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000),
    image_url: {uri: "https://reactnative.dev/img/tiny_logo.png"},
  },
  {
    id: 2,
    title: 'Family Sunset',
    subtitle: 'Lovely family reunion',
    count: 67,
    // 2 days ago (should show up in This Week and This Month)
    created_at: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
    image_url: {uri: "https://reactnative.dev/img/tiny_logo.png"},
  },
  {
    id: 3,
    title: 'Office Chat',
    subtitle: 'Team meeting vibes',
    count: 10,
    // 35 days ago (likely not in current week and depending on the month, may or may not be in current month)
    created_at: new Date(new Date().getTime() - 35 * 24 * 60 * 60 * 1000),
    image_url: {uri: "https://reactnative.dev/img/tiny_logo.png"},
  }
];

// Middle Section Component
const HomeMemories = () => {
  const [selectedTab, setSelectedTab] = useState('All Memories');

  const TABS = ['All Memories', 'This Week', 'This Month'];

  // Calculate filtered memories based on the selected tab
  const filteredData = useMemo(() => {
    if (selectedTab === 'All Memories') {
      return memoryData;
    }
    const currentDate = new Date();
    if (selectedTab === 'This Week') {
      // Assuming week starts on Sunday. Find start of week.
      const startOfWeek = new Date(currentDate);
      startOfWeek.setHours(0, 0, 0, 0);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      return memoryData.filter(memory => memory.created_at >= startOfWeek);
    }
    if (selectedTab === 'This Month') {
      return memoryData.filter(memory => {
        return (
          memory.created_at.getMonth() === currentDate.getMonth() &&
          memory.created_at.getFullYear() === currentDate.getFullYear()
        );
      });
    }
    return memoryData;
  }, [selectedTab]);

  const renderCard = ({ item }: { item: memoryType }) => { 
    return (
      <View className="w-[48%] bg-white rounded-lg overflow-hidden mb-4 relative shadow">
        {/* Image Section */}
        <View className="relative">
          <Image
            source={item.image_url}
            className="w-full h-32"
            resizeMode="cover"
          />
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
    );
  };

  return (
    <View className="flex-1 bg-white px-4 pt-4 pb-2">
      {/* Tab Row */}
      <View className="flex-row mb-4">
        {TABS.map((tab) => {
          const isActive = tab === selectedTab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              className={`rounded-full px-4 py-2 mr-2 ${
                isActive ? 'bg-pink-500' : 'bg-gray-200'
              }`}
            >
              <Text className={isActive ? 'text-white' : 'text-black'}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Grid of Cards */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={renderCard}
        className='mt-4'
      />
    </View>
  );
};

export default HomeMemories;