import { useState, useMemo } from "react";
import Header from "@/components/Header";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  priority: "Low" | "Medium" | "High";
  progress: number;
  category?: string;
  repeat?: "daily" | "weekly" | "none";
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "To prepare for the seminar",
      date: new Date(2024, 2, 26),
      priority: "High",
      progress: 60,
      category: "DESIGN",
    },
    {
      id: "2",
      title: "Prepare a design presentation",
      date: new Date(2024, 2, 26),
      priority: "Medium",
      progress: 40,
      category: "DESIGN",
    },
    {
      id: "3",
      title: "To write the record",
      date: new Date(2024, 2, 26),
      priority: "High",
      progress: 70,
      category: "WRITING",
    },
    {
      id: "4",
      title: "Need to finish the assignment",
      date: new Date(2024, 2, 26),
      priority: "Low",
      progress: 50,
      category: "ASSIGNMENT",
    },
    {
      id: "5",
      title: "Want to study for the exam",
      date: new Date(2024, 2, 26),
      priority: "High",
      progress: 30,
      category: "EXAM",
    },
    {
      id: "6",
      title: "To finish the homework",
      date: new Date(2024, 2, 26),
      priority: "Medium",
      progress: 80,
      category: "HOMEWORK",
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 2, 26));
  const [showAddTask, setShowAddTask] = useState(false);

  // Get week days around selected date
  const weekDays = useMemo(() => {
    const days = [];
    const currentDate = new Date(selectedDate);
    const dayOfWeek = currentDate.getDay();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  }, [selectedDate]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getDate() === selectedDate.getDate() &&
        taskDate.getMonth() === selectedDate.getMonth() &&
        taskDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [tasks, selectedDate]);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        date: selectedDate,
        priority: "Medium",
        progress: 0,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
      setShowAddTask(false);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleUpdateProgress = (id: string, newProgress: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, progress: newProgress } : task
      )
    );
  };

  const getDateString = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]} ${year}`;
  };

  const getWeekRangeString = () => {
    const firstDay = weekDays[0];
    const lastDay = weekDays[6];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${firstDay.getDate()} ${monthNames[firstDay.getMonth()]} - ${lastDay.getDate()} ${monthNames[lastDay.getMonth()]}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-primary text-primary-foreground";
      case "Medium":
        return "bg-primary text-primary-foreground";
      case "Low":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-400 to-purple-300">
      <Header isLoggedIn={true} showNav={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold">Today</h1>
        </div>

        {/* Date selector cards */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-4">
          {weekDays.map((day, index) => {
            const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            const isSelected =
              day.getDate() === selectedDate.getDate() &&
              day.getMonth() === selectedDate.getMonth();

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`flex-shrink-0 w-16 py-3 rounded-xl font-semibold text-center transition ${
                  isSelected
                    ? "bg-white text-primary font-bold"
                    : "bg-white bg-opacity-20 text-white hover:bg-opacity-35"
                }`}
              >
                <div className="text-xs">{dayNames[index]}</div>
                <div className="text-lg">{day.getDate()}</div>
              </button>
            );
          })}
        </div>

        {/* Tasks section */}
        <div className="space-y-4 mb-8">
          {/* Category label */}
          {filteredTasks.length > 0 && (
            <div className="text-white text-sm font-bold opacity-70 uppercase">
              {filteredTasks[0].category || "TASKS"}
            </div>
          )}

          {/* Task cards */}
          {filteredTasks.length === 0 ? (
            <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-8 text-center text-white">
              <p className="text-lg">No tasks for today</p>
              <p className="text-sm text-white text-opacity-70">
                Add a task to get started
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-4 text-white hover:bg-opacity-30 transition group"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition text-white hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white text-opacity-80">
                      Progress
                    </span>
                    <span className="text-sm font-semibold">{task.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Priority and actions */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </button>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={task.progress}
                    onChange={(e) =>
                      handleUpdateProgress(task.id, Number(e.target.value))
                    }
                    className="w-24 h-1 accent-white cursor-pointer"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add task section */}
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            placeholder="Write a task..."
            className="flex-1 px-4 py-3 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          />
          <button
            onClick={handleAddTask}
            className="bg-pink-300 hover:bg-pink-400 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
          >
            <Plus size={20} />
            Add
          </button>
        </div>

        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg
            className="w-full h-48"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="rgba(255, 255, 255, 0.1)"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,128C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
