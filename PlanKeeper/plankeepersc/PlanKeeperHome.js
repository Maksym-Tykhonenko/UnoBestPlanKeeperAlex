import PlanKeeperBackground from '../plankeepercmp/PlanKeeperBackground';
import { useCallback } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useStore } from '../plankeeperst/planKeeperContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlanKeeperHome = () => {
  const navigation = useNavigation();
  const { tasks, toggleTaskDone, setPlanKeeperNotifications } = useStore();

  useFocusEffect(
    useCallback(() => {
      loadPlanKeeperSettings();
    }, []),
  );

  const loadPlanKeeperSettings = async () => {
    try {
      const crovvnNotifValue = await AsyncStorage.getItem(
        'PlanKeeperNotifications',
      );
      if (crovvnNotifValue !== null)
        setPlanKeeperNotifications(JSON.parse(crovvnNotifValue));
    } catch (e) {
      console.error(e);
    }
  };

  const formatPlanKeeperDate = date => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
  };

  const today = formatPlanKeeperDate(new Date());

  const todayTasks = tasks.filter(task => task.date === today);

  return (
    <PlanKeeperBackground>
      <View style={styles.headercont}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.keepertitle}>Main menu</Text>

          {Platform.OS === 'ios' ? (
            <Image
              source={require('../../assets/images/plankeeperonblogo.png')}
              style={styles.headerlogo}
            />
          ) : (
            <Image
              source={require('../../assets/images/andricon.png')}
              style={styles.headerlogo}
            />
          )}

          <View style={styles.keeperunderline} />

          <View style={{ paddingHorizontal: 20, width: '100%' }}>
            <TouchableOpacity
              style={styles.keeperbtn}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('PlanKeeperCreateTask')}
            >
              <Text style={styles.keeperbtntxt}>Create a task</Text>
              <Image
                source={require('../../assets/images/plankeepercreate.png')}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            gap: 11,
          }}
        >
          <TouchableOpacity
            style={styles.keepersmbtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PlanKeeperCalendar')}
          >
            <Image source={require('../../assets/images/plankeepercall.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.keepersmbtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PlanKeeperGifts')}
          >
            <Image source={require('../../assets/images/plankeepergift.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.keepersmbtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PlanKeeperSettings')}
          >
            <Image source={require('../../assets/images/plankeepersett.png')} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.taskscont}>
        <Text style={styles.keepertasktxt}>Today task list</Text>

        {todayTasks.length === 0 && (
          <Text
            style={[styles.keepertasktxt, { color: '#fff', marginTop: 80 }]}
          >
            There are no tasks today!
          </Text>
        )}

        {todayTasks.map(task => (
          <View style={styles.tasklistcont} key={task.id}>
            <TouchableOpacity
              onPress={() => toggleTaskDone(task.id)}
              style={styles.radiobtn}
            >
              {task.done && (
                <Image
                  source={require('../../assets/images/plankeeperdone.png')}
                />
              )}
            </TouchableOpacity>
            <Text style={styles.keepertasktitle}>{task.title}</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={{ gap: 8, alignItems: 'center' }}
              onPress={() =>
                navigation.navigate('PlanKeeperCreateTask', { task: task })
              }
            >
              <Image
                source={require('../../assets/images/plankeeperedit.png')}
              />
              <Text style={styles.keepertaskdate}>{task.date}</Text>
            </TouchableOpacity>
          </View>
        ))}
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
    left: 20,
    top: -35,
    borderWidth: 0.6,
    borderColor: 'green',
    borderRadius: 22,
  },
  keeperdescription: {
    fontSize: 24,
    fontWeight: '300',
    color: '#fff',
    textAlign: 'center',
    marginTop: 55,
    width: '80%',
  },
  keeperunderline: {
    width: '100%',
    height: 2,
    backgroundColor: '#FFE438',
    marginTop: 18,
  },
  headercont: {
    paddingHorizontal: 20,
    marginTop: 80,
  },
  keeperbtn: {
    width: '100%',
    height: 60,
    borderRadius: 10,
    backgroundColor: '#FFE438',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 40,
    flexDirection: 'row',
    gap: 13,
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
  keepersmbtn: {
    width: 106,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#FFE438',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    flex: 1,
  },
  taskscont: {
    width: '100%',
    flex: 1,
    backgroundColor: '#00703E8C',
    borderTopWidth: 2,
    borderColor: '#FFE438',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderWidth: 0.2,
    marginTop: 33,
    paddingHorizontal: 30,
    padding: 20,
  },
  keepertasktxt: {
    fontSize: 20,
    fontWeight: '400',
    color: '#FFE438',
    textAlign: 'center',
    marginBottom: 20,
  },
  tasklistcont: {
    width: '100%',
    padding: 20,
    backgroundColor: '#0000008C',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFE438',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  radiobtn: {
    width: 30,
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepertasktitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFF',
    width: '60%',
  },
  keepertaskdate: {
    fontSize: 11,
    fontWeight: '400',
    color: '#FFF',
  },
});

export default PlanKeeperHome;
