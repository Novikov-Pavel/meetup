<template>
  <div class="section">
    <h1 class="section-title"> СЕКЦИЯ {{ $route?.params?.events }} </h1>
    <h2 class="section-time">{{ currentTime }}</h2>
  </div>
  <div class="card">
    <div
      v-for="e in event"
      :key="e[topic]"
      :class="[isInTimeRange(e?.[startEvent], endEvent(e?.[startEvent], e?.[time])) ? 'backgroundCurrent' : 'background', isMoreTimeRange(e?.[startEvent], endEvent(e?.[startEvent], e?.[time])) ? 'displayNone' : undefined]"
    >
      <div class="flex">
        <div
          :class="isInTimeRange(e?.[startEvent], endEvent(e?.[startEvent], e?.[time])) ? 'card-time card-time__current' : 'card-time'"
        >
          {{ e?.[startEvent] }} -
          {{ endEvent(e?.[startEvent], e?.[time]) }}
        </div>
          Осталось {{ minutesUntilEnd(endEvent(e?.[startEvent], e?.[time])) }} мин
      </div>
      <div v-if="e[speaker] !== '-'"
        :class="isInTimeRange(e?.[startEvent], endEvent(e?.[startEvent], e?.[time])) ? 'card-speaker card-speaker__current' : 'card-speaker'"
      >
        <img v-if="e[logo] !== '-'" :src="e?.[logo]" :alt="e?.[logo]" />
        {{ e[speaker] }}
      </div>
      <div
        :class="isInTimeRange(e?.[startEvent], endEvent(e?.[startEvent], e?.[time])) ? 'card-topic card-topic__current' : 'card-topic'"
      >
        {{ e?.[topic] }}
      </div>
      <div v-if="e[typeEvent] !== '-'" class="card-footer">
        <div
          :class="isInTimeRange(e?.[startEvent], endEvent(e?.[startEvent], e?.[time])) ? 'card-hover__current' : 'card-type card-hover'">
            {{ e[typeEvent] }}
        </div> 
        <div 
          :class="isInTimeRange(e?.[startEvent], endEvent(e?.[startEvent], e?.[time])) ? 'card-current' : 'card-lang'">
            {{ e?.[lang] }}
          </div> 
        <div 
          :class="isInTimeRange(e?.[startEvent], endEvent(e?.[startEvent], e?.[time])) ? 'card-current' : 'card-chapter'">
            {{ e?.[chapter] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router'
import { useDateFormat, useNow } from '@vueuse/core'

const getDay = useDateFormat(useNow(), 'ddd')
const route = useRoute()
const event = ref([])

const topic = '__1'
const startEvent = '__2'
const time = '__3'
const speaker = '__4'
const logo = '__5'
const typeEvent = '__6'
const lang = '__7'
const chapter = '__8'

const fetchignData = async (page) => {
  const res = await fetch(`src/mockAPI/report_${page}.json`)
  const data = await res.json()
  event.value = data.filter(e => e[topic] !== 'Наименование события')
}

setInterval(() => {
  fetchignData(route.params.events)
}, 300_000)

watch(() => [route.params.events], newValue => {
  event.value = fetchignData(newValue)
})

const currentTime = ref('')
function updateTime(){
  const date = new Date()
  const hours = date.getHours()
  let minutes = date.getMinutes()
  const day = getDay.value.toUpperCase()
  const dateNow = `${day}, ${hours}:${minutes}`
  currentTime.value = dateNow
}
updateTime()
setInterval(updateTime, 30_000)

function isInTimeRange(startTime, endTime) {
    const now = new Date();
    const start = new Date();
    const end = new Date();
    const [startHour, startMinute] = startTime.split(':');
    start.setHours(startHour, startMinute, 0, 0);
    const [endHour, endMinute] = endTime.split(':');
    end.setHours(endHour, endMinute, 0, 0);

    return now >= start && now <= end;
}


function isMoreTimeRange(startTime, endTime) {
  const now = new Date();
  const start = new Date();
  const [startHour, startMinute] = startTime.split(':');
  start.setHours(startHour, startMinute, 0, 0);

  return now >= start && !isInTimeRange(startTime, endTime)
}

const endEvent = (start, time) => {
  const [hour, minute] = start?.split(':')?.map(Number) || [];
  let newMinute = minute + Number(time);
  let newHour = hour + Math.floor(newMinute / 60);
  newMinute = newMinute % 60;
  if (newHour > 23) {
    newHour = newHour % 24;
  }
  const newStartEvent = `
  ${newHour?.toString()?.padStart(2, '0')}:${newMinute?.toString()?.padStart(2, '0')}`

  return newStartEvent
}

function minutesUntilEnd(endTime) {
  const [hour, minute] = endTime.split(':').map(Number);
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  
  let hoursRemaining = hour - currentHour;
  if (hour < currentHour || (hour === currentHour && minute < currentMinute)) {
    hoursRemaining += 24;
  }

  let minutesRemaining = hoursRemaining * 60 - currentMinute + minute;
  
  return minutesRemaining;
}

</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:slnt,wght@-10..0,100..900&display=swap');

#app {
  max-width: 1080px;
  margin: 0 auto;
  font-family: 'Inter';
}
.section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  &-title {
    font-size: 100px;
    line-height: 121.02px;
  }
  &-time {
    font-size: 60px;
    line-height: 72.61px;
  }
}
.background {
  background: #eee;
  border-radius: 32px;
  padding: 24px;
}
.backgroundCurrent {
  background: #777421;
  border-radius: 32px;
  padding: 24px;
}
.displayNone {
  display: none;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: start;
}
.card {
  display: flex;
  flex-direction: column;
  gap: 30px;
  &-time {
    color: #5E5E5E;
    font-size: 60px;
    line-height: 72.61px;
    font-weight: 700;
    margin-bottom: 30px;
    &__current {
      color: #fff;
    }
  }
  &-speaker {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #5E5E5E;
    font-weight: 500;
    font-size: 28px;
    line-height: 33.89px;
    margin-bottom: 30px;
    &__current {
      color: #fff;
    }
  }
  &-topic {
    color: #5E5E5E;
    font-weight: 700;
    font-size: 48px;
    line-height: 58.09px;
    margin-bottom: 30px;
    &__current {
      color: #fff;
    }
  }
  &-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  &-type, &-lang, &-chapter {
    color: #5E5E5E;
    border: 1px solid #5E5E5E;
    border-radius: 8px;
    padding: 12px;
  }
  &-current {
    color: #fff;
    border: 1px solid #A6D447;
    border-radius: 8px;
    padding: 12px;
  }
  &-hover {
    background: #848484;
    border: none;
    color: #fff;
    &__current {
      background: #F1C658;
      border-radius: 8px;
      padding: 12px;
    }
  }
}
</style>