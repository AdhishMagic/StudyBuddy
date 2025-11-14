import React from 'react';
import type { StudyDay } from '../types';

interface TimetableViewProps {
  schedule: StudyDay[];
  colorMap: Map<string, string>;
}

export const subjectColors = [
    'border-blue-600 bg-blue-900/40 text-blue-300',
    'border-green-600 bg-green-900/40 text-green-300',
    'border-yellow-600 bg-yellow-900/40 text-yellow-300',
    'border-pink-600 bg-pink-900/40 text-pink-300',
    'border-indigo-600 bg-indigo-900/40 text-indigo-300',
    'border-red-600 bg-red-900/40 text-red-300',
    'border-teal-600 bg-teal-900/40 text-teal-300',
    'border-orange-600 bg-orange-900/40 text-orange-300',
];


const TimetableView: React.FC<TimetableViewProps> = ({ schedule, colorMap }) => {
    
    const weeks = React.useMemo(() => {
        return schedule.reduce<Record<string, StudyDay[]>>((acc, day) => {
            const weekKey = String(day.week);
            if (!acc[weekKey]) {
                acc[weekKey] = [];
            }
            acc[weekKey].push(day);
            return acc;
        }, {});
    }, [schedule]);

  return (
    <div className="space-y-8">
      {/* Subject Color Legend */}
      {colorMap.size > 0 && (
        <div className="mb-6 border border-gray-700 bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-3 text-center text-gray-300">Subject Color Legend</h4>
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
                {Array.from(colorMap.entries()).map(([subject, colorClass]) => {
                    const swatchClasses = colorClass.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('border-')).join(' ');
                    return (
                        <div key={subject} className="flex items-center space-x-2">
                            <span className={`h-4 w-4 rounded-full border-2 ${swatchClasses}`}></span>
                            <span className="text-sm text-gray-300">{subject}</span>
                        </div>
                    );
                })}
            </div>
        </div>
      )}

      {Object.entries(weeks).map(([weekNumber, days]) => (
        <div key={weekNumber}>
          <h4 className="text-xl font-semibold mb-4 text-center text-gray-300">Week {weekNumber}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {days.map(day => (
              <div key={day.date} className="bg-gray-900/70 border border-gray-700 rounded-lg p-3 flex flex-col min-h-[180px]">
                <div className="font-bold text-gray-300">{day.day}</div>
                <div className="text-xs text-gray-500 mb-2">{day.date}</div>
                <div className="space-y-2 flex-grow">
                    {day.tasks.length > 0 ? day.tasks.map((task, index) => (
                         <div key={index} className={`p-2 rounded-md text-xs border ${colorMap.get(task.subject)}`}>
                            <div className="font-bold">{task.subject}</div>
                            <p className="text-gray-300/90">{task.topic}</p>
                        </div>
                    )) : (
                        <div className="text-center text-gray-500 text-sm h-full flex items-center justify-center">
                            <p>Rest or Review</p>
                        </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimetableView;
