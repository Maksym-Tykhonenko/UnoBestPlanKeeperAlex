import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlanKeeperBackground from '../plankeepercmp/PlanKeeperBackground';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Modal,
  Share,
  Alert,
} from 'react-native';
import { useStore } from '../plankeeperst/planKeeperContext';
import Toast from 'react-native-toast-message';

const plankeepergifts = [
  require('../../assets/images/plankeepergift1.png'),
  require('../../assets/images/plankeepergift2.png'),
  require('../../assets/images/plankeepergift3.png'),
  require('../../assets/images/plankeepergift4.png'),
  require('../../assets/images/plankeepergift5.png'),
];

const PlanKeeperCreateTask = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { addTask, updateTask, planKeeperNotifications } = useStore();
  const editingTask = route.params?.task;
  const [keeperTaskTitle, setKeeperTaskTitle] = useState(
    editingTask?.title || '',
  );
  const parseDate = str => {
    if (!str) return null;
    const [day, month, year] = str.split('.').map(Number);
    return new Date(year, month - 1, day);
  };
  const [keeperTaskDate, setKeeperTaskDate] = useState(
    editingTask?.date ? parseDate(editingTask.date) : null,
  );
  const [showKeeperDatePicker, setShowKeeperDatePicker] = useState(false);
  const [giftModalVisible, setGiftModalVisible] = useState(false);
  const [unlockedGiftIndex, setUnlockedGiftIndex] = useState(null);

  const formatPlanKeeperDate = d => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
  };

  const handlePlanKeeperDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowKeeperDatePicker(false);
    if (selectedDate) setKeeperTaskDate(selectedDate);
  };

  const handleCreateKeeperTask = async () => {
    if (!keeperTaskTitle.trim()) return;

    if (planKeeperNotifications) {
      Toast.show({
        type: 'success',
        text1: editingTask
          ? 'Task edited successfully!'
          : 'Task created successfully!',
      });
    }

    const today = new Date();
    const formattedDate = keeperTaskDate
      ? formatPlanKeeperDate(keeperTaskDate)
      : formatPlanKeeperDate(today);

    const taskData = {
      id: editingTask?.id || Date.now().toString(),
      title: keeperTaskTitle,
      date: formattedDate,
      done: editingTask?.done || false,
    };

    if (editingTask) updateTask(editingTask.id, taskData);
    else addTask(taskData);

    const hasGift = await checkAndGrantGift(today);

    if (!hasGift) {
      navigation.goBack();
    }
  };

  const checkAndGrantGift = async today => {
    try {
      const formattedToday = formatPlanKeeperDate(today);

      const lastDateStr = await AsyncStorage.getItem('lastTaskDate');
      let streakCount = parseInt(
        (await AsyncStorage.getItem('streakCount')) || '0',
        10,
      );

      if (lastDateStr) {
        const [d, m, y] = lastDateStr.split('.').map(Number);
        const lastDate = new Date(y, m - 1, d);
        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) streakCount += 1;
        else if (diffDays > 1) streakCount = 1;
      } else {
        streakCount = 1;
      }

      await AsyncStorage.setItem('lastTaskDate', formattedToday);
      await AsyncStorage.setItem('streakCount', streakCount.toString());

      if (streakCount % 10 === 0) {
        const gifts = JSON.parse(
          (await AsyncStorage.getItem('unlockedGifts')) || '[]',
        );
        const nextGiftIndex =
          gifts.length < plankeepergifts.length ? gifts.length : null;

        if (nextGiftIndex !== null) {
          gifts.push(nextGiftIndex);
          await AsyncStorage.setItem('unlockedGifts', JSON.stringify(gifts));
          setUnlockedGiftIndex(nextGiftIndex);
          setGiftModalVisible(true);
          return true;
        }
      }

      return false;
    } catch (e) {
      console.log('Gift error:', e);
      return false;
    }
  };

  const sharePlanKeeperReward = async item => {
    try {
      await Share.share({
        message: `For completing all the tasks for 10 days in a row, you received a gift!`,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <PlanKeeperBackground>
      <View style={styles.headercont}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.keepertitle}>
            {editingTask ? 'Task edit' : 'Create task'}
          </Text>
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
          style={
            editingTask && {
              borderWidth: 2,
              borderColor: '#FFE438',
              padding: 10,
              borderRadius: 10,
              marginTop: 20,
            }
          }
        >
          <TextInput
            placeholder="Task"
            style={[styles.keeperinput, editingTask && { marginTop: 0 }]}
            placeholderTextColor={'#fff'}
            multiline
            textAlignVertical="top"
            value={keeperTaskTitle}
            onChangeText={setKeeperTaskTitle}
          />

          <TouchableOpacity
            style={styles.datepickercnt}
            onPress={() => setShowKeeperDatePicker(true)}
          >
            <Text style={styles.keeperdatetxt}>
              {keeperTaskDate ? formatPlanKeeperDate(keeperTaskDate) : 'Date'}
            </Text>
          </TouchableOpacity>
        </View>

        {showKeeperDatePicker && (
          <View style={styles.pickerwrap}>
            <DateTimePicker
              value={keeperTaskDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handlePlanKeeperDateChange}
            />
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.keeperbtn}
          activeOpacity={0.7}
          onPress={handleCreateKeeperTask}
          disabled={!keeperTaskTitle || !keeperTaskDate}
        >
          <Text style={styles.keeperbtntxt}>Create</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={giftModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Text style={styles.keepertitle}>New Reward</Text>
          <View
            style={{
              width: '90%',
              height: 2,
              backgroundColor: '#FFE438',
              marginTop: 15,
              marginBottom: 100,
            }}
          />
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              For completing all the tasks for 10 days in a row, you received a
              gift!
            </Text>
            {unlockedGiftIndex !== null && (
              <Image
                source={plankeepergifts[unlockedGiftIndex]}
                style={styles.giftImage}
                resizeMode="contain"
              />
            )}
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                flexWrap: 'wrap',
                marginTop: 15,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.modalButton}
                onPress={() => {
                  setGiftModalVisible(false), navigation.goBack();
                }}
              >
                <Text style={styles.modalButtonText}>Take</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                activeOpacity={0.7}
                onPress={() => sharePlanKeeperReward()}
              >
                <Text style={styles.modalButtonText}>Share</Text>
                <Image
                  source={require('../../assets/images/plankeepershr.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headercont: {
    paddingHorizontal: 20,
    marginTop: 80,
  },
  keeperbtn: {
    width: '90%',
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
    fontSize: 15,
    fontWeight: '200',
    color: '#FFF',
  },
  pickerwrap: {
    backgroundColor: '#FFFFFF54',
    borderRadius: 4,
    marginTop: 12,
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000c8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 60,
  },
  giftImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#FFE438',
    height: 60,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
    width: 160,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlanKeeperCreateTask;
