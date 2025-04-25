const mongoose = require('mongoose');
const Movie = require('./models/Movie');

const mongoURI = 'mongodb://localhost:27017/flickai'; // Use for local MongoDB
// For MongoDB Atlas, use: 'mongodb+srv://flickaiuser:<your-password>@flickaicluster.mongodb.net/flickai?retryWrites=true&w=majority'

const movies = [
  {
    id: 1,
    title: "Inception",
    year: 2010,
    posterUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=1600&auto=format&fit=crop",
    rating: 8.8,
    duration: 148,
    genres: ["Science Fiction", "Action", "Adventure"],
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    language: "English",
    streamingOn: ["Netflix", "HBO Max"],
    isTrending: true
  },
  {
    id: 2,
    title: "Parasite",
    year: 2019,
    posterUrl: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1600&auto=format&fit=crop",
    rating: 8.6,
    duration: 132,
    genres: ["Thriller", "Drama", "Comedy"],
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    language: "Korean",
    streamingOn: ["Hulu", "Amazon Prime"],
    isHiddenGem: true
  },
  {
    id: 3,
    title: "The Godfather",
    year: 1972,
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&auto=format&fit=crop",
    rating: 9.2,
    duration: 175,
    genres: ["Crime", "Drama"],
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    language: "English",
    streamingOn: ["Netflix", "Amazon Prime"],
    isClassic: true
  },
  {
    id: 4,
    title: "The Shawshank Redemption",
    year: 1994,
    posterUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1600&auto=format&fit=crop",
    rating: 9.3,
    duration: 142,
    genres: ["Drama"],
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    language: "English",
    streamingOn: ["HBO Max"],
    isClassic: true
  },
  {
    id: 5,
    title: "Spirited Away",
    year: 2001,
    posterUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1600&auto=format&fit=crop",
    rating: 8.6,
    duration: 125,
    genres: ["Animation", "Adventure", "Family"],
    description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    language: "Japanese",
    streamingOn: ["Netflix", "HBO Max"],
    isHiddenGem: true
  },
  {
    id: 6,
    title: "Interstellar",
    year: 2014,
    posterUrl: "https://images.unsplash.com/photo-1520034475321-cbe63696469e?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1520034475321-cbe63696469e?w=1600&auto=format&fit=crop",
    rating: 8.6,
    duration: 169,
    genres: ["Science Fiction", "Drama", "Adventure"],
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    language: "English",
    streamingOn: ["Netflix", "Amazon Prime"],
    isTrending: true
  },
  {
    id: 7,
    title: "Whiplash",
    year: 2014,
    posterUrl: "https://images.unsplash.com/photo-1502136969935-8d5d16067b3e?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1502136969935-8d5d16067b3e?w=1600&auto=format&fit=crop",
    rating: 8.5,
    duration: 106,
    genres: ["Drama", "Music"],
    description: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    language: "English",
    streamingOn: ["HBO Max", "Hulu"],
    isHiddenGem: true
  },
  {
    id: 8,
    title: "Your Name",
    year: 2016,
    posterUrl: "https://images.unsplash.com/photo-1495562569060-2eec283d3391?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1495562569060-2eec283d3391?w=1600&auto=format&fit=crop",
    rating: 8.4,
    duration: 112,
    genres: ["Animation", "Romance", "Drama"],
    description: "Two teenagers share a profound, magical connection upon discovering they are swapping bodies.",
    language: "Japanese",
    streamingOn: ["Netflix"],
    isHiddenGem: true
  },
  {
    id: 9,
    title: "The Dark Knight",
    year: 2008,
    posterUrl: "https://images.unsplash.com/photo-1604503468502-e2f50df8c3aa?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1604503468502-e2f50df8c3aa?w=1600&auto=format&fit=crop",
    rating: 9.0,
    duration: 152,
    genres: ["Action", "Crime", "Drama"],
    description: "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.",
    language: "English",
    streamingOn: ["Netflix", "Amazon Prime"],
    isClassic: true
  },
  {
    id: 10,
    title: "Coco",
    year: 2017,
    posterUrl: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1600&auto=format&fit=crop",
    rating: 8.4,
    duration: 105,
    genres: ["Animation", "Family", "Fantasy"],
    description: "Aspiring musician Miguel enters the Land of the Dead to find his great-great-grandfather, a legendary singer.",
    language: "English",
    streamingOn: ["Disney+", "Hotstar"],
    isTrending: true
  },
  {
    id: 11,
    title: "Oldboy",
    year: 2003,
    posterUrl: "https://images.unsplash.com/photo-1513282251512-d28492c4cfd8?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1513282251512-d28492c4cfd8?w=1600&auto=format&fit=crop",
    rating: 8.4,
    duration: 120,
    genres: ["Mystery", "Action", "Drama"],
    description: "After being kidnapped and imprisoned for fifteen years, Oh Dae-Su is released, only to find he must find his captor in five days.",
    language: "Korean",
    streamingOn: ["Amazon Prime"],
    isHiddenGem: true
  },
  {
    id: 12,
    title: "WALL·E",
    year: 2008,
    posterUrl: "https://images.unsplash.com/photo-1541959393-6599f317c8f8?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1541959393-6599f317c8f8?w=1600&auto=format&fit=crop",
    rating: 8.4,
    duration: 98,
    genres: ["Animation", "Adventure", "Family"],
    description: "In a distant future, a small waste-collecting robot inadvertently embarks on a space journey that will decide the fate of mankind.",
    language: "English",
    streamingOn: ["Disney+"],
    isClassic: true
  },
  {
    id: 13,
    title: "Dangal",
    year: 2016,
    posterUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=1600&auto=format&fit=crop",
    rating: 8.4,
    duration: 161,
    genres: ["Biography", "Drama", "Sport"],
    description: "Former wrestler Mahavir Singh Phogat trains his daughters Geeta and Babita to become world-class wrestlers.",
    language: "Hindi",
    streamingOn: ["Netflix", "Hotstar"],
    isTrending: true
  },
  {
    id: 14,
    title: "Amélie",
    year: 2001,
    posterUrl: "https://images.unsplash.com/photo-1502136969935-8d5d16067b3e?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1502136969935-8d5d16067b3e?w=1600&auto=format&fit=crop",
    rating: 8.3,
    duration: 122,
    genres: ["Romance", "Comedy"],
    description: "Amélie is an innocent and naive girl in Paris with her own sense of justice.",
    language: "French",
    streamingOn: ["Amazon Prime"],
    isHiddenGem: true
  },
  {
    id: 15,
    title: "1917",
    year: 2019,
    posterUrl: "https://images.unsplash.com/photo-1601597111164-e30b9b185837?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1601597111164-e30b9b185837?w=1600&auto=format&fit=crop",
    rating: 8.3,
    duration: 119,
    genres: ["War", "Drama", "Thriller"],
    description: "Two British soldiers are given a mission to deliver a message deep in enemy territory that will stop 1,600 men from walking into a trap.",
    language: "English",
    streamingOn: ["Amazon Prime", "HBO Max"],
    isTrending: true
  },
  {
    id: 6,
    title: "Super Deluxe",
    year: 2019,
    posterUrl: "https://images.unsplash.com/photo-1581905764498-fb19d45a6867?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1581905764498-fb19d45a6867?w=1600&auto=format&fit=crop",
    rating: 8.4,
    duration: 176,
    genres: ["Drama", "Thriller", "Crime"],
    description: "An unfaithful wife, an estranged father, a priest and an angry boy all face their demons on one fateful day.",
    language: "Tamil",
    streamingOn: ["Netflix", "Hotstar"],
    isHiddenGem: true
  },
  {
    id: 7,
    title: "Run Lola Run",
    year: 1998,
    posterUrl: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=1600&auto=format&fit=crop",
    rating: 8.1,
    duration: 80,
    genres: ["Thriller", "Crime", "Drama"],
    description: "A young woman races against the clock to save her boyfriend from doom, reliving the same 20 minutes over and over.",
    language: "German",
    streamingOn: ["Amazon Prime"],
    isClassic: true
  },
  {
    id: 8,
    title: "Amélie",
    year: 2001,
    posterUrl: "https://images.unsplash.com/photo-1594007651375-7b4dcffb624b?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1594007651375-7b4dcffb624b?w=1600&auto=format&fit=crop",
    rating: 8.3,
    duration: 122,
    genres: ["Romance", "Comedy", "Drama"],
    description: "Amélie is an innocent and naive girl in Paris with her own sense of justice, deciding to help those around her.",
    language: "French",
    streamingOn: ["Netflix"],
    isHiddenGem: true
  },
  {
    id: 9,
    title: "3 Idiots",
    year: 2009,
    posterUrl: "https://images.unsplash.com/photo-1532619675605-1c2f7a47b97d?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1532619675605-1c2f7a47b97d?w=1600&auto=format&fit=crop",
    rating: 8.4,
    duration: 171,
    genres: ["Comedy", "Drama"],
    description: "Two friends are searching for their long-lost companion. They revisit their college days and recall the memories of their friend who inspired them.",
    language: "Hindi",
    streamingOn: ["Amazon Prime", "Netflix"],
    isTrending: true
  },
  {
    id: 10,
    title: "Das Boot",
    year: 1981,
    posterUrl: "https://images.unsplash.com/photo-1611095564983-1d6c1e9d5ee3?w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1611095564983-1d6c1e9d5ee3?w=1600&auto=format&fit=crop",
    rating: 8.3,
    duration: 149,
    genres: ["War", "Drama", "Thriller"],
    description: "The claustrophobic world of a WWII German U-boat; boredom, filth and sheer terror.",
    language: "German",
    streamingOn: ["HBO Max"],
    isClassic: true
  }
  
  
];

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    // Clear existing data
    await Movie.deleteMany({});
    // Insert movies
    await Movie.insertMany(movies);
    console.log('Database seeded with movies');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
  });