<template>
  <div>
    <h1>{{ currentTime }}</h1>
    <div>{{ currentDate }}</div>
    <div class="flex justify-center gap-x-3 mt-4">
      <Button @click="punchIn" :disabled="hasPunchedIn">上班打卡</Button>
      <Button @click="punchOut" :disabled="!canPunchOut">下班打卡</Button>
    </div>
    <div class="mt-4">
      <router-link to="/records">查看打卡紀錄</router-link>
    </div>
  </div>
</template>
<!--
<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from '../../firebase'; // 确保导入路径正确
import Button from '../components/Button.vue';

// const API_URL = import.meta.env.VITE_API_HOST_URL;

const currentDate = ref('');
const currentTime = ref('');
const lastPunchInTime = ref(null);
const hasPunchedIn = ref(false);

const updateDateTime = () => {
  const now = new Date();
  currentDate.value = now.toLocaleDateString();
  currentTime.value = now.toLocaleTimeString();
};

const canPunchOut = computed(() => {
  if (!lastPunchInTime.value || !hasPunchedIn.value) return false;
  const now = new Date();
  const timeDiff = now - lastPunchInTime.value;
  console.log(`Current time diff: ${timeDiff / 1000 / 60 / 60} hours`); // 打印时间差以小时为单位
  return timeDiff >= 8 * 60 * 60 * 1000; // 8 hours in milliseconds
});

const punchIn = async () => {
  try {
    const position = await getCurrentPosition();
    console.log('Sending request to:', API_URL);
    const docRef = await addDoc(collection(db, "punches"), {
      type: '上班',
      date: currentDate.value,
      time: currentTime.value,
      location: position
    });
    if (response.data.success) {
      hasPunchedIn.value = true;
      lastPunchInTime.value = new Date();
      console.log('Punch In Time:', lastPunchInTime.value);
      alert('上班打卡成功！');
    }
  } catch (error) {
    console.error('打卡失敗:', error);
    alert('打卡失敗，請稍後再試。');
  }
};

const punchOut = async () => {
  if(!canPunchOut.value) {
    alert('上班時間未滿8小時，無法打下班卡。');
    return;
  }
  try {
    const position = await getCurrentPosition();
    const docRef = await addDoc(collection(db, "punches"), {
      type: '下班',
      date: currentDate.value,
      time: currentTime.value,
      location: position
    });
    if (response.data.success) {
      hasPunchedIn.value = false;
      lastPunchInTime.value = null; // 清空上班时间
      alert('下班打卡成功！');
    }
  } catch (error) {
    console.error('打卡失敗:', error);
    alert('打卡失敗，請稍後再試。');
  }
};

const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('瀏覽器不支持地理位置');
    } else {
      navigator.geolocation.getCurrentPosition(
        position => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }),
        () => reject('無法獲取位置信息')
      );
    }
  });
};

const checkPunchInStatus = async () => {
  try {
    // const response = await axios.get(`${API_URL}/records`);
    // const records = response.data;
    // const todayRecords = records.filter(record => record.date === currentDate.value);
    // const punchInRecord = todayRecords.find(record => record.type === '上班');
    // if (punchInRecord) {
    //   hasPunchedIn.value = true;
    //   lastPunchInTime.value = new Date(punchInRecord.time);
    // }
    const q = query(collection(db, "punches"), where("date", "==", currentDate.value), where("type", "==", "上班"));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      hasPunchedIn.value = true;
      lastPunchInTime.value = new Date(querySnapshot.docs[0].data().time);
    }
  } catch (error) {
    console.error('Error checking punch-in status:', error);
  }
};

onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
  checkPunchInStatus();
  // console.log(import.meta.env);
});
</script> -->

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from '../../firebase'; // 确保导入路径正确
import Button from '../components/Button.vue';

const currentDate = ref('');
const currentTime = ref('');
const lastPunchInTime = ref(null);
const hasPunchedIn = ref(false);

const updateDateTime = () => {
  const now = new Date();
  currentDate.value = now.toLocaleDateString();
  currentTime.value = now.toLocaleTimeString();
};

const canPunchOut = computed(() => {
  if (!lastPunchInTime.value || !hasPunchedIn.value) return false;
  const now = new Date();
  const timeDiff = now - new Date(lastPunchInTime.value); // 确保 lastPunchInTime 是一个日期对象
  console.log(`Current time diff: ${timeDiff / 1000 / 60 / 60} hours`);
  return timeDiff >= 8 * 60 * 60 * 1000; // 8 hours in milliseconds
});

const punchIn = async () => {
  if (hasPunchedIn.value) {
    alert('今天已經打過上班卡，不能重複打卡。');
    return;
  }

  try {
    const position = await getCurrentPosition();
    const docRef = await addDoc(collection(db, "punches"), {
      type: '上班',
      date: currentDate.value,
      time: currentTime.value,
      location: position
    });
    hasPunchedIn.value = true;
    lastPunchInTime.value = new Date();
    console.log('Punch In Time:', lastPunchInTime.value);
    alert('上班打卡成功！');
  } catch (error) {
    console.error('打卡失敗:', error);
    alert('打卡失敗，請稍後再試。');
  }
};

const punchOut = async () => {
  if (!canPunchOut.value) {
    alert('上班時間未滿8小時，無法打下班卡。');
    return;
  }
  try {
    const position = await getCurrentPosition();
    const docRef = await addDoc(collection(db, "punches"), {
      type: '下班',
      date: currentDate.value,
      time: currentTime.value,
      location: position
    });
    hasPunchedIn.value = false;
    lastPunchInTime.value = null;
    alert('下班打卡成功！');
  } catch (error) {
    console.error('打卡失敗:', error);
    alert('打卡失敗，請稍後再試。');
  }
};

const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('瀏覽器不支持地理位置');
    } else {
      navigator.geolocation.getCurrentPosition(
        position => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }),
        () => reject('無法獲取位置信息')
      );
    }
  });
};

const checkPunchInStatus = async () => {
  try {
    const q = query(collection(db, "punches"), where("date", "==", currentDate.value), where("type", "==", "上班"));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      hasPunchedIn.value = true;
      lastPunchInTime.value = new Date(querySnapshot.docs[0].data().time);
    } else {
      hasPunchedIn.value = false;
      lastPunchInTime.value = null;
    }
  } catch (error) {
    console.error('Error checking punch-in status:', error);
  }
};

onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
  checkPunchInStatus();
});
</script>