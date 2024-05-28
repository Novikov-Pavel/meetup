<template>
  <div class="flex">
    <router-link :to="{ name:'mainPage', params: { events: '1' } }">
      Page 1
    </router-link>
    <router-link :to="{ name:'mainPage', params: { events: '2' } }">
      Page 2
    </router-link>
    <router-link :to="{ name:'mainPage', params: { events: '3' } }">
      Page 3
    </router-link>
    <router-link :to="{ name:'mainPage', params: { events: '4' } }">
      Page 4
    </router-link>
    <router-link :to="{ name:'mainPage', params: { events: '5' } }">
      Page 5
    </router-link>
  </div>
  <div class="section">
    <h1 class="section-title"> СЕКЦИЯ {{ $route?.params?.events }} </h1>
    <h2 class="section-time">{{ currentTime }}</h2>
  </div>
  <div class="card">
    <div
      v-for="e in event"
      :key="e[topic]"
      :class="[isInTimeRange(e?.[startEvent], endEvent(e?.[startEvent], e?.[time])) ? 'backgroundCurrent' : 'background', isMoreTimeRange(e?.[startEvent], endEvent(e?.[startEvent], e?.[time])) ? 'displayNone' : undefined, { flex: e[speaker] === '-' &&!isMoreTimeRange(e?.[startEvent], endEvent(e?.[startEvent], e?.[time])) }]"  
    >
      <div class="flex">
        <div
          :class="isInTimeRange(e?.[startEvent], endEvent(e?.[startEvent], e?.[time])) ? 'card-time card-time__current' : 'card-time'"
        >
          {{ e?.[startEvent] }} -
          {{ endEvent(e?.[startEvent], e?.[time]) }}
        </div>
        <div
          v-if="isInTimeRange(e?.[startEvent], endEvent(e?.[startEvent], e?.[time])) && e[speaker] !== '-'"
        >
          Осталось {{ minutesUntilEnd(endEvent(e?.[startEvent], e?.[time])) }} мин
        </div>
      </div>
      <div v-if="e[speaker] !== '-'"
        :class="isInTimeRange(e?.[startEvent], endEvent(e?.[startEvent], e?.[time])) ? 'card-speaker card-speaker__current' : 'card-speaker'"
      >
      <div
        v-for="person in renderSpeakers(e[speaker])"
        :key="person.sername"
        class="flex align-items gap-10"
      >
        <img v-if="e[logo] !== '-'" :src="e?.[logo]" :alt="e?.[logo]" />
        <div class="flex column">
          <div>{{ person.name }}</div>
          <div>{{ person.surname }}</div>
          <div>{{ person.job }}</div>
        </div>
      </div>
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
import { topic, chapter, lang, logo, speaker, startEvent, time, typeEvent } from '@/composibles/variables';
import { isInTimeRange, isMoreTimeRange, endEvent, minutesUntilEnd, renderSpeakers } from '@/composibles'

const getDay = useDateFormat(useNow(), 'ddd')
const route = useRoute()
const event = ref([])

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
const updateTime = () => {
  const date = new Date()
  const hours = date.getHours()
  let minutes = date.getMinutes()
  const day = getDay.value.toUpperCase()
  const dateNow = `${day}, ${hours}:${minutes}`
  currentTime.value = dateNow
}
setInterval(updateTime, 30_000)

</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:slnt,wght@-10..0,100..900&display=swap');
body {
  overflow: hidden;
}

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
.align-items {
  align-items: center;
}
.gap-10 {
  gap: 10px;
}
.column {
  flex-direction: column;
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
    justify-content: space-between;
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