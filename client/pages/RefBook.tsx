import { useState } from "react";
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
  userRating?: number;
}

export default function RefBook() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [books, setBooks] = useState<Book[]>([
    {
      id: "1",
      title: "HOOKED: How to...",
      author: "Nir Eyal",
      category: "Psychology",
      rating: 4.5,
      reviews: 234,
      cover: "bg-yellow-300",
    },
    {
      id: "2",
      title: "UX Design Process...",
      author: "Josh Haze",
      category: "Design",
      rating: 4.8,
      reviews: 156,
      cover: "bg-blue-500",
    },
    {
      id: "3",
      title: "Design Thinking",
      author: "Unknown",
      category: "Design",
      rating: 4.6,
      reviews: 89,
      cover: "bg-gray-400",
    },
    {
      id: "4",
      title: "The Innovator's...",
      author: "Unknown",
      category: "Business",
      rating: 4.7,
      reviews: 204,
      cover: "bg-gray-600",
    },
    {
      id: "5",
      title: "Lean UX: Applying...",
      author: "Josh Haze",
      category: "Design",
      rating: 4.4,
      reviews: 123,
      cover: "bg-yellow-400",
    },
    {
      id: "6",
      title: "Lean UX: Applying...",
      author: "Josh Haze",
      category: "Design",
      rating: 4.3,
      reviews: 98,
      cover: "bg-orange-400",
    },
    {
      id: "7",
      title: "The Fire Runner",
      author: "Unknown",
      category: "Fiction",
      rating: 4.6,
      reviews: 145,
      cover: "bg-indigo-500",
    },
    {
      id: "8",
      title: "Ghost Runners",
      author: "Unknown",
      category: "Fiction",
      rating: 4.5,
      reviews: 167,
      cover: "bg-red-600",
    },
    {
      id: "9",
      title: "The Eve Runner",
      author: "Unknown",
      category: "Science",
      rating: 4.7,
      reviews: 201,
      cover: "bg-blue-400",
    },
    {
      id: "10",
      title: "Learning Time",
      author: "Unknown",
      category: "Education",
      rating: 4.6,
      reviews: 134,
      cover: "bg-cyan-400",
    },
    {
      id: "11",
      title: "Good Company",
      author: "Unknown",
      category: "Business",
      rating: 4.8,
      reviews: 178,
      cover: "bg-green-600",
    },
    {
      id: "12",
      title: "Father of the Rain",
      author: "Unknown",
      category: "Fiction",
      rating: 4.5,
      reviews: 112,
      cover: "bg-purple-400",
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
    <div className="min-h-screen bg-white">
      <Header isLoggedIn={true} showNav={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-orange-400 via-orange-300 to-orange-200 rounded-3xl p-8 text-white mb-12">
            <p className="text-lg font-semibold mb-3">
              Find out the best books to read when you don't even know what to
              search
            </p>
            <h2 className="text-3xl font-bold">Suggested books</h2>
          </div>

          {/* Decorative book grid in hero */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`aspect-[2/3] rounded-lg ${
                  [
                    "bg-yellow-300",
                    "bg-blue-500",
                    "bg-gray-400",
                    "bg-green-600",
                    "bg-purple-400",
                    "bg-cyan-400",
                  ][i - 1]
                } flex items-center justify-center`}
              ></div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="flex gap-3 overflow-x-auto pb-4 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8">
            {selectedCategory === "All" ? "All Books" : selectedCategory} Books
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition group"
              >
                {/* Book Cover */}
                <div
                  className={`${book.cover} aspect-[3/4] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition`}
                >
                  <div className="text-white opacity-20 text-center px-4">
                    <p className="text-xs font-bold">{book.title}</p>
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-4">
                  <h3 className="font-bold text-sm line-clamp-2 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">{book.author}</p>

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
                    <span className="text-xs text-gray-600 ml-auto">
                      {book.rating}
                    </span>
                  </div>

                  {/* Reviews count */}
                  <p className="text-xs text-gray-500 mb-3">
                    {book.reviews} reviews
                  </p>

                  {/* Add to cart button */}
                  <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-semibold hover:bg-primary-600 transition flex items-center justify-center gap-2">
                    <ShoppingCart size={14} />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center py-8">
          <button className="border-2 border-primary text-primary px-12 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition">
            Load More Books
          </button>
        </div>
      </div>

      {/* Decorative wave footer */}
      <div className="relative h-32 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden mt-16 bg-gradient-to-br from-primary via-purple-400 to-orange-400">
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
