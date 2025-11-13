import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PlanKeeperBackground from '../plankeepercmp/PlanKeeperBackground';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

const plankeepergifts = [
  require('../../assets/images/plankeepergift1.png'),
  require('../../assets/images/plankeepergift2.png'),
  require('../../assets/images/plankeepergift3.png'),
  require('../../assets/images/plankeepergift4.png'),
  require('../../assets/images/plankeepergift5.png'),
];

const PlanKeeperGifts = () => {
  const navigation = useNavigation();
  const [planKeeperUnlockedGifts, setPlanKeeperUnlockedGifts] = useState([]);
  const [showLargeKeeperGift, setShowLargeKeeperGift] = useState(false);
  const [selectedGiftIndex, setSelectedGiftIndex] = useState(null);
  const imageRef = useRef(null);

  const sharePlanKeeperGift = async () => {
    try {
      const tmpUri = await captureRef(imageRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      let fileUri = tmpUri.startsWith('file://') ? tmpUri : 'file://' + tmpUri;
      const pathToCheck = fileUri.replace('file://', '');
      const exists = await RNFS.exists(pathToCheck);
      if (!exists) return;

      await Share.open({
        url: fileUri,
        type: 'image/png',
        failOnCancel: false,
      });
    } catch (error) {
      if (!error?.message?.includes('User did not share')) {
        console.error('error', error);
      }
    }
  };

  useEffect(() => {
    const load = async () => {
      const data = JSON.parse(
        (await AsyncStorage.getItem('unlockedGifts')) || '[]',
      );
      setPlanKeeperUnlockedGifts(data);
    };
    load();
  }, []);

  return (
    <PlanKeeperBackground>
      <View style={styles.headercont}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.keepertitle}>Gift stickers</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.headerlogo}
            onPress={() => navigation.goBack()}
          >
            <Image source={require('../../assets/images/plankeeperback.png')} />
          </TouchableOpacity>
          <View style={styles.keeperunderline} />
        </View>
      </View>

      {showLargeKeeperGift ? (
        <>
          <View style={styles.largekeepercont}>
            <Image
              ref={imageRef}
              collapsable={false}
              source={plankeepergifts[selectedGiftIndex]}
              style={{ width: 200, height: 200 }}
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
            }}
          >
            <TouchableOpacity
              style={styles.keeperbtn}
              activeOpacity={0.7}
              onPress={sharePlanKeeperGift}
            >
              <Text style={styles.keeperbtntxt}>Share </Text>
              <Image
                source={require('../../assets/images/plankeepershr.png')}
              />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.giftContainer}>
          {plankeepergifts.map((gift, index) => (
            <TouchableOpacity
              style={styles.plankeepergiftcont}
              activeOpacity={0.7}
              disabled={!planKeeperUnlockedGifts.includes(index)}
              key={index}
              onPress={() => {
                setSelectedGiftIndex(index);
                setShowLargeKeeperGift(true);
              }}
            >
              <Image
                key={index}
                source={gift}
                style={[
                  styles.giftImage,
                  !planKeeperUnlockedGifts.includes(index) && { opacity: 0.4 },
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
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
  keeperbtn: {
    width: '43%',
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
  giftContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  giftImage: {
    width: 120,
    height: 120,
  },
  plankeepergiftcont: {
    width: '45%',
    height: 160,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFE438',
    backgroundColor: '#0000008C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  largekeepercont: {
    width: '90%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFE438',
    backgroundColor: '#0000008C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 43,
  },
});

export default PlanKeeperGifts;
