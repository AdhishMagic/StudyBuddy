import React, { useState, useCallback } from 'react';
import type { StudyPlanRequest, StudyPlan, Task, TaskStatus } from './types';
import { generateStudyPlan } from './services/geminiService';
import Header from './components/Header';
import StudyForm from './components/StudyForm';
import StudyPlanDisplay from './components/StudyPlanDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPlan, setShowPlan] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleGeneratePlan = useCallback(async (request: StudyPlanRequest) => {
    setIsLoading(true);
    setError(null);
    setStudyPlan(null);
    setShowPlan(false);

    if (!request.examName || !request.examDate || request.subjects.some(s => !s.name.trim()) || request.studyHoursPerDay <= 0) {
        setError("Please fill in all fields before generating a plan.");
        setIsLoading(false);
        return;
    }
    if (new Date(request.examDate) <= new Date()) {
        setError("The exam date must be in the future.");
        setIsLoading(false);
        return;
    }

    try {
      const plan = await generateStudyPlan(request);
      setStudyPlan(plan);
      setShowPlan(true);
      setTasks([]); // Reset tasks when a new plan is generated
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate study plan. ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setStudyPlan(null);
    setError(null);
    setIsLoading(false);
    setShowPlan(false);
    setTasks([]);
  }, []);

  const handleAddTask = useCallback((task: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = { ...task, id: Date.now().toString(), status: 'pending' };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, []);

  const handleUpdateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }, []);
  
  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/40 to-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {!showPlan ? (
            <div className="max-w-4xl mx-auto">
                <StudyForm onGeneratePlan={handleGeneratePlan} isLoading={isLoading} />
            </div>
          ) : (
            <StudyPlanDisplay 
              plan={studyPlan} 
              onReset={handleReset}
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {isLoading && <LoadingSpinner />}
          
          {error && !isLoading && (
            <div className="mt-6 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center max-w-4xl mx-auto">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
