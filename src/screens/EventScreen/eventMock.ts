export const event_mock = {
    "data": {
        "admissionType": {
            "description": "VIP and General Admission available",
            "enabled": true,
            "id": "adm_123",
            "name": "VIP & General"
        },
        "ageLimit": {
            "description": "Attendees must be 21+",
            "enabled": true,
            "id": "age_456",
            "maxAge": 60,
            "minAge": 21,
            "name": "21+ Age Restriction"
        },
        "autoPublished": true,
        "capacity": 500,
        "collaborators": [
            {
                "email": "john.doe@example.com",
                "enabled": true,
                "id": "col_789",
                "name": "John Doe"
            }
        ],
        "currentGuestStatus": 250,
        "description": "An exclusive night of music, drinks, and networking.",
        "enabled": true,
        "endDate": "2025-06-15T23:59:00Z",
        "eventType": {
            "description": "Music Concert",
            "enabled": true,
            "id": "evt_101",
            "name": "Concert"
        },
        "featuredEventSection": {
            "id": "sec_001",
            "index": 1,
            "name": "Top Events"
        },
        "furtherInstructions": "Please bring a valid ID for entry.",
        "guestId": "guest_999",
        "guestsCount": 5,
        "id": "event_555",
        "imageCover": "https://example.com/images/event_cover.jpg",
        "imageFlyer": "https://example.com/images/event_flyer.jpg",
        "isPrivate": false,
        "limitOnePlus": 2,
        "location": {
            "city": "Los Angeles",
            "id": "loc_123",
            "latitude": 34.0522,
            "location": "Downtown LA Music Hall",
            "longitude": -118.2437,
            "placeId": "place_456",
            "regionCode": "CA"
        },
        "name": "Summer Vibes Music Festival",
        "owner": {
            "email": "event.organizer@example.com",
            "firstName": "Alice",
            "id": "owner_321",
            "lastName": "Smith",
            "profilePicture": "https://example.com/images/alice_profile.jpg"
        },
        "publishDate": "2025-05-01T12:00:00Z",
        "qrCodeUtilization": 1,
        "quizQuestions": [
            {
                "enabled": true,
                "id": "quiz_001",
                "order": 1,
                "question": "What is your favorite music genre?",
                "required": true
            },
            {
                "enabled": true,
                "id": "quiz_002",
                "order": 2,
                "question": "Who is your band?",
                "required": false
            }
        ],
        "rsvpDeadline": "2025-06-10T23:59:00Z",
        "showLocation": true,
        "startDate": "2025-06-15T18:00:00Z",
        "status": 0,
        "talents": [
            {
                "contact": "dj.spark@example.com",
                "description": "Renowned DJ with a decade of experience.",
                "enabled": true,
                "id": "tal_007",
                "imageKeyUrl": "https://example.com/images/dj_spark.jpg",
                "name": "DJ Spark",
                "socialNetwork": "@djspark"
            }
        ],
        "ticketTypes": [
            {
                "capacity": 300,
                "description": "General Admission",
                "enabled": true,
                "id": "ticket_001",
                "name": "GA Ticket"
            },
            {
                "capacity": 100,
                "description": "VIP Admission with backstage access",
                "enabled": true,
                "id": "ticket_002",
                "name": "VIP Ticket"
            }
        ],
        "useQr": true,
        "userId": "user_888"
    },
    "error": null,
    "status": 200
};
