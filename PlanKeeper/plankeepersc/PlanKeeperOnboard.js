import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PlanKeeperBackground from '../plankeepercmp/PlanKeeperBackground';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const PlanKeeperOnboard = () => {
  const [planKeeperSlide, setPlanKeeperSlide] = useState(0);
  const navigation = useNavigation();
  const [showPlanKeeperIcon, setShowPlanKeeperIcon] = useState(true);

  const nextPlanKeeperScreen = () => {
    planKeeperSlide === 4
      ? navigation.navigate('PlanKeeperHome')
      : setPlanKeeperSlide(planKeeperSlide + 1);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowPlanKeeperIcon(false);
    }, 2000);
  }, []);

  return (
    <PlanKeeperBackground>
      {showPlanKeeperIcon ? (
        <View
          style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
        >
          {Platform.OS === 'ios' ? (
            <Image
              source={require('../../assets/images/keeperloaderlogo.png')}
            />
          ) : (
            <Image
              source={require('../../assets/images/andricon.png')}
              style={{ width: 167, height: 167, borderRadius: 32 }}
            />
          )}
        </View>
      ) : (
        <>
          {planKeeperSlide === 0 && (
            <View style={styles.slidecont}>
              <Text style={styles.keepertitle}>
                {Platform.OS === 'ios'
                  ? ' Welcome to One Best Plan Keeper!'
                  : ' Welcome to 888 Best Plan Keeper!'}
              </Text>

              {Platform.OS === 'ios' ? (
                <Image
                  source={require('../../assets/images/keeperloaderlogo.png')}
                  style={{ marginTop: 70 }}
                />
              ) : (
                <Image
                  source={require('../../assets/images/andricon.png')}
                  style={{
                    width: 155,
                    height: 155,
                    borderRadius: 32,
                    marginTop: 70,
                  }}
                />
              )}
              <Text style={styles.keeperdescription}>
                Your new daily partner for planning, achieving, and staying
                motivated.
              </Text>

              <TouchableOpacity
                style={styles.keeperbtn}
                activeOpacity={0.7}
                onPress={nextPlanKeeperScreen}
              >
                <Text style={styles.keeperbtntxt}>Let’s get started!</Text>
              </TouchableOpacity>
            </View>
          )}
          {planKeeperSlide > 0 && (
            <>
              <View style={styles.keeperheader}>
                {Platform.OS === 'ios' ? (
                  <Image
                    source={require('../../assets/images/keeperloaderlogo.png')}
                  />
                ) : (
                  <Image
                    source={require('../../assets/images/andricon.png')}
                    style={{
                      width: 155,
                      height: 155,
                      borderRadius: 32,
                    }}
                  />
                )}
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={[
                    styles.keepertitle,
                    { marginTop: 55, marginBottom: 130, width: '70%' },
                  ]}
                >
                  {planKeeperSlide === 1 && 'Build Your Perfect Plan'}
                  {planKeeperSlide === 2 && 'Stay On Track'}
                  {planKeeperSlide === 3 && 'Get Rewarded for Consistency'}
                  {planKeeperSlide === 4 && 'Your Journey Starts Now'}
                </Text>

                {planKeeperSlide === 3 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      position: 'absolute',
                      top: 140,
                    }}
                  >
                    <Image
                      source={require('../../assets/images/plankeeperonbim1.png')}
                      style={{ right: -35 }}
                    />
                    <Image
                      source={require('../../assets/images/plankeeperonbim2.png')}
                    />
                    <Image
                      source={require('../../assets/images/plankeeperonbim3.png')}
                      style={{ left: -40 }}
                    />
                  </View>
                )}
                <Text style={styles.keeperdescription}>
                  {planKeeperSlide === 1 &&
                    'Create personalized plans, tasks, or goals — from daily routines to big dreams.'}
                  {planKeeperSlide === 2 &&
                    'Check off tasks, monitor your progress, and keep your goals visible every day.'}
                  {planKeeperSlide === 3 &&
                    'Complete plans regularly to unlock exciting gifts and achievements!'}
                  {planKeeperSlide === 4 &&
                    'Plan smarter, stay consistent, and become your One Best self.'}
                </Text>
              </View>
              <View style={styles.slidecont}>
                <TouchableOpacity
                  style={styles.keeperbtn}
                  activeOpacity={0.7}
                  onPress={nextPlanKeeperScreen}
                >
                  <Text style={styles.keeperbtntxt}>
                    {planKeeperSlide === 0 && 'Let’s get started!'}
                    {planKeeperSlide === 1 && 'Start Planning'}
                    {planKeeperSlide === 2 && 'See How It Works'}
                    {planKeeperSlide === 3 && 'Let’s Earn Rewards'}
                    {planKeeperSlide === 4 && 'Start My First Plan'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      )}
    </PlanKeeperBackground>
  );
};

const styles = StyleSheet.create({
  keepertitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    width: '80%',
  },
  keeperdescription: {
    fontSize: 24,
    fontWeight: '300',
    color: '#fff',
    textAlign: 'center',
    marginTop: 55,
    width: '80%',
  },
  slidecont: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  keeperbtn: {
    width: '90%',
    height: 60,
    borderRadius: 10,
    backgroundColor: '#FFE438',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    marginTop: 130,
  },
  keeperbtntxt: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  keeperheader: {
    width: '100%',
    paddingBottom: 20,
    backgroundColor: '#00703E',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
    paddingTop: 40,
  },
});

export default PlanKeeperOnboard;
