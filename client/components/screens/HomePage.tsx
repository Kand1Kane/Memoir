import HomeMemories from "components/HomeMemories"
import TopHomeHeader from "components/TopHomeHeader"
import { View } from "react-native"

export const HomePage = () => {
    return (
        <>
            <TopHomeHeader />
            <HomeMemories/>
        </>
    )
}