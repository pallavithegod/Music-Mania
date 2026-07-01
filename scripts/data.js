export const navItems = [
  { id: "home", label: "Home", icon: "home" },
  { id: "browse", label: "Browse", icon: "spark" },
  { id: "library", label: "Library", icon: "library" },
  { id: "search", label: "Search", icon: "search" },
  { id: "settings", label: "Settings", icon: "settings" }
];

export const integrationNotes = {
  storage: "S3-ready audioUrl/artworkUrl fields are represented as plain strings.",
  metadata: "DynamoDB-ready ids, slugs, artists, albums, playlist relations, and track rows are normalized.",
  auth: "Cognito-ready preferences and profile state are isolated from rendering concerns."
};

export const artists = [
  {
    id: "maya-skye",
    name: "Maya Skye",
    genre: "Alt Pop",
    followers: "3.8M",
    image: "",
    art: "linear-gradient(135deg, #fa233b, #ff9f0a 48%, #1d1d1f)",
    bio: "Polished pop textures, velvet hooks, and late-night synths shaped for headphone listening."
  },
  {
    id: "nolan-river",
    name: "Nolan River",
    genre: "Indie Soul",
    followers: "1.6M",
    image: "",
    art: "linear-gradient(135deg, #0071e3, #34c759 52%, #f5f5f7)",
    bio: "Warm falsetto, live bass lines, and intimate arrangements with a bright studio finish."
  },
  {
    id: "luna-vale",
    name: "Luna Vale",
    genre: "Electronic",
    followers: "2.4M",
    image: "",
    art: "linear-gradient(135deg, #5856d6, #00c7be 48%, #111113)",
    bio: "Cinematic club music with glassy arps, deep kicks, and skyline-sized choruses."
  },
  {
    id: "atlas-north",
    name: "Atlas North",
    genre: "Ambient",
    followers: "980K",
    image: "",
    art: "linear-gradient(135deg, #8e8e93, #34c759 50%, #f2f2f7)",
    bio: "Slow-burning instrumentals for focused mornings and drifting evenings."
  }
];

export const albums = [
  {
    id: "afterglow-city",
    title: "Afterglow City",
    artistId: "maya-skye",
    year: 2026,
    type: "Album",
    color: "linear-gradient(135deg, #fa233b, #fb5c74 42%, #1d1d1f)",
    cover: "",
    description: "A glossy, romantic pop record built from neon bass, close vocals, and crisp percussion."
  },
  {
    id: "honey-moonline",
    title: "Honey Moonline",
    artistId: "nolan-river",
    year: 2025,
    type: "Album",
    color: "linear-gradient(135deg, #ff9f0a, #ffd60a 45%, #1d1d1f)",
    cover: "",
    description: "Soulful, sunlit grooves with patient hooks and soft analog haze."
  },
  {
    id: "signal-bloom",
    title: "Signal Bloom",
    artistId: "luna-vale",
    year: 2026,
    type: "EP",
    color: "linear-gradient(135deg, #0071e3, #00c7be 48%, #111113)",
    cover: "",
    description: "Five radiant electronic cuts that move from quiet pulse to full-room lift."
  },
  {
    id: "northern-room",
    title: "Northern Room",
    artistId: "atlas-north",
    year: 2024,
    type: "Album",
    color: "linear-gradient(135deg, #34c759, #8e8e93 52%, #f5f5f7)",
    cover: "",
    description: "Minimal piano motifs, softened field recordings, and patient ambient space."
  },
  {
    id: "velvet-hour",
    title: "Velvet Hour",
    artistId: "maya-skye",
    year: 2025,
    type: "Single",
    color: "linear-gradient(135deg, #bf5af2, #fa233b 55%, #1d1d1f)",
    cover: "",
    description: "A focused single with a huge chorus and polished late-night shimmer."
  }
];

export const tracks = [
  {
    id: "t1",
    title: "Electric Violet",
    artistId: "maya-skye",
    albumId: "afterglow-city",
    duration: 214,
    explicit: false,
    audioUrl: "assets/audio/electric-violet.mp3",
    lyrics: ["We move where the city glows", "Every window turns to gold", "Hold the beat and let it breathe", "After midnight, afterglow"]
  },
  {
    id: "t2",
    title: "Soft Signal",
    artistId: "maya-skye",
    albumId: "afterglow-city",
    duration: 187,
    explicit: false,
    audioUrl: "assets/audio/soft-signal.mp3",
    lyrics: ["Send a soft signal", "Through the static in the room", "I can hear it clearer", "When the red lights bloom"]
  },
  {
    id: "t3",
    title: "Glass Avenue",
    artistId: "maya-skye",
    albumId: "afterglow-city",
    duration: 231,
    explicit: false,
    audioUrl: "assets/audio/glass-avenue.mp3",
    lyrics: ["Glass avenue, silver rain", "Every turn remembers your name", "Step by step the skyline sings", "Tiny halos, brighter things"]
  },
  {
    id: "t4",
    title: "Honeyline",
    artistId: "nolan-river",
    albumId: "honey-moonline",
    duration: 203,
    explicit: false,
    audioUrl: "assets/audio/honeyline.mp3",
    lyrics: ["Sweet line on the radio", "Windows down and moving slow", "Every chord is warm and wide", "Honeyline on the other side"]
  },
  {
    id: "t5",
    title: "Sunday Copper",
    artistId: "nolan-river",
    albumId: "honey-moonline",
    duration: 242,
    explicit: false,
    audioUrl: "assets/audio/sunday-copper.mp3",
    lyrics: ["Sunday copper in the light", "Kitchen records spinning right", "All the quiet we can keep", "All the blue beneath the beat"]
  },
  {
    id: "t6",
    title: "Bloom Driver",
    artistId: "luna-vale",
    albumId: "signal-bloom",
    duration: 196,
    explicit: false,
    audioUrl: "assets/audio/bloom-driver.mp3",
    lyrics: ["Bloom driver, pulse higher", "Turn the room into a wire", "Every shadow comes alive", "Every second learns to fly"]
  },
  {
    id: "t7",
    title: "Prism Gate",
    artistId: "luna-vale",
    albumId: "signal-bloom",
    duration: 218,
    explicit: false,
    audioUrl: "assets/audio/prism-gate.mp3",
    lyrics: ["Meet me at the prism gate", "Where the bass lines calibrate", "Color spills across the floor", "Open, open, evermore"]
  },
  {
    id: "t8",
    title: "North Window",
    artistId: "atlas-north",
    albumId: "northern-room",
    duration: 276,
    explicit: false,
    audioUrl: "assets/audio/north-window.mp3",
    lyrics: ["North window, quiet snow", "All the morning moving slow", "Hold a note and let it fade", "Light arrives where silence stayed"]
  },
  {
    id: "t9",
    title: "Velvet Hour",
    artistId: "maya-skye",
    albumId: "velvet-hour",
    duration: 205,
    explicit: false,
    audioUrl: "assets/audio/velvet-hour.mp3",
    lyrics: ["Velvet hour on the line", "Your silhouette close to mine", "Every heartbeat finds the drum", "Every ending just begun"]
  }
];

export const playlists = [
  {
    id: "new-wave-now",
    title: "New Wave Now",
    description: "Fresh pop, electronic, and soul picks with high replay energy.",
    trackIds: ["t1", "t6", "t4", "t9", "t7"]
  },
  {
    id: "evening-focus",
    title: "Evening Focus",
    description: "Clean textures and low-friction grooves for deep work.",
    trackIds: ["t8", "t2", "t5", "t7"]
  },
  {
    id: "made-for-you",
    title: "Made for You",
    description: "A personal mix based on recent plays and saved albums.",
    trackIds: ["t3", "t4", "t1", "t8", "t6"]
  }
];

export const featured = {
  heroAlbumId: "afterglow-city",
  browse: ["afterglow-city", "signal-bloom", "honey-moonline", "northern-room"],
  recentlyPlayed: ["t1", "t6", "t4", "t8"]
};
