<template>
  <div class="section">
    <h1 class="section-title"> СЕКЦИЯ {{ $route?.params?.events }} </h1>
    <h2 class="section-time">{{ currentTime }}</h2>
  </div>
  <div class="card">
    <div v-for="(e, i) in event" :key="e[topic]">
      <div v-if="i" class="card-time">
        {{ e?.[startEvent] }} -
        {{ endEvent(e?.[startEvent], e?.[time]) }}
      </div>
      <div v-if="i && e[speaker] !== '-'" class="card-speaker">
        <img v-if="e[logo] !== '-'" :src="e?.[logo]" :alt="e?.[logo]" />
        {{ e[speaker] }}
      </div>
      <div v-if="i" class="card-topic">
        {{ e?.[topic] }}
      </div>
      <div v-if="i && e[typeEvent] !== '-'" class="card-footer">
        <div class="card-footer__type card-footer__hover">
            {{ e[typeEvent] }}
        </div> 
        <div class="card-footer__lang">
            {{ e?.[lang] }}
          </div> 
        <div class="card-footer__chapter">
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
  event.value = data
}

watch(() => route.params.events, newValue => {
    event.value = fetchignData(newValue)
    console.log('event', event.value);
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
.card {
  background: #777421;
  border-radius: 32px;
  padding: 24px;
  &-time {
    color: #fff;
    font-size: 60px;
    line-height: 72.61px;
    font-weight: 700;
    margin-bottom: 30px;
}
  &-speaker {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    font-weight: 500;
    font-size: 28px;
    line-height: 33.89px;
    margin-bottom: 30px;
  }
  &-topic {
    color: #fff;
    font-weight: 700;
    font-size: 48px;
    line-height: 58.09px;
    margin-bottom: 30px;
  }
  &-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    &__type, &__lang, &__chapter {
      color: #fff;
      border: 1px solid #A6D447;
      border-radius: 8px;
      padding: 12px;
    }
    &__hover {
      background: #F1C658;
      border: none;
      color: #213477;
    }
  }
}

</style>