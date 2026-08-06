// Services for Community Module localStorage persistence
const POSTS_KEY = "voiceOfStrayCommunityPosts";
const SAVED_KEY = "voiceOfStraySavedPosts";

// Default Seed Posts matching prototype
const DEFAULT_POSTS = [
  {
    id: "POST-DEFAULT-1",
    authorName: "Sarah Jenkins",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
    authorRole: "Volunteer",
    description: "Found this little guy hiding under a car during the rain. He's safe now and eating well! If anyone recognizes him, please let me know. We are calling him Max for now. 🐶🌧️ #StrayRescue #DogRescue",
    category: "Rescue",
    images: ["https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800"],
    location: "Downtown Park",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    likes: 245,
    likedBy: [],
    comments: [
      {
        commentId: "COM-DEFAULT-1",
        author: "Animal Rescue Squad",
        avatar: "https://ui-avatars.com/api/?name=Animal+Rescue&background=3b82f6&color=fff",
        role: "Volunteer",
        text: "Thank you for saving him! Let me know if you need dog food.",
        timestamp: Date.now() - 1.5 * 60 * 60 * 1000
      }
    ],
    savedBy: [],
    createdBy: "Sarah Jenkins"
  },
  {
    id: "POST-DEFAULT-2",
    authorName: "Animal Hope NGO",
    authorAvatar: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=100",
    authorRole: "NGO",
    description: "Our weekly feeding drive was a huge success! We fed over 150 strays today. A big shoutout to our volunteers who made this happen. Join us next week! 🐾🍲",
    category: "Feeding",
    images: ["https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400"],
    location: "Westside Shelter",
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    likes: 890,
    likedBy: [],
    comments: [],
    savedBy: [],
    createdBy: "Animal Hope NGO"
  },
  {
    id: "POST-DEFAULT-3",
    authorName: "Priya Sharma",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    authorRole: "User",
    description: "We are urgently looking for a temporary foster home for a mother dog and her 3 newborn puppies! 🐶🏠 The shelter is currently full. We will provide all food and medical supplies. Please DM me if you can help!",
    category: "Adoption",
    images: [],
    location: "Northside Foster Care",
    timestamp: Date.now() - 8 * 60 * 60 * 1000,
    likes: 432,
    likedBy: [],
    comments: [],
    savedBy: [],
    createdBy: "Priya Sharma"
  }
];

/**
 * Load posts from localStorage or seed defaults if empty
 */
export function getPosts() {
  const postsRaw = localStorage.getItem(POSTS_KEY);
  if (!postsRaw) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(DEFAULT_POSTS));
    return DEFAULT_POSTS;
  }
  try {
    const posts = JSON.parse(postsRaw);
    if (!Array.isArray(posts) || posts.length === 0) {
      localStorage.setItem(POSTS_KEY, JSON.stringify(DEFAULT_POSTS));
      return DEFAULT_POSTS;
    }
    return posts;
  } catch (e) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(DEFAULT_POSTS));
    return DEFAULT_POSTS;
  }
}

/**
 * Save posts to localStorage
 */
export function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

/**
 * Load saved post IDs
 */
export function getSavedPosts() {
  const savedRaw = localStorage.getItem(SAVED_KEY);
  if (!savedRaw) return [];
  try {
    return JSON.parse(savedRaw);
  } catch (e) {
    return [];
  }
}

/**
 * Save saved post IDs
 */
export function saveSavedPosts(savedIds) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(savedIds));
}

/**
 * Load logged in user information
 */
export function getCurrentUser() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    return {
      name: "Arjun",
      avatar: "https://ui-avatars.com/api/?name=Arjun&background=f97316&color=fff",
      role: "Volunteer"
    };
  }

  const username = localStorage.getItem("username") || "Arjun";
  const role = localStorage.getItem("role") || "user";
  const avatarUrl = localStorage.getItem("avatarUrl") || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=f97316&color=fff&bold=true`;
  
  let displayRole = 'User';
  if (role === 'ngo') {
    displayRole = 'NGO';
  } else if (role === 'user') {
    try {
      const volMeta = JSON.parse(localStorage.getItem("voiceOfStrayVolunteer") || "{}");
      if (volMeta.status === "Approved Volunteer") {
        displayRole = volMeta.role && volMeta.role.includes("Rescue") ? "Rescuer" : "Volunteer";
      }
    } catch (e) {}
  }

  return {
    name: username,
    avatar: avatarUrl,
    role: displayRole
  };
}
