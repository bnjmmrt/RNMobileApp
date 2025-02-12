const formatToDeviceTimeZone = (startDateString, endDateString) => {
    const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let startDate, endDate;

    // Helper function to parse "MM/DD/YYYY HH:mm" or standard date format
    const parseDate = (dateString) => {
        if (dateString.includes('/')) {
            const [month, day, yearAndTime] = dateString.split('/');
            const [year, time] = yearAndTime.split(' ');
            const [hour, minute] = time.split(':');
            return new Date(year, month - 1, day, hour, minute);
        } else {
            return new Date(dateString);
        }
    };

    startDate = parseDate(startDateString);
    endDate = parseDate(endDateString);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return ['Invalid date format', ''];
    }

    const optionsDate = {
        timeZone: deviceTimeZone,
        weekday: 'short',
        month: 'long',
        day: 'numeric',
    };

    const optionsTime = {
        timeZone: deviceTimeZone,
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
    };

    const formatterDate = new Intl.DateTimeFormat('en-US', optionsDate);
    const formatterTime = new Intl.DateTimeFormat('en-US', optionsTime);

    const formattedDate = formatterDate.format(startDate);
    const formattedStartTime = formatterTime.format(startDate);
    const formattedEndTime = formatterTime.format(endDate);

    // Extract just the time zone name from formatted time
    const timeZoneName = formattedStartTime.split(' ').pop();

    const formattedTimeRange = `${formattedStartTime.split(' ')[0]} - ${formattedEndTime.split(' ')[0]} ${timeZoneName}`;

    return [formattedDate, formattedTimeRange];
};

export default formatToDeviceTimeZone;
