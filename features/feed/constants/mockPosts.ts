import { Post } from "../types/post";

export const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      id: "user-1",
      username: "Anonymous Owl",
      year: "3rd Year",
    },
    content:
      "What's the best place to study on campus after 10 PM? The library closes too early, and I need somewhere quiet before midsems.",
    createdAt: "2h ago",
    stats: {
      upvotes: 128,
      comments: 34,
      shares: 8,
      bookmarks: 21,
    },
    userInteraction: {
      upvoted: false,
      bookmarked: false,
    },
    tags: ["Study", "Campus"],
  },
  {
    id: "2",
    author: {
      id: "user-2",
      username: "Anonymous Fox",
      year: "2nd Year",
    },
    content:
      "Can someone recommend electives that are actually interesting and don't have crazy workloads? Looking for something practical.",
    createdAt: "5h ago",
    stats: {
      upvotes: 96,
      comments: 41,
      shares: 5,
      bookmarks: 18,
    },
    userInteraction: {
      upvoted: true,
      bookmarked: false,
    },
    tags: ["Academics"],
  },
  {
    id: "3",
    author: {
      id: "user-3",
      username: "Anonymous Panda",
      year: "4th Year",
    },
    content:
      "Who's coming to the coding hackathon this weekend? Thinking of forming a team for web development + AI.",
    createdAt: "Yesterday",
    event: {
      title: "Campus Hackathon",
      date: "Saturday, 10:00 AM",
      location: "Innovation Lab",
    },
    stats: {
      upvotes: 212,
      comments: 67,
      shares: 24,
      bookmarks: 49,
    },
    userInteraction: {
      upvoted: false,
      bookmarked: true,
    },
    tags: ["Hackathon", "Events"],
  },
  {
    id: "4",
    author: {
      id: "user-4",
      username: "Anonymous Wolf",
      year: "1st Year",
    },
    content:
      "Which hostel mess is serving the best food this week? I don't mind walking if it's worth it 😅",
    createdAt: "1d ago",
    stats: {
      upvotes: 184,
      comments: 59,
      shares: 3,
      bookmarks: 14,
    },
    userInteraction: {
      upvoted: false,
      bookmarked: false,
    },
    tags: ["Hostel", "Food"],
  },
  {
    id: "5",
    author: {
      id: "user-5",
      username: "Anonymous Falcon",
      year: "Final Year",
    },
    content:
      "Placement season is getting stressful. How's everyone preparing for DSA and system design interviews?",
    createdAt: "2d ago",
    stats: {
      upvotes: 301,
      comments: 88,
      shares: 17,
      bookmarks: 62,
    },
    userInteraction: {
      upvoted: true,
      bookmarked: true,
    },
    tags: ["Placements", "DSA"],
  },
  {
    id: "6",
    author: {
      id: "user-6",
      username: "Anonymous Koala",
      year: "3rd Year",
    },
    content:
      "Poll time! Which campus event should Buzz cover first?",
    createdAt: "3d ago",
    poll: {
      question: "Which event are you most excited for?",
      options: [
        {
          id: "1",
          text: "Hackathon",
          votes: 124,
        },
        {
          id: "2",
          text: "Cultural Fest",
          votes: 173,
        },
        {
          id: "3",
          text: "Sports Meet",
          votes: 89,
        },
      ],
    },
    stats: {
      upvotes: 143,
      comments: 22,
      shares: 9,
      bookmarks: 11,
    },
    userInteraction: {
      upvoted: false,
      bookmarked: false,
    },
    tags: ["Poll"],
  },
];