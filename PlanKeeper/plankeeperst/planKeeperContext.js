import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export const StoreContext = createContext(undefined);

export const useStore = () => {
  return useContext(StoreContext);
};

export const ContextProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [planKeeperNotifications, setPlanKeeperNotifications] = useState(false);

  useEffect(() => {}, []);

  useFocusEffect(
    useCallback(() => {
      const loadTasks = async () => {
        try {
          const savedTasks = await AsyncStorage.getItem('tasks');
          if (savedTasks) setTasks(JSON.parse(savedTasks));
        } catch (e) {
          console.log('Error', e);
        }
      };
      loadTasks();
    }, []),
  );

  const saveTasks = async newTasks => {
    try {
      setTasks(newTasks);
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (e) {
      console.log('Error', e);
    }
  };

  const addTask = task => {
    const newTasks = [...tasks, task];
    saveTasks(newTasks);
  };

  const updateTask = (id, updatedTask) => {
    const newTasks = tasks.map(t => (t.id === id ? updatedTask : t));
    saveTasks(newTasks);
  };

  const toggleTaskDone = id => {
    const newTasks = tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t,
    );
    saveTasks(newTasks);
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    toggleTaskDone,
    planKeeperNotifications,
    setPlanKeeperNotifications,
    setTasks,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
