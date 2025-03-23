import Navbar from 'components/NavBar';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { HomePage } from './HomePage';
import { CameraPage } from './CameraPage';
import { ProfilePage } from './ProfilePage';

export const ScreenSelector = () => {

  const [activeTab, setActiveTab] = useState<'home' | 'camera' | 'memories' | 'profile'>('home');

  return (
    <View className="flex-1 bg-gray-100">
      {activeTab === 'home' && (
        <View className="flex-1">
          <HomePage />
        </View>
      )}
      
      {activeTab === 'camera' && (
        <View className="flex-1 h-full w-full justify-center items-center">
          <CameraPage />
        </View>
      )}
      {activeTab === 'memories' && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl font-bold">Memories Screen</Text>
        </View>
      )}
      {activeTab === 'profile' && (
        <View className="flex-1 justify-center items-center">
          <ProfilePage />
        </View>
      )}

      {/* Bottom Navbar */}
      {activeTab !== 'a' && (
      <Navbar activeTab={activeTab} onTabPress={setActiveTab} />
      )}
    </View>
  );
};
