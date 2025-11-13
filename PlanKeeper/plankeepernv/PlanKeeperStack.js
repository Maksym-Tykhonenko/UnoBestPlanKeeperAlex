import { createStackNavigator } from '@react-navigation/stack';
import PlanKeeperOnboard from '../plankeepersc/PlanKeeperOnboard';
import PlanKeeperHome from '../plankeepersc/PlanKeeperHome';
import PlanKeeperCreateTask from '../plankeepersc/PlanKeeperCreateTask';
import PlanKeeperCalendar from '../plankeepersc/PlanKeeperCalendar';
import PlanKeeperSettings from '../plankeepersc/PlanKeeperSettings';
import PlanKeeperGifts from '../plankeepersc/PlanKeeperGifts';

const Stack = createStackNavigator();

const PlanKeeperStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlanKeeperOnboard" component={PlanKeeperOnboard} />
      <Stack.Screen name="PlanKeeperHome" component={PlanKeeperHome} />
      <Stack.Screen
        name="PlanKeeperCreateTask"
        component={PlanKeeperCreateTask}
      />
      <Stack.Screen name="PlanKeeperCalendar" component={PlanKeeperCalendar} />
      <Stack.Screen name="PlanKeeperSettings" component={PlanKeeperSettings} />
      <Stack.Screen name="PlanKeeperGifts" component={PlanKeeperGifts} />
    </Stack.Navigator>
  );
};

export default PlanKeeperStack;
