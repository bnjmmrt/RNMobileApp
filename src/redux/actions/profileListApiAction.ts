import { createBaseApi } from "src/ApiManager/createBaseApi";

export const ProfileListApiAction = createBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchProfileDetails: builder.query({
      query: (id) => ({
        url: `v1/auth/host/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

// Mock data for testing
const mockProfileDetails = {
  data: {
    bio: "A passionate host with a love for art and community.",
    companyLogo: "https://i.imgur.com/Lrupihs.png",
    companyName: "Metropolitan Museum of Art",
    contact: "123-456-7890",
    email: "contact@metmuseum.org",
    eventsPerYear: 20,
    firstName: "John",
    hostSince: "2010",
    id: "host123",
    isMemberFollowingHost: true,
    lastName: "Doe",
    pastEvents: [
      {
        endDate: "2024-01-01",
        id: "event1",
        imageCover: "https://i.imgur.com/kNcVAXN.png",
        imageFlyer: "https://i.imgur.com/uRCbYBj.png",
        name: "Art Exhibition 2023",
        startDate: "2023-12-15"
      },
      {
        endDate: "2023-05-20",
        id: "event2",
        imageCover: "https://i.imgur.com/uRCbYBj.png",
        imageFlyer: "https://i.imgur.com/kNcVAXN.png",
        name: "Spring Gala",
        startDate: "2023-05-10"
      }
    ],
    pendingEvents: [],
    phoneNumber: "987-654-3210",
    referredBy: "Jane Smith",
    socialMedia: {
      facebook: "https://facebook.com/metmuseum",
      instagram: "https://instagram.com/metmuseum",
      linkedin: "https://linkedin.com/company/metmuseum",
      snapchat: "metmuseum_snap",
      tiktok: "https://tiktok.com/@metmuseum",
      x: "https://twitter.com/metmuseum",
      youtube: "https://youtube.com/metmuseum"
    },
    source: 1,
    status: 1,
    totalAttendees: 5000,
    totalEvents: 50,
    totalInfluencerSpend: 10000,
    totalOffersMade: 150,
    upcomingEvents: [
      {
        endDate: "2025-06-01",
        id: "event3",
        imageCover: "https://i.imgur.com/event3cover.png",
        imageFlyer: "https://i.imgur.com/event3flyer.png",
        name: "Summer Art Fiesta",
        startDate: "2025-05-20"
      },
      {
        endDate: "2025-12-25",
        id: "event4",
        imageCover: "https://i.imgur.com/event4cover.png",
        imageFlyer: "https://i.imgur.com/event4flyer.png",
        name: "Winter Wonderland",
        startDate: "2025-12-10"
      }
    ],
    website: "https://www.metmuseum.org"
  },
  error: null,
  status: 1
};

export const {
  useFetchProfileDetailsQuery,
} = ProfileListApiAction;

export { mockProfileDetails };
