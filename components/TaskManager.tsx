import React, { useState, useMemo } from 'react';
import type { Task, TaskStatus, TaskPriority } from '../types';
import { PlusIcon, TrashIcon, ArrowRightIcon, UndoIcon } from './icons';

interface TaskManagerProps {
    tasks: Task[];
    onAddTask: (task: Omit<Task, 'id' | 'status'>) => void;
    onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
    onDeleteTask: (taskId: string) => void;
    colorMap: Map<string, string>;
}

const AddTaskForm: React.FC<Pick<TaskManagerProps, 'onAddTask' | 'colorMap'>> = ({ onAddTask, colorMap }) => {
    const [text, setText] = useState('');
    const [subject, setSubject] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<TaskPriority>('Medium');
    const [isExpanded, setIsExpanded] = useState(false);
    
    const subjects = useMemo(() => Array.from(colorMap.keys()), [colorMap]);
    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !subject || !dueDate) {
            alert("Please fill out all fields.");
            return;
        }
        onAddTask({ text, subject, dueDate, priority });
        setText('');
        setSubject('');
        setDueDate('');
        setPriority('Medium');
        setIsExpanded(false);
    };

    if (!isExpanded) {
        return (
            <div className="text-center mb-6">
                <button
                    onClick={() => setIsExpanded(true)}
                    className="flex items-center justify-center mx-auto space-x-2 bg-purple-600/50 text-purple-200 font-semibold py-2 px-4 rounded-lg hover:bg-purple-600/80 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                    <PlusIcon />
                    <span>Add a New Task</span>
                </button>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4 mb-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2">
                    <label htmlFor="taskText" className="block text-sm font-medium text-gray-300 mb-1">Task Description</label>
                    <input id="taskText" type="text" value={text} onChange={e => setText(e.target.value)} placeholder="e.g., Complete Chapter 3 exercises" className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500" required />
                </div>
                <div>
                    <label htmlFor="taskSubject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                    <select id="taskSubject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500" required>
                        <option value="" disabled>Select Subject</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="taskDueDate" className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
                    <input id="taskDueDate" type="date" value={dueDate} min={today} onChange={e => setDueDate(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500" required />
                </div>
                <div>
                     <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                    <select id="taskPriority" value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>
                <div className="md:col-span-2 lg:col-span-4 flex justify-end space-x-2">
                    <button type="button" onClick={() => setIsExpanded(false)} className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-gray-500 transition-colors">Cancel</button>
                    <button type="submit" className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-purple-700 transition-colors">Add Task</button>
                </div>
            </form>
        </div>
    );
};

const TaskCard: React.FC<{ task: Task; color: string; onUpdate: (id: string, status: TaskStatus) => void; onDelete: (id: string) => void; }> = ({ task, color, onUpdate, onDelete }) => {
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
    const priorityClasses = {
        'Low': 'bg-blue-500/30 text-blue-300',
        'Medium': 'bg-yellow-500/30 text-yellow-300',
        'High': 'bg-red-500/30 text-red-300',
    };
    
    return (
        <div className={`bg-gray-800/70 p-3 rounded-lg border-l-4 ${color} ${isOverdue ? 'ring-2 ring-red-500' : ''}`}>
            <div className="flex justify-between items-start">
                <p className="text-sm font-semibold text-gray-200">{task.text}</p>
                <div className="flex space-x-1">
                    {task.status !== 'completed' && <button onClick={() => onUpdate(task.id, task.status === 'pending' ? 'in-progress' : 'completed')} className="p-1 text-gray-400 hover:text-green-400 transition-colors" title="Next Status"><ArrowRightIcon /></button>}
                    {task.status === 'completed' && <button onClick={() => onUpdate(task.id, 'in-progress')} className="p-1 text-gray-400 hover:text-yellow-400 transition-colors" title="Re-open Task"><UndoIcon /></button>}
                    <button onClick={() => onDelete(task.id)} className="p-1 text-gray-400 hover:text-red-400 transition-colors" title="Delete Task"><TrashIcon /></button>
                </div>
            </div>
            <div className="mt-2 flex justify-between items-center text-xs">
                <span className={`px-2 py-0.5 rounded-full ${priorityClasses[task.priority]}`}>{task.priority}</span>
                <span className={`text-gray-400 ${isOverdue ? 'text-red-400 font-bold' : ''}`}>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
        </div>
    );
};

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onAddTask, onUpdateTaskStatus, onDeleteTask, colorMap }) => {
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    return (
        <div>
            <h3 className="text-2xl font-bold text-center mb-4 text-purple-300">Task & Assignment Tracker</h3>
            <AddTaskForm onAddTask={onAddTask} colorMap={colorMap} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pending Column */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-bold text-lg mb-4 text-center text-yellow-400">Pending ({pendingTasks.length})</h4>
                    <div className="space-y-3">
                        {pendingTasks.map(task => <TaskCard key={task.id} task={task} color={colorMap.get(task.subject) || ''} onUpdate={onUpdateTaskStatus} onDelete={onDeleteTask} />)}
                    </div>
                </div>
                {/* In Progress Column */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-bold text-lg mb-4 text-center text-blue-400">In Progress ({inProgressTasks.length})</h4>
                    <div className="space-y-3">
                        {inProgressTasks.map(task => <TaskCard key={task.id} task={task} color={colorMap.get(task.subject) || ''} onUpdate={onUpdateTaskStatus} onDelete={onDeleteTask} />)}
                    </div>
                </div>
                {/* Completed Column */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-bold text-lg mb-4 text-center text-green-400">Completed ({completedTasks.length})</h4>
                    <div className="space-y-3">
                        {completedTasks.map(task => <TaskCard key={task.id} task={task} color={colorMap.get(task.subject) || ''} onUpdate={onUpdateTaskStatus} onDelete={onDeleteTask} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskManager;
