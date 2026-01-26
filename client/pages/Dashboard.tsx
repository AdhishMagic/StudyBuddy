import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { Plus, Trash2, Edit2, ChevronLeft, ChevronRight } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  priority: "Low" | "Medium" | "High";
  progress: number;
  completedOn?: string;
  category?: string;
  repeat?: "daily" | "weekly" | "none";
}

export default function Dashboard() {
  const location = useLocation();
  const defaultTasks: Task[] = [
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
  ];

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [tasksLoaded, setTasksLoaded] = useState(false);

  const toYmd = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const parseYmdToDate = (ymd: string) => new Date(`${ymd}T00:00:00`);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    const ymd = new URLSearchParams(location.search).get("date");
    if (ymd && /^\d{4}-\d{2}-\d{2}$/.test(ymd)) return parseYmdToDate(ymd);
    return new Date();
  });
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    const ymd = new URLSearchParams(location.search).get("date");
    if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return;
    const next = parseYmdToDate(ymd);
    if (Number.isNaN(next.getTime())) return;
    setSelectedDate(next);
    // Intentionally only reacts to URL changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tasks");
      if (raw) {
        const parsed = JSON.parse(raw) as Array<Omit<Task, "date"> & { date: string }>;
        setTasks(
          parsed.map((t) => ({
            ...t,
            date: t.date.includes("T") ? new Date(t.date) : parseYmdToDate(t.date),
          }))
        );
      }
    } catch {
      // ignore
    } finally {
      setTasksLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!tasksLoaded) return;
    try {
      localStorage.setItem(
        "tasks",
        JSON.stringify(
          tasks.map((t) => ({
            ...t,
            date: toYmd(t.date),
          }))
        )
      );
      window.dispatchEvent(new Event("studybuddy:stats-updated"));
    } catch {
      // ignore
    }
  }, [tasks, tasksLoaded]);

  // Get week days around selected date
  const weekDays = useMemo(() => {
    const days = [];
    const currentDate = new Date(selectedDate);
    const dayOfWeek = currentDate.getDay();
    // Adjust to make Monday the first day (0=Sunday becomes 6, 1=Monday becomes 0, etc.)
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - mondayOffset);

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
        date: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()),
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

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handleUpdateProgress = (id: string, newProgress: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedOn = toYmd(today);
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              progress: newProgress,
              completedOn: newProgress >= 100 ? completedOn : undefined,
            }
          : task
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
        return "bg-[#7a4bf4] text-white";
      case "Medium":
        return "bg-[#9a6bff] text-white";
      case "Low":
        return "bg-slate-200 text-slate-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6ff] dark:bg-slate-950 transition-colors">
      <Header isLoggedIn={true} showNav={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Decorative blurs */}
        <div className="fixed -left-24 top-10 h-64 w-64 rounded-full bg-[#c8b5ff]/30 blur-3xl" />
        <div className="fixed right-0 top-20 h-80 w-80 rounded-full bg-[#d2deff]/60 blur-2xl" />

        {/* Header */}
        <div className="mb-8 relative z-10">
          <h1 className="text-slate-900 text-3xl font-bold">Today</h1>
        </div>

        {/* Date selector cards */}
        <div className="mb-8 flex items-center gap-3 relative z-10">
          <button
            onClick={handlePreviousWeek}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            aria-label="Previous week"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex gap-2 flex-1 justify-between">
            {weekDays.map((day, index) => {
            const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const isSelected =
              day.getDate() === selectedDate.getDate() &&
              day.getMonth() === selectedDate.getMonth();

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`flex-1 min-w-[80px] py-3 rounded-xl font-semibold text-center transition ${
                  isSelected
                    ? "bg-[#7a4bf4] text-white shadow-lg"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                <div className="text-xs">{dayNames[index]}</div>
                <div className="text-lg font-bold">{day.getDate()}</div>
                <div className="text-xs opacity-70">{monthNames[day.getMonth()]}</div>
              </button>
            );
          })}
          </div>
          
          <button
            onClick={handleNextWeek}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            aria-label="Next week"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Tasks section */}
        <div className="space-y-4 mb-8 relative z-10">
          {/* Category label */}
          {filteredTasks.length > 0 && (
            <div className="text-slate-700 text-sm font-bold opacity-70 uppercase">
              {filteredTasks[0].category || "TASKS"}
            </div>
          )}

          {/* Task cards */}
          {filteredTasks.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center shadow-sm">
              <p className="text-lg text-slate-900 dark:text-white">No tasks for today</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Add a task to get started
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:shadow-lg transition group"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{task.title}</h3>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Progress
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{task.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#7a4bf4] rounded-full transition-all duration-300"
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
                    className="w-24 h-1 accent-[#7a4bf4] cursor-pointer"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add task section */}
        <div className="flex gap-3 items-center relative z-10">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            placeholder="Write a task..."
            className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7a4bf4] focus:border-transparent"
          />
          <button
            onClick={handleAddTask}
            className="bg-gradient-to-r from-[#7a4bf4] to-[#9a6bff] hover:shadow-lg hover:scale-105 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 shadow-md"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
