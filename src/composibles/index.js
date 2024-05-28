export const isInTimeRange = (startTime, endTime) => {
  const now = new Date();
  const start = new Date();
  const end = new Date();
  const [startHour, startMinute] = startTime.split(":");
  start.setHours(startHour, startMinute, 0, 0);
  const [endHour, endMinute] = endTime.split(":");
  end.setHours(endHour, endMinute, 0, 0);

  return now >= start && now <= end;
}

export const isMoreTimeRange = (startTime, endTime) => {
  const now = new Date();
  const start = new Date();
  const [startHour, startMinute] = startTime.split(":");
  start.setHours(startHour, startMinute, 0, 0);

  return now >= start && !isInTimeRange(startTime, endTime);
}

export const endEvent = (start, time) => {
  const [hour, minute] = start?.split(":")?.map(Number) || [];
  let newMinute = minute + Number(time);
  let newHour = hour + Math.floor(newMinute / 60);
  newMinute = newMinute % 60;
  if (newHour > 23) {
    newHour = newHour % 24;
  }
  const newStartEvent = `
${newHour?.toString()?.padStart(2, "0")}:${newMinute
    ?.toString()
    ?.padStart(2, "0")}`;

  return newStartEvent;
};

export const minutesUntilEnd = (endTime) => {
  const [hour, minute] = endTime.split(":").map(Number);
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  let hoursRemaining = hour - currentHour;
  if (hour < currentHour || (hour === currentHour && minute < currentMinute)) {
    hoursRemaining += 24;
  }

  let minutesRemaining = hoursRemaining * 60 - currentMinute + minute;

  return minutesRemaining;
}

export const renderSpeakers = (speakers) => {
  const arr = speakers.split("; ");
  const result = arr.map((item) => {
    const name = item.split(" ")[0];
    const surname = item.split(" ")[1].split("/")[0];
    const job = item.split("/")[1];
    return { name, surname, job };
  });
  return result;
};
