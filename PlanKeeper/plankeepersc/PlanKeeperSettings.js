import React, { useEffect, useState } from 'react';
import PlanKeeperBackground from '../plankeepercmp/PlanKeeperBackground';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../plankeeperst/planKeeperContext';
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const PlanKeeperSettings = () => {
  const navigation = useNavigation();
  const {
    tasks,
    setTasks,
    planKeeperNotifications,
    setPlanKeeperNotifications,
  } = useStore();
  const [successRate, setSuccessRate] = useState(0);

  const formatDate = d => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      setSuccessRate(0);
      return;
    }

    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return formatDate(date);
    });

    let successDays = 0;

    last7Days.forEach(date => {
      const dayTasks = tasks.filter(t => t.date === date);
      if (dayTasks.length > 0) {
        const allDone = dayTasks.every(t => t.done);
        if (allDone) successDays++;
      }
    });

    const rate = Math.round((successDays / 7) * 100);
    setSuccessRate(rate);
  }, [tasks]);

  const handleClearPlanKeeperData = async () => {
    try {
      await AsyncStorage.removeItem('tasks');
      setTasks([]);
      if (planKeeperNotifications) {
        Toast.show({
          text1: 'Data cleared successfully! ',
        });
      }
    } catch (error) {
      console.error('Error', error);
    }
  };

  const isOnKeeperNotification = async value => {
    Toast.show({
      text1: !planKeeperNotifications
        ? 'Notifications turned on!'
        : 'Notifications turned off!',
    });

    try {
      await AsyncStorage.setItem(
        'PlanKeeperNotifications',
        JSON.stringify(value),
      );
      setPlanKeeperNotifications(value);
    } catch (error) {
      console.log('Error', error);
    }
  };

  return (
    <PlanKeeperBackground>
      <View style={styles.headercont}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.keepertitle}>Settings</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.headerlogo}
            onPress={() => navigation.goBack()}
          >
            <Image source={require('../../assets/images/plankeeperback.png')} />
          </TouchableOpacity>
          <View style={styles.keeperunderline} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 30,
          }}
        >
          <Text style={styles.keeperdatetxt}>Notification</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => isOnKeeperNotification(!planKeeperNotifications)}
          >
            {planKeeperNotifications ? (
              <Image source={require('../../assets/images/plankeeperon.png')} />
            ) : (
              <Image
                source={require('../../assets/images/plankeeperoff.png')}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.keepernotunderline} />

        <View style={styles.statkeepercont}>
          <Text style={styles.keeperstatstxt}>Statistics</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 8,
            }}
          >
            <Text style={styles.keeperstatssbttxt}>
              Success percentage of days during the week
            </Text>
            <Text style={styles.keeperstatsquanttxt}>{successRate}%</Text>
          </View>
        </View>
      </View>

      <View
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'flex-end',
          marginBottom: 50,
        }}
      >
        <TouchableOpacity
          style={styles.keeperbtn}
          activeOpacity={0.7}
          onPress={handleClearPlanKeeperData}
        >
          <Text style={styles.keeperbtntxt}>Clear data</Text>
          <Image source={require('../../assets/images/plankeeperdel.png')} />
        </TouchableOpacity>
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={styles.keeperbtn}
            activeOpacity={0.7}
            onPress={() =>
              Linking.openURL(
                'https://apps.apple.com/us/app/uno-best-plan-keeper/id6754691553',
              )
            }
          >
            <Text style={styles.keeperbtntxt}>Share the app</Text>
            <Image source={require('../../assets/images/plankeepershr.png')} />
          </TouchableOpacity>
        )}
      </View>
    </PlanKeeperBackground>
  );
};

const styles = StyleSheet.create({
  keepertitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  headerlogo: {
    width: 70,
    height: 70,
    position: 'absolute',
    left: 18,
  },
  keeperunderline: {
    width: '100%',
    height: 2,
    backgroundColor: '#FFE438',
    marginTop: 18,
  },
  keepernotunderline: {
    width: '100%',
    height: 1,
    backgroundColor: '#FFE438',
    marginTop: 8,
  },
  headercont: {
    paddingHorizontal: 20,
    marginTop: 80,
    marginBottom: 80,
  },
  keeperbtn: {
    width: '90%',
    height: 60,
    borderRadius: 10,
    backgroundColor: '#FFE438',
    alignItems: 'center',
    paddingHorizontal: 50,
    marginBottom: 10,
    marginTop: 15,
    flexDirection: 'row',
    gap: 13,
    justifyContent: 'space-between',
  },
  keeperbtntxt: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  keeperinput: {
    width: '100%',
    height: 200,
    backgroundColor: '#FFFFFF54',
    borderRadius: 4,
    marginTop: 20,
    padding: 20,
    fontSize: 15,
    fontWeight: '200',
    color: '#fff',
  },
  datepickercnt: {
    width: '100%',
    height: 40,
    backgroundColor: '#FFFFFF54',
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  keeperdatetxt: {
    fontSize: 20,
    fontWeight: '400',
    color: '#FFF',
  },
  pickerwrap: { backgroundColor: '#FFFFFF54', borderRadius: 4, marginTop: 12 },
  statkeepercont: {
    width: '100%',
    padding: 10,
    paddingBottom: 20,
    backgroundColor: '#0000008C',
    borderWidth: 2,
    borderColor: '#FFE438',
    marginTop: 20,
    borderRadius: 10,
    paddingRight: 20,
  },
  keeperstatstxt: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFF',
  },
  keeperstatssbttxt: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFF',
    width: '70%',
  },
  keeperstatsquanttxt: {
    fontSize: 32,
    fontWeight: '900',
    color: '#289B2F',
  },
});

export default PlanKeeperSettings;
