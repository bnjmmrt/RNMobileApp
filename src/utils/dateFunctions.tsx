import moment from 'moment-timezone';

export const formatEventDate = (
  startDate: string,
  endDate: string,
  timeZoneId: string
): string => {
  const start = moment.utc(startDate).tz(timeZoneId);
  const end = moment.utc(endDate).tz(timeZoneId);

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



export const formatDetailedEventDate = (
  startDate: string,
  endDate: string = '',
  timeZoneId: string = Intl.DateTimeFormat().resolvedOptions().timeZone

): string => {
  const parseDate = (dateString: string): moment.Moment | null => {
    if (!dateString) return null;
    if (!dateString.includes('T')) {
      dateString = dateString.replace(' ', 'T').replace('+00', 'Z');
    }
    const date = moment(dateString);
    return date.isValid() ? date : null;
  };

  const start = parseDate(startDate)?.tz(timeZoneId);
  const end = parseDate(endDate)?.tz(timeZoneId);
  const today = moment().tz(timeZoneId).startOf('day');
  const tomorrow = moment().tz(timeZoneId).add(1, 'day').startOf('day');

  if (!start || !end) {
    return 'Invalid date format';
  }

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

export const formatTicketDate = (
  dateString: string,
  timeZone: string
): string => {

  if (!dateString) return 'Invalid date';
  if (!dateString.includes('T')) {
    dateString = dateString.replace(' ', 'T').replace('+00', 'Z');
  }
  const date = moment(dateString);
  if (!date.isValid()) return 'Invalid date';

  const dateInZone = date.tz(timeZone);
  return dateInZone.format('dddd, MMMM Do, hh:mm A z');
};

export const convertUTCToTimeZoneFormat = (
  dateString: string,
  timeZone: string,
  format: string
): string => {
  console.log
  const date = moment.tz(dateString, timeZone);
  return `${date.format(format)}`;
  // if (!dateString.includes('T')) {
  //   dateString = dateString.replace(' ', 'T').replace('+00', 'Z');
  // }
  // const date = moment.utc(dateString).tz(timeZone);
  // if (!date?.isValid()) return 'Invalid date';
  // return date?.format(format);
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
export const timeAgo = (timestamp: any) => {
  const now: any = new Date();
  const past: any = new Date(timestamp);
  const diff = Math.floor((now - past) / 1000); // Difference in seconds

  if (diff < 60) {
    return `${diff}s`;
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}m`;
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h`;
  } else {
    return `${Math.floor(diff / 86400)}d`;
  }
}
export const formatSingleToDeviceTimeZone = (dateString:any) => {
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
