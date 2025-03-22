import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type NavbarProps = {
  activeTab: 'home' | 'camera' | 'memories' | 'profile';
  onTabPress: (tab: 'home' | 'camera' | 'memories' | 'profile') => void;
};

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabPress }) => {
  return (
    <View className="flex-row justify-around items-center bg-white py-4 shadow-md">
      {/* Home */}
      <TouchableOpacity onPress={() => onTabPress('home')} className="items-center">
        <Ionicons
          name="home"
          size={24}
          color={activeTab === 'home' ? '#000' : '#9CA3AF'} 
        />
        <Text className={`mt-1 ${activeTab === 'home' ? 'text-black' : 'text-gray-800'}`}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Camera */}
      <TouchableOpacity onPress={() => onTabPress('camera')} className="items-center">
        <Ionicons
          name="camera"
          size={24}
          color={activeTab === 'camera' ? '#000' : '#9CA3AF'}
        />
        <Text className={`mt-1 ${activeTab === 'camera' ? 'text-black' : 'text-gray-800'}`}>
          Camera
        </Text>
      </TouchableOpacity>

      {/* Memories */}
      <TouchableOpacity onPress={() => onTabPress('memories')} className="items-center">
        <Ionicons
          name="images"
          size={24}
          color={activeTab === 'memories' ? '#000' : '#9CA3AF'}
        />
        <Text className={`mt-1 ${activeTab === 'memories' ? 'text-black' : 'text-gray-800'}`}>
          Memories
        </Text>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity onPress={() => onTabPress('profile')} className="items-center">
        <Ionicons
          name="person"
          size={24}
          color={activeTab === 'profile' ? '#000' : '#9CA3AF'}
        />
        <Text className={`mt-1 ${activeTab === 'profile' ? 'text-black' : 'text-gray-800'}`}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;
