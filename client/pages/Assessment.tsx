import { useState } from "react";
import Header from "@/components/Header";
import { Plus, X } from "lucide-react";

interface Assessment {
  id: string;
  topic: string;
  subjects: string[];
  date: string;
  startTime: string;
  endTime: string;
  priority: "Low" | "Medium" | "High";
}

export default function Assessment() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:00");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [newSubject, setNewSubject] = useState("");

  const availableSubjects = ["Maths", "Science", "English", "History", "Geography"];

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
      };
      setAssessments([...assessments, assessment]);
      // Reset form
      setTopic("");
      setSelectedSubjects([]);
      setDate("");
      setStartTime("09:00");
      setEndTime("09:00");
      setPriority("Medium");
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
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay()); // Start of week
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // End of week

    const formatDate = (d: Date) => {
      const day = String(d.getDate()).padStart(2, "0");
      const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
      return `${day} ${month}`;
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header isLoggedIn={true} showNav={true} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              {getDateRange()}
            </h1>
            <p className="text-gray-600">Manage your assessments</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition flex items-center gap-2"
          >
            <Plus size={20} />
            Add Assessment
          </button>
        </div>

        {/* Assessment Form */}
        {showForm && (
          <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Create an assessment</h2>
            <form onSubmit={handleAddAssessment} className="space-y-6">
              {/* Topic */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Class 10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-full flex items-center gap-2"
                    >
                      {subject}
                      <button
                        onClick={() => removeSubject(subject)}
                        type="button"
                        className="hover:bg-primary-600 rounded-full p-1"
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
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    onClick={addCustomSubject}
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary-600 transition"
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
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No assessments yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first assessment to get started
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition"
            >
              Create Assessment
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {assessment.topic}
                    </h3>
                    <p className="text-sm text-gray-600">
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
                      className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {subject}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
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
