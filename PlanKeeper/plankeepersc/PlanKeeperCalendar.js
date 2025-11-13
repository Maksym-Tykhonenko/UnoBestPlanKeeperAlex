import React, { useState } from 'react';
import PlanKeeperBackground from '../plankeepercmp/PlanKeeperBackground';
import { useStore } from '../plankeeperst/planKeeperContext';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PlanKeeperCalendar = () => {
  const { tasks, toggleTaskDone } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigation = useNavigation();

  const formatPlanKeeperDate = d => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
  };

  const tasksForSelectedDate = tasks.filter(
    task => task.date === formatPlanKeeperDate(selectedDate),
  );

  console.log('tasksForSelectedDate', tasks);

  return (
    <PlanKeeperBackground>
      <View
        style={{
          alignItems: 'center',
          marginTop: 80,
          paddingHorizontal: 20,
        }}
      >
        <Text style={styles.keepertitle}>Calendar</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerlogo}
          onPress={() => navigation.goBack()}
        >
          <Image source={require('../../assets/images/plankeeperback.png')} />
        </TouchableOpacity>
        <View style={styles.keeperunderline} />
      </View>

      <Calendar
        onDayPress={day => setSelectedDate(new Date(day.dateString))}
        markedDates={{
          [selectedDate.toISOString().split('T')[0]]: {
            selected: true,
            selectedColor: '#FFE438',
          },
        }}
        theme={{
          backgroundColor: '#00703E',
          calendarBackground: '#00703E',
          selectedDayBackgroundColor: '#FFE438',
          todayTextColor: '#000',
          arrowColor: '#FFE438',
          dayTextColor: '#000',
          monthTextColor: '#000',
          selectedDayTextColor: '#000',
        }}
      />

      <View style={styles.taskscont}>
        <View
          style={[styles.keeperunderline, { marginTop: 5, marginBottom: 2 }]}
        />
        {tasksForSelectedDate.length === 0 && (
          <Text style={styles.keeperemptytasktxt}>
            There are no tasks today!
          </Text>
        )}

        {tasksForSelectedDate.map(task => (
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
  headercont: { paddingHorizontal: 20, marginTop: 80 },
  keepertitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  taskscont: { flex: 1, paddingHorizontal: 30, marginTop: 10 },
  keepertasktxt: {
    fontSize: 16,
    color: '#FFE438',
    marginBottom: 10,
    textAlign: 'center',
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
  keeperemptytasktxt: {
    fontSize: 20,
    color: '#FFF',
    marginTop: 70,
    textAlign: 'center',
    marginBottom: 30,
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
    marginTop: 20,
    marginBottom: 20,
  },
  radiobtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerlogo: {
    width: 70,
    height: 70,
    position: 'absolute',
    left: 24,
  },
  keeperunderline: {
    width: '100%',
    height: 2,
    backgroundColor: '#FFE438',
    marginTop: 18,
    marginBottom: 20,
  },
});

export default PlanKeeperCalendar;
