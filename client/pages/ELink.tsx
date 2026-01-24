import { useState } from "react";
import Header from "@/components/Header";
import { Play, Link2, Clock, Video, BookOpen } from "lucide-react";

interface QueueItem {
  id: string;
  title: string;
  duration: string;
  isWatched: boolean;
}

interface Course {
  id: string;
  title: string;
  subject: string;
  videoCount: number;
  classCount: number;
  duration: string;
  currentVideo: QueueItem;
  queue: QueueItem[];
}

export default function ELink() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Spoken English",
      subject: "English",
      videoCount: 75,
      classCount: 35,
      duration: "60:30min",
      currentVideo: {
        id: "1",
        title: "Introduction to React",
        duration: "04:28 min",
        isWatched: false,
      },
      queue: [
        {
          id: "2",
          title: "Introduction to React",
          duration: "04:28 min",
          isWatched: false,
        },
        {
          id: "3",
          title: "Understanding React",
          duration: "06:12 min",
          isWatched: false,
        },
        {
          id: "4",
          title: "Create first React project",
          duration: "43:58 min",
          isWatched: false,
        },
      ],
    },
  ]);

  const [linkInput, setLinkInput] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);

  const handleAddLink = () => {
    if (linkInput.trim()) {
      const newVideo: QueueItem = {
        id: Date.now().toString(),
        title: "New Video",
        duration: "00:00 min",
        isWatched: false,
      };

      setCourses(
        courses.map((course) =>
          course.id === selectedCourse.id
            ? { ...course, queue: [...course.queue, newVideo] }
            : course
        )
      );

      setSelectedCourse({
        ...selectedCourse,
        queue: [...selectedCourse.queue, newVideo],
      });

      setLinkInput("");
    }
  };

  const handlePlayVideo = (videoId: string) => {
    const video = selectedCourse.queue.find((v) => v.id === videoId);
    if (video) {
      setSelectedCourse({
        ...selectedCourse,
        currentVideo: video,
        queue: selectedCourse.queue.map((v) =>
          v.id === videoId ? { ...v, isWatched: true } : v
        ),
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6ff] dark:bg-slate-950 transition-colors">
      <Header isLoggedIn={true} showNav={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main content card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden transition-colors">
          <div className="grid lg:grid-cols-3 gap-8 p-8">
            {/* Left side - Video Player */}
            <div className="lg:col-span-2">
              {/* Hero video section */}
              <div className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-primary via-purple-400 to-orange-500 aspect-video flex items-center justify-center group">
                <div className="text-center z-10">
                  <Play
                    className="text-white opacity-30 group-hover:opacity-50 transition"
                    size={64}
                  />
                </div>

                {/* Video content overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
                  <h2 className="text-4xl font-bold">
                    {selectedCourse.subject.toUpperCase()}
                  </h2>

                  <div className="flex gap-4">
                    <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl px-6 py-3 flex items-center gap-2 transition-all duration-200 hover:bg-white/30 hover:scale-[1.03] hover:shadow-xl">
                      <Video size={20} />
                      <span className="font-semibold">
                        {selectedCourse.videoCount} Videos
                      </span>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl px-6 py-3 flex items-center gap-2 transition-all duration-200 hover:bg-white/30 hover:scale-[1.03] hover:shadow-xl">
                      <BookOpen size={20} />
                      <span className="font-semibold">
                        {selectedCourse.classCount} Class
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video metadata */}
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{selectedCourse.duration}</span>
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex gap-4">
                <button className="flex-1 bg-accent hover:bg-orange-600 text-white py-3 rounded-full font-semibold transition flex items-center justify-center gap-2">
                  <span>⊙</span>
                  Focus
                </button>
                <button className="flex-1 bg-accent hover:bg-orange-600 text-white py-3 rounded-full font-semibold transition">
                  Schedule 12:07:00
                </button>
              </div>
            </div>

            {/* Right side - Queue */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Queue</h3>

              {/* Link input */}
              <div className="mb-6 relative">
                <input
                  type="text"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleAddLink();
                  }}
                  placeholder="paste the link"
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={handleAddLink}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition"
                >
                  <Link2 size={20} />
                </button>
              </div>

              {/* Queue items */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedCourse.queue.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handlePlayVideo(item.id)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedCourse.currentVideo.id === item.id
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-900 dark:text-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                          selectedCourse.currentVideo.id === item.id
                            ? "bg-white text-primary"
                            : "bg-accent text-white"
                        }`}
                      >
                        <Play size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.title}</p>
                        <p
                          className={`text-xs ${
                            selectedCourse.currentVideo.id === item.id
                              ? "text-white text-opacity-70"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {item.duration}
                        </p>
                      </div>
                      <span className="text-lg">›</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder for more courses */}
        <div className="mt-8 text-gray-900 dark:text-white">
          <h3 className="text-2xl font-bold mb-4">More Courses</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white bg-opacity-5 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition cursor-pointer"
              >
                <div className="aspect-video bg-gradient-to-br from-primary to-purple-400 rounded-lg mb-3 flex items-center justify-center">
                  <Video size={32} className="text-white opacity-50" />
                </div>
                <h4 className="font-semibold text-sm text-white mb-1">
                  Course {i}
                </h4>
                <p className="text-xs text-white text-opacity-60">
                  12 videos • 4.5 hours
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
