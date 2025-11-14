import React, { useMemo } from 'react';
import type { StudyPlan, Task, TaskStatus } from '../types';
import TimetableView, { subjectColors } from './TimetableView';
import TaskManager from './TaskManager';

interface StudyPlanDisplayProps {
  plan: StudyPlan | null;
  onReset: () => void;
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'status'>) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
}

// A simple component to render markdown-like text
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');
    return (
        <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
            {lines.map((line, index) => {
                line = line.trim();
                if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-bold mt-6 mb-2 text-purple-300">{line.substring(4)}</h3>;
                }
                if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 border-b border-gray-600 pb-2 text-purple-300">{line.substring(3)}</h2>;
                }
                if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-3xl font-extrabold mt-4 mb-6 text-center text-purple-300">{line.substring(2)}</h1>;
                }
                if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={index} className="font-bold my-2 text-gray-200">{line.substring(2, line.length - 2)}</p>;
                }
                if (line.startsWith('- ') || line.startsWith('* ')) {
                    return <li key={index} className="ml-6 list-disc text-gray-300">{line.substring(2)}</li>;
                }
                if (line === '') {
                    return <br key={index} />;
                }
                return <p key={index} className="my-1 text-gray-300">{line}</p>;
            })}
        </div>
    );
};


const StudyPlanDisplay: React.FC<StudyPlanDisplayProps> = ({ plan, onReset, tasks, onAddTask, onUpdateTaskStatus, onDeleteTask }) => {
  const colorMap = useMemo(() => {
    if (!plan) return new Map<string, string>();
    const map = new Map<string, string>();
    const uniqueSubjects = new Set<string>();
    
    plan.schedule.forEach(day => {
        day.tasks.forEach(task => {
            uniqueSubjects.add(task.subject);
        });
    });
    
    Array.from(uniqueSubjects).sort().forEach((subject, index) => {
        const colorClass = subjectColors[index % subjectColors.length];
        map.set(subject, colorClass);
    });
    
    return map;
  }, [plan]);

  if (!plan) {
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 md:p-8 shadow-2xl shadow-purple-900/20 animate-fade-in">
            <p className="text-center text-gray-400">Your study plan is being prepared...</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 md:p-8 shadow-2xl shadow-purple-900/20 animate-fade-in space-y-12">
        <header className="text-center">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Your Personalized Study Plan</h2>
            <p className="mt-2 text-gray-300 max-w-3xl mx-auto">{plan.summary}</p>
        </header>

        <section>
             <h3 className="text-2xl font-bold text-center mb-6 text-purple-300">Visual Timetable</h3>
            <TimetableView schedule={plan.schedule} colorMap={colorMap} />
        </section>

        <section>
            <TaskManager 
                tasks={tasks}
                onAddTask={onAddTask}
                onUpdateTaskStatus={onUpdateTaskStatus}
                onDeleteTask={onDeleteTask}
                colorMap={colorMap}
            />
        </section>

        <section>
            <h3 className="text-2xl font-bold text-center mb-6 text-purple-300">Detailed Breakdown</h3>
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                 <MarkdownRenderer content={plan.detailedPlanText} />
            </div>
        </section>
        
        <div className="mt-8 text-center">
            <button
                onClick={onReset}
                className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500/50 transition-all duration-300"
            >
                Create a New Plan
            </button>
        </div>
    </div>
  );
};

export default StudyPlanDisplay;
