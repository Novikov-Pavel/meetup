<template>
  <div class="section">
    <div>СЕКЦИЯ {{ $route?.params?.events }}</div>
    <div>{{ currentTime }}</div>
  </div>
  <div>
    {{ event?.[1]?.['__2'] }} - 
    {{ endEvent(event?.[1]?.['__2'], event?.[1]?.['__3']) }}
  </div>
  <div>{{ event?.[1]?.['__1'] }}</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router'
import { useDateFormat, useNow } from '@vueuse/core'

const getDay = useDateFormat(useNow(), 'ddd')

const route = useRoute()

const event = ref()

const fetchignData = async (page) => {
  const res = await fetch(`src/mockAPI/report_${page}.json`)
  const data = await res.json()
  event.value = data
}

watch(() => route.params.events, newValue => {
    event.value = fetchignData(newValue)
  }
)

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

const endEvent = (startEvent, time) => {
  const [hour, minute] = startEvent?.split(':')?.map(Number);
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

</script>



<style lang="scss">
.section {
  display: flex;
  justify-content: space-between;
}
</style>