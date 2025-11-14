
import React, { useState } from 'react';
import type { Subject, StudyPlanRequest } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface StudyFormProps {
  onGeneratePlan: (request: StudyPlanRequest) => void;
  isLoading: boolean;
}

const StudyForm: React.FC<StudyFormProps> = ({ onGeneratePlan, isLoading }) => {
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([{ id: 1, name: '' }]);
  const [studyHoursPerDay, setStudyHoursPerDay] = useState<number>(4);

  const handleAddSubject = () => {
    setSubjects([...subjects, { id: Date.now(), name: '' }]);
  };

  const handleRemoveSubject = (id: number) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  const handleSubjectChange = (id: number, name: string) => {
    setSubjects(subjects.map(subject => subject.id === id ? { ...subject, name } : subject));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGeneratePlan({ examName, examDate, subjects, studyHoursPerDay });
  };
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 md:p-8 shadow-2xl shadow-purple-900/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="examName" className="block text-sm font-medium text-gray-300 mb-2">Exam Name</label>
          <input
            type="text"
            id="examName"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            placeholder="e.g., Final Semester Exams"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="examDate" className="block text-sm font-medium text-gray-300 mb-2">Exam Date</label>
          <input
            type="date"
            id="examDate"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            min={today}
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Subjects</label>
          <div className="space-y-3">
            {subjects.map((subject, index) => (
              <div key={subject.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={subject.name}
                  onChange={(e) => handleSubjectChange(subject.id, e.target.value)}
                  placeholder={`Subject ${index + 1}`}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  required
                />
                {subjects.length > 1 && (
                  <button type="button" onClick={() => handleRemoveSubject(subject.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddSubject} className="mt-3 flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
            <PlusIcon />
            <span>Add another subject</span>
          </button>
        </div>

        <div>
            <label htmlFor="studyHours" className="block text-sm font-medium text-gray-300 mb-2">Daily Study Hours: <span className="font-bold text-purple-400">{studyHoursPerDay}</span></label>
            <input
                id="studyHours"
                type="range"
                min="1"
                max="12"
                step="0.5"
                value={studyHoursPerDay}
                onChange={(e) => setStudyHoursPerDay(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? 'Generating Your Plan...' : 'Generate My Study Plan'}
        </button>
      </form>
    </div>
  );
};

export default StudyForm;
