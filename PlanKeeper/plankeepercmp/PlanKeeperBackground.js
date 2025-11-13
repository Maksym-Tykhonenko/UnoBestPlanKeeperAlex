import { ImageBackground, ScrollView } from 'react-native';

const PlanKeeperBackground = ({ children }) => {
  return (
    <ImageBackground
      source={require('../../assets/images/plankeeperbg.png')}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </ImageBackground>
  );
};

export default PlanKeeperBackground;
