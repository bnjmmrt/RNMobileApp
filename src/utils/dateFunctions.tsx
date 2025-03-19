import moment from 'moment';

export const formatEventDate = (startDate: string, endDate: string) => {
  const start = moment.utc(startDate).local();
  const end = moment.utc(endDate).local();

  const startMonth = start.format('MMM');
  const endMonth = end.format('MMM');
  const startDay = start.format('D');
  const endDay = end.format('D');
  const time = start.format('h:mm A');

  if (start.isSame(end, 'day')) {
    return `${startMonth} ${startDay}, ${time}`;
  } else if (start.isSame(end, 'month')) {
    return `${startMonth} ${startDay}–${endDay}, ${time}`;
  } else {
    return `${startMonth} ${startDay}–${endMonth} ${endDay}, ${time}`;
  }
};


export const formatDetailedEventDate = (startDate: string, endDate: string = '') => {
  const start = moment.utc(startDate).local();
  const end = moment.utc(endDate).local();
  const today = moment().startOf('day');
  const tomorrow = moment().add(1, 'day').startOf('day');

  const startFormat = start.format('ddd, MMM D');
  const endFormat = end.format('ddd, MMM D');
  const startTime = start.format('h:mm A');
  const endTime = end.format('h:mm A');

  if (start.isSame(today, 'day')) {
    return `Today, ${startTime} – ${endTime}`;
  } else if (start.isSame(tomorrow, 'day')) {
    return `Tomorrow, ${startTime} – ${endTime}`;
  } else if (!start.isSame(end, 'day')) {
    return `${startFormat}, ${startTime} – ${endFormat}, ${endTime}`;
  } else {
    return `${startFormat}, ${startTime} – ${endTime}`;
  }
};

export const formatViewAnnouncementDate = (startDate: string) => {
  const start = moment.utc(startDate).local();
  const today = moment().startOf('day');
  const tomorrow = moment().add(1, 'day').startOf('day');

  const startFormat = start.format('ddd, MMM D');
  const startTime = start.format('h:mm A');

  if (start.isSame(today, 'day')) {
    return `Today, ${startTime}`;
  } else if (start.isSame(tomorrow, 'day')) {
    return `Tomorrow, ${startTime}`;
  } else {
    return `${startFormat}, ${startTime}`;
  }
};
export const formatSingleToDeviceTimeZone = (dateString) => {
  if (!dateString) return 'Invalid date';

  const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Convert "YYYY-MM-DD HH:mm:ss+00" → "YYYY-MM-DDTHH:mm:ssZ" for correct parsing
  if (!dateString.includes('T')) {
    dateString = dateString.replace(' ', 'T').replace('+00', 'Z');
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  const options = {
    timeZone: deviceTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(date);

  let month, day, year, hour, minute, second, period, timeZone;
  parts.forEach(({ type, value }) => {
    if (type === 'month') month = value;
    if (type === 'day') day = value;
    if (type === 'year') year = value;
    if (type === 'hour') hour = value.padStart(2, '0');
    if (type === 'minute') minute = value.padStart(2, '0');
    if (type === 'second') second = value.padStart(2, '0');
    if (type === 'dayPeriod') period = value;
    if (type === 'timeZoneName') timeZone = value;
  });

  return `${month}/${day}/${year} ${hour}:${minute} ${period} ${timeZone}`;
};
