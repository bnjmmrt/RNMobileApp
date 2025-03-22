import moment from 'moment-timezone';

const formatToTimeZone = (
  startDateString: string,
  endDateString: string,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
  isRequiredTimeZone: boolean = true
): [string, string] => {
  const parseDate = (dateString: string): moment.Moment | null => {
    if (!dateString) return null;
    if (!dateString.includes('T')) {
      dateString = dateString.replace(' ', 'T').replace('+00', 'Z');
    }
    const date = moment(dateString);
    return date.isValid() ? date : null;
  };

  const startDate = parseDate(startDateString);
  const endDate = parseDate(endDateString);

  if (!startDate || !endDate) {
    return ['Invalid date format', ''];
  }

  const startInZone = startDate.tz(timeZone);
  const endInZone = endDate.tz(timeZone);

  let formattedDate: string;
  if (startInZone.isSame(endInZone, 'day')) {
    formattedDate = startInZone.format('ddd, MMM D');
  } else {
    formattedDate = `${startInZone.format('ddd, MMM D')} – ${endInZone.format('ddd, MMM D')}`;
  }

  const formattedStartTime = startInZone.format('h:mm A');
  const formattedEndTime = endInZone.format('h:mm A');
  const abbreviation = startInZone.format('z'); // This gives IST, PST, etc.

  let formattedTimeRange = `${formattedStartTime} - ${formattedEndTime}`;
  if (isRequiredTimeZone) {
    formattedTimeRange += ` ${abbreviation}`;
  }

  return [formattedDate, formattedTimeRange];
};

export default formatToTimeZone;
