export const POST_TAGS = [
  "Confession",
  "Question",
  "Meme",
  "Discussion",
  "Event",
  "Lost & Found",
  "Academics",
  "Hostel",
  "Placement",
  "Club",
  "Sports",
  "Food",
] as const;

export type PostTag = (typeof POST_TAGS)[number];

export const MAX_TAGS = 3;