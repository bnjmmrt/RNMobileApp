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