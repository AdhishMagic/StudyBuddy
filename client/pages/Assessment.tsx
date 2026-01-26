import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Assessment {
  id: string;
  topic: string;
  subjects: string[];
  date: string;
  startTime: string;
  endTime: string;
  priority: "Low" | "Medium" | "High";
  alert: boolean;
}

export default function Assessment() {
  const location = useLocation();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [assessmentsLoaded, setAssessmentsLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:00");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [newSubject, setNewSubject] = useState("");
  const [alert, setAlert] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    const ymd = new URLSearchParams(location.search).get("date");
    if (ymd && /^\d{4}-\d{2}-\d{2}$/.test(ymd)) return new Date(`${ymd}T00:00:00`);
    return new Date();
  });

  useEffect(() => {
    const ymd = new URLSearchParams(location.search).get("date");
    if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return;
    const next = new Date(`${ymd}T00:00:00`);
    if (Number.isNaN(next.getTime())) return;
    setSelectedDate(next);
  }, [location.search]);

  const availableSubjects = ["Maths", "Science", "English", "History", "Geography"];

  useEffect(() => {
    try {
      const raw = localStorage.getItem("assessments");
      if (raw) {
        const parsed = JSON.parse(raw) as Assessment[];
        setAssessments(parsed);
      }
    } catch {
      // ignore
    } finally {
      setAssessmentsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!assessmentsLoaded) return;
    try {
      localStorage.setItem("assessments", JSON.stringify(assessments));
      window.dispatchEvent(new Event("studybuddy:stats-updated"));
    } catch {
      // ignore
    }
  }, [assessments, assessmentsLoaded]);

  // Get week days around selected date
  const weekDays = useMemo(() => {
    const days = [];
    const currentDate = new Date(selectedDate);
    const dayOfWeek = currentDate.getDay();
    // Adjust to make Monday the first day
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

  const handleAddAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic && selectedSubjects.length > 0 && date) {
      const assessment: Assessment = {
        id: Date.now().toString(),
        topic,
        subjects: selectedSubjects,
        date,
        startTime,
        endTime,
        priority,
        alert,
      };
      setAssessments([...assessments, assessment]);
      // Reset form
      setTopic("");
      setSelectedSubjects([]);
      setDate("");
      setStartTime("09:00");
      setEndTime("09:00");
      setPriority("Medium");
      setAlert(true);
      setShowForm(false);
    }
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const addCustomSubject = () => {
    if (newSubject.trim() && !selectedSubjects.includes(newSubject)) {
      setSelectedSubjects([...selectedSubjects, newSubject]);
      setNewSubject("");
    }
  };

  const removeSubject = (subject: string) => {
    setSelectedSubjects((prev) => prev.filter((s) => s !== subject));
  };

  const getDateRange = () => {
    const currentDate = new Date(selectedDate);
    const dayOfWeek = currentDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - mondayOffset); // Start of week (Monday)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // End of week (Sunday)

    const formatDate = (d: Date) => {
      const day = String(d.getDate()).padStart(2, "0");
      const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
      return `${day} ${month}`;
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <Header isLoggedIn={true} showNav={true} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {getDateRange()}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your assessments</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-[#7a4bf4] to-[#9a6bff] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition flex items-center gap-2 shadow-md"
          >
            <Plus size={20} />
            Add Assessment
          </button>
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

        {/* Assessment Form */}
        {showForm && (
          <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-8 mb-8 border border-gray-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Create an assessment</h2>
            <form onSubmit={handleAddAssessment} className="space-y-6">
              {/* Topic */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Class 10"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Subject
                </label>

                {/* Selected subjects */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedSubjects.map((subject) => (
                    <div
                      key={subject}
                      className="bg-[#7a4bf4] text-white px-4 py-2 rounded-full flex items-center gap-2"
                    >
                      {subject}
                      <button
                        onClick={() => removeSubject(subject)}
                        type="button"
                        className="hover:bg-[#6a3be4] rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Available subjects */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {availableSubjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => toggleSubject(subject)}
                      type="button"
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        selectedSubjects.includes(subject)
                          ? "bg-[#7a4bf4] text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>

                {/* Add custom subject */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addCustomSubject())
                    }
                    placeholder="Add Subject"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a4bf4] focus:border-transparent"
                  />
                  <button
                    onClick={addCustomSubject}
                    type="button"
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a4bf4] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a4bf4] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a4bf4] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Priority
                </label>
                <div className="flex gap-3">
                  {(["Low", "Medium", "High"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      type="button"
                      className={`px-6 py-2 rounded-full font-semibold transition ${
                        priority === p
                          ? "bg-[#7a4bf4] text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alert Toggle */}
              <div className="flex items-center justify-between py-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Get alert for this task
                </label>
                <button
                  type="button"
                  onClick={() => setAlert(!alert)}
                  className={
                    alert
                      ? "relative inline-flex h-6 w-11 items-center rounded-full transition bg-[#7a4bf4]"
                      : "relative inline-flex h-6 w-11 items-center rounded-full transition bg-gray-300 dark:bg-gray-600"
                  }
                >
                  <span
                    className={
                      alert
                        ? "inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"
                        : "inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"
                    }
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#7a4bf4] to-[#9a6bff] text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition shadow-md"
                >
                  Assign Task
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  type="button"
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Assessments List */}
        {assessments.length === 0 ? (
          <div className="text-center py-20 px-6 bg-slate-100 dark:bg-slate-900 rounded-2xl">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              No assessments yet
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg">
              Create your first assessment to get started
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-[#7a4bf4] to-[#9a6bff] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition shadow-md"
            >
              Create Assessment
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {assessment.topic}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(assessment.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      assessment.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : assessment.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {assessment.priority}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {assessment.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="bg-[#7a4bf4] bg-opacity-10 text-[#7a4bf4] px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {subject}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>⏰ {assessment.startTime}</span>
                  <span>→</span>
                  <span>{assessment.endTime}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
