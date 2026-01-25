import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import { Star, ShoppingCart } from "lucide-react";

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function fallbackCoverDataUrl(title: string, author?: string) {
  const safeTitle = escapeXml(title);
  const safeAuthor = author ? escapeXml(author) : "";
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#312e81"/>
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#g)"/>
  <rect x="40" y="40" width="520" height="720" rx="28" fill="rgba(255,255,255,0.06)"/>
  <text x="70" y="160" fill="#ffffff" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="44" font-weight="800">
    <tspan x="70" dy="0">${safeTitle}</tspan>
  </text>
  ${
    safeAuthor
      ? `<text x="70" y="240" fill="rgba(255,255,255,0.85)" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="26" font-weight="600">by ${safeAuthor}</text>`
      : ""
  }
  <text x="70" y="720" fill="rgba(255,255,255,0.65)" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="18" font-weight="600">
    Cover unavailable
  </text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function BookCoverImage({
  title,
  author,
  src,
  className,
}: {
  title: string;
  author?: string;
  src?: string;
  className?: string;
}) {
  const fallback = useMemo(() => fallbackCoverDataUrl(title, author), [title, author]);
  const [imgSrc, setImgSrc] = useState<string>(src || fallback);

  useEffect(() => {
    setImgSrc(src || fallback);
  }, [src, fallback]);

  return (
    <img
      src={imgSrc}
      alt={`${title} cover`}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setImgSrc(fallback)}
      className={className}
    />
  );
}

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
  summary?: string;
  pages?: number;
  publisher?: string;
  year?: number;
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
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
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
      summary: "Learn the model that moves your users to action. Hooked reveals how some of the world's most habit-forming products manipulate our psychology to drive us toward them. This groundbreaking book explores the psychology of why we develop habits and how companies leverage this knowledge to create engaging products.",
      pages: 256,
      publisher: "Penguin Publishing",
      year: 2014,
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
      summary: "A comprehensive guide to modern UX design methodologies. This book covers the entire design process from research to implementation with real-world examples. Perfect for designers looking to master user-centered design principles.",
      pages: 384,
      publisher: "Design Publications",
      year: 2019,
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
      summary: "Explore the innovative problem-solving methodology that's revolutionizing businesses worldwide. Learn how to apply design thinking principles to tackle complex challenges. This book provides practical frameworks and case studies.",
      pages: 320,
      publisher: "Innovation Press",
      year: 2018,
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
      summary: "Discover why great companies fail and how to build lasting disruptive businesses. Essential reading for entrepreneurs and business leaders. The book examines the challenges of innovation and provides strategies for staying competitive.",
      pages: 432,
      publisher: "Business Press",
      year: 2011,
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
      summary: "Apply Lean principles to UX design. Learn how to get out of the building and test your assumptions with real users to create products people want. This practical guide combines agile methodology with user experience design.",
      pages: 280,
      publisher: "Design Publications",
      year: 2017,
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
      summary: "A deep dive into agile UX practices and lean methodologies. Understand how to work efficiently with development teams while maintaining design excellence. Learn collaboration strategies that improve product outcomes.",
      pages: 296,
      publisher: "Design Publications",
      year: 2016,
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
      summary: "An epic tale of adventure and courage. Follow the journey of a young protagonist as they navigate a world filled with mystery, danger, and unexpected alliances. A thrilling story that will keep you engaged until the very end.",
      pages: 445,
      publisher: "Fiction Press",
      year: 2020,
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
      summary: "A thrilling mystery set in a post-apocalyptic world. Uncover the secrets of the ghost runners and their mission to save humanity from extinction. Packed with action, suspense, and emotional depth.",
      pages: 389,
      publisher: "Fiction Press",
      year: 2021,
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
      summary: "Explore fascinating scientific concepts wrapped in an engaging narrative. Discover the origins of consciousness and the future of artificial intelligence. A mind-bending exploration of what it means to be human.",
      pages: 512,
      publisher: "Science Press",
      year: 2022,
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
      summary: "Master modern learning techniques and strategies for effective education. This book covers neuroscience-backed methods to accelerate learning and retention. Perfect for students and educators alike.",
      pages: 356,
      publisher: "Education Press",
      year: 2021,
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
      summary: "Build a company culture that attracts and retains top talent. Learn the principles of exceptional leadership and organizational excellence. This book combines research with practical advice for modern leaders.",
      pages: 401,
      publisher: "Business Press",
      year: 2019,
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
      summary: "A poignant family drama that explores relationships, redemption, and the power of forgiveness. A deeply moving story that will stay with you long after reading. Beautifully written with unforgettable characters.",
      pages: 368,
      publisher: "Fiction Press",
      year: 2018,
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

      {/* Modal for book details */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Close button */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Book Details</h1>
              <button
                onClick={() => setSelectedBook(null)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Book header */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Book cover */}
                <div>
                  <div
                    className={`aspect-[3/4] rounded-lg overflow-hidden shadow-lg relative ${selectedBook.cover}`}
                  >
                    <BookCoverImage
                      title={selectedBook.title}
                      author={selectedBook.author}
                      src={selectedBook.image}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>
                </div>

                {/* Book info */}
                <div className="md:col-span-2">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                    {selectedBook.title}
                  </h2>

                  <p className="text-lg text-purple-600 dark:text-purple-400 font-semibold mb-4">
                    by {selectedBook.author}
                  </p>

                  {/* Rating and reviews */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          fill={selectedBook.rating >= i + 1 ? "#FCD34D" : "none"}
                          className="text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">
                      {selectedBook.rating} / 5
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      ({selectedBook.reviews} reviews)
                    </span>
                  </div>

                  {/* Quick info */}
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Category:</span>
                      <span className="ml-2 font-semibold text-slate-900 dark:text-white">
                        {selectedBook.category}
                      </span>
                    </div>
                    {selectedBook.pages && (
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Pages:</span>
                        <span className="ml-2 font-semibold text-slate-900 dark:text-white">
                          {selectedBook.pages}
                        </span>
                      </div>
                    )}
                    {selectedBook.publisher && (
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Publisher:</span>
                        <span className="ml-2 font-semibold text-slate-900 dark:text-white">
                          {selectedBook.publisher}
                        </span>
                      </div>
                    )}
                    {selectedBook.year && (
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Year:</span>
                        <span className="ml-2 font-semibold text-slate-900 dark:text-white">
                          {selectedBook.year}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary section */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Book Summary
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedBook.summary}
                </p>
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-[#7a4bf4] to-[#9a6bff] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                  Read Now
                </button>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="flex-1 border-2 border-gray-300 dark:border-slate-600 text-slate-900 dark:text-white py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <div className="aspect-[3/4] relative overflow-hidden transition group-hover:scale-105">
                  <BookCoverImage
                    title={book.title}
                    author={book.author}
                    src={book.image}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                    <p className="text-white text-xs font-bold line-clamp-2">{book.title}</p>
                  </div>
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
                  <button 
                    onClick={() => setSelectedBook(book)}
                    className="w-full bg-gradient-to-r from-[#7a4bf4] to-[#9a6bff] text-white py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
                  >
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
