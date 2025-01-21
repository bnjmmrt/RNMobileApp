// import { useState, useEffect } from 'react';
// import { FlashMessageComponent } from '../../component/FlashMessageComponent/FlashMessageComponent';
// import { useFetchEventsQuery } from '../actions/eventApiAction';

// export const useEvents = (eventId?: string, guestEventStatus?: string) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [eventsData, setEventsData] = useState<any>(null);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchEvents = async () => {
//             if (!eventId || !guestEventStatus) return;

//             try {
//                 setIsLoading(true);
//                 const { data, error, isLoading } = useFetchEventsQuery({ eventId, guestEventStatus });

//                 if (data) {
//                     setEventsData(data);
//                     setError(null);
//                 } else if (error) {
//                     setError('Failed to fetch events.');
//                     FlashMessageComponent.show('error', 'Something went wrong while fetching events!');
//                 }
//             } catch (err) {
//                 setError('An unexpected error occurred.');
//                 FlashMessageComponent.show('error', 'Something went wrong, please try again!');
//                 console.error('Error fetching events:', err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchEvents();
//     }, [eventId, guestEventStatus]);

//     return { eventsData, isLoading, error };
// };
import { useFetchEventsQuery } from '../actions/eventApiAction';
import { FlashMessageComponent } from '../../component/FlashMessageComponent/FlashMessageComponent';

export const useEvents = (eventId?: string, guestEventStatus?: string) => {
    // const { data: eventsData, error, isLoading } = useFetchEventsQuery(
    //     { eventId, guestEventStatus },
    //     { skip: !eventId || !guestEventStatus } // Skip the query if parameters are missing
    // );
     const { data, error, isLoading } = useFetchEventsQuery({ eventId, guestEventStatus });

    // Handle error messaging
    if (error) {
        FlashMessageComponent.show('error', 'Something went wrong while fetching events!');
        console.error('Error fetching events:', error);
    }

    return { data, isLoading, error };
};
