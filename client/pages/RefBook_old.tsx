import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Star, ShoppingCart } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  rating: number;
  reviews: number;
  price?: number;
  cover: string;
  image?: string;
  userRating?: number;
}

const motivationalMessages = [
  {
    title: "Find out the best books to read when you don't even know what to read!!!",
    description: "Discover your next favorite book from our curated collection.",
  },
  {
    title: "Every book is a door to a new world!",
    description: "Explore diverse genres and expand your knowledge.",
  },
  {
    title: "Reading is the best investment you can make!",
    description: "Invest in yourself by reading great books today.",
  },
  {
    title: "Get lost in a good book!",
    description: "Find stories that inspire, educate, and entertain.",
  },
  {
    title: "Knowledge is power, and books are the key!",
    description: "Unlock your potential through reading.",
  },
];

export default function RefBook() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [books, setBooks] = useState<Book[]>([
    {
      id: "1",
      title: "HOOKED: How to...",
      author: "Nir Eyal",
      category: "Psychology",
      rating: 4.5,
      reviews: 234,
      cover: "bg-yellow-300",
      image: "https://images.unsplash.com/photo-1516979187457-635ffe35ff15?w=300&h=400&fit=crop",
    },
    {
      id: "2",
      title: "UX Design Process...",
      author: "Josh Haze",
      category: "Design",
      rating: 4.8,
      reviews: 156,
      cover: "bg-blue-500",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=400&fit=crop",
    },
    {
      id: "3",
      title: "Design Thinking",
      author: "Unknown",
      category: "Design",
      rating: 4.6,
      reviews: 89,
      cover: "bg-gray-400",
      image: "https://images.unsplash.com/photo-1571207417996-4b97a78bff91?w=300&h=400&fit=crop",
    },
    {
      id: "4",
      title: "The Innovator's...",
      author: "Unknown",
      category: "Business",
      rating: 4.7,
      reviews: 204,
      cover: "bg-gray-600",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=300&h=400&fit=crop",
    },
    {
      id: "5",
      title: "Lean UX: Applying...",
      author: "Josh Haze",
      category: "Design",
      rating: 4.4,
      reviews: 123,
      cover: "bg-yellow-400",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=400&fit=crop",
    },
    {
      id: "6",
      title: "Lean UX: Applying...",
      author: "Josh Haze",
      category: "Design",
      rating: 4.3,
      reviews: 98,
      cover: "bg-orange-400",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
    },
    {
      id: "7",
      title: "The Fire Runner",
      author: "Unknown",
      category: "Fiction",
      rating: 4.6,
      reviews: 145,
      cover: "bg-indigo-500",
      image: "https://images.unsplash.com/photo-1495446815901-a7297e61a87d?w=300&h=400&fit=crop",
    },
    {
      id: "8",
      title: "Ghost Runners",
      author: "Unknown",
      category: "Fiction",
      rating: 4.5,
      reviews: 167,
      cover: "bg-red-600",
      image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop",
    },
    {
      id: "9",
      title: "The Eve Runner",
      author: "Unknown",
      category: "Science",
      rating: 4.7,
      reviews: 201,
      cover: "bg-blue-400",
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=400&fit=crop",
    },
    {
      id: "10",
      title: "Learning Time",
      author: "Unknown",
      category: "Education",
      rating: 4.6,
      reviews: 134,
      cover: "bg-cyan-400",
      image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop",
    },
    {
      id: "11",
      title: "Good Company",
      author: "Unknown",
      category: "Business",
      rating: 4.8,
      reviews: 178,
      cover: "bg-green-600",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=400&fit=crop",
    },
    {
      id: "12",
      title: "Father of the Rain",
      author: "Unknown",
      category: "Fiction",
      rating: 4.5,
      reviews: 112,
      cover: "bg-purple-400",
      image: "https://images.unsplash.com/photo-1495446815901-a7297e61a87d?w=300&h=400&fit=crop",
    },
  ]);

  const categories = [
    "All",
    "Design",
    "Psychology",
    "Business",
    "Fiction",
    "Science",
    "Education",
  ];

  // Rotate motivational messages every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % motivationalMessages.length);
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, []);

  const currentMessage = motivationalMessages[currentMessageIndex];

  const filteredBooks =
    selectedCategory === "All"
      ? books
      : books.filter((book) => book.category === selectedCategory);

  const handleRateBook = (bookId: string, rating: number) => {
    setBooks(
      books.map((book) =>
        book.id === bookId ? { ...book, userRating: rating } : book
      )
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <Header isLoggedIn={true} showNav={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Motivational Banner */}
        <div className="mb-12 rounded-3xl overflow-hidden bg-gradient-to-br from-pink-500 via-pink-400 to-orange-500 dark:from-pink-700 dark:via-pink-600 dark:to-orange-700 p-12 md:p-16 shadow-2xl relative group">
          {/* Animated gradient background overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Decorative animated elements - Left side */}
          <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-br from-green-300 to-green-400 rounded-2xl opacity-20 blur-lg animate-pulse" />
          <div className="absolute top-8 left-8 w-20 h-20 bg-green-300 rounded-xl opacity-30 transform -rotate-45 animate-spin" style={{ animationDuration: '8s' }} />
          
          {/* Decorative animated elements - Right side */}
          <div className="absolute top-20 right-20 w-32 h-32 border-4 border-cyan-300/30 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute bottom-10 right-10 w-28 h-28 bg-cyan-400/20 rounded-3xl transform rotate-45 animate-bounce" style={{ animationDuration: '4s' }} />
          
          {/* Center circle animation */}
          <div className="absolute top-1/2 left-1/3 w-48 h-48 border-2 border-white/10 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10 min-h-64">
            <div className="text-white flex flex-col justify-between h-full">
              {/* Decorative top accent */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <div className="w-12 h-1 bg-gradient-to-r from-white to-white/30 rounded-full" />
              </div>
              
              <div className="min-h-48">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight transition-all duration-500 ease-in-out opacity-100 transform bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent line-clamp-3">
                  {currentMessage.title}
                </h2>
                
                <p className="text-white/95 text-base md:text-lg font-medium transition-all duration-500 ease-in-out leading-relaxed line-clamp-2">
                  {currentMessage.description}
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex justify-center items-center relative h-full">
              {/* Animated book emoji with floating effect */}
              <div className="relative w-56 h-56">
                {/* Rotating outer circle */}
                <div className="absolute inset-0 border-3 border-white/20 rounded-full animate-spin" style={{ animationDuration: '15s' }} />
                
                {/* Pulsing middle circle */}
                <div className="absolute top-6 left-6 right-6 bottom-6 border-2 border-white/30 rounded-full animate-pulse" />
                
                {/* Main book emoji with floating animation */}
                <div className="absolute inset-0 flex items-center justify-center animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="text-9xl drop-shadow-2xl filter transform hover:scale-110 transition-transform duration-300">📚</div>
                </div>
                
                {/* Decorative colored squares (like the design) */}
                <div className="absolute top-8 left-8 w-16 h-16 bg-gradient-to-br from-green-300 to-green-400 rounded-lg opacity-40 transform -rotate-12 animate-pulse" />
                <div className="absolute top-16 right-8 w-12 h-12 bg-cyan-400 rounded-lg opacity-50 transform rotate-12 animate-bounce" style={{ animationDuration: '4s' }} />
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
          
          {/* Bottom decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Browse by Category</h2>
          <div className="flex gap-3 overflow-x-auto pb-4 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#7a4bf4] to-[#9a6bff] text-white shadow-md"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            {selectedCategory === "All" ? "All Books" : selectedCategory} Books
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden hover:shadow-xl transition group"
              >
                {/* Book Cover */}
                <div
                  className="aspect-[3/4] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition bg-cover bg-center"
                  style={{
                    backgroundImage: book.image ? `url('${book.image}')` : "none",
                  }}
                >
                  {!book.image ? (
                    <div className={`w-full h-full ${book.cover} flex items-center justify-center`}>
                      <div className="text-white opacity-40 text-center px-4">
                        <p className="text-xs font-bold">{book.title}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                      <p className="text-white text-xs font-bold line-clamp-2">{book.title}</p>
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-4">
                  <h3 className="font-bold text-sm line-clamp-2 mb-1 text-slate-900 dark:text-white">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{book.author}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handleRateBook(book.id, i + 1)}
                          className="text-yellow-400 hover:text-yellow-500 transition"
                        >
                          <Star
                            size={14}
                            fill={
                              (book.userRating || book.rating) >= i + 1
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 ml-auto">
                      {book.rating}
                    </span>
                  </div>

                  {/* Reviews count */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {book.reviews} reviews
                  </p>

                  {/* View button */}
                  <button className="w-full bg-gradient-to-r from-[#7a4bf4] to-[#9a6bff] text-white py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition flex items-center justify-center gap-2">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center py-8">
          <button className="border-2 border-[#7a4bf4] text-[#7a4bf4] dark:border-[#9a6bff] dark:text-[#9a6bff] px-12 py-3 rounded-lg font-semibold hover:bg-gradient-to-r hover:from-[#7a4bf4] hover:to-[#9a6bff] hover:text-white transition">
            Load More Books
          </button>
        </div>
      </div>

      {/* Decorative wave footer */}
      <div className="relative h-32 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden mt-16 bg-gradient-to-br from-[#7a4bf4] via-[#9a6bff] to-purple-600">
        <svg
          className="absolute bottom-0 left-0 w-full h-full opacity-20"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            d="M0,64L120,69.3C240,75,480,85,720,80C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
