export interface Subject {
  id: number;
  name: string;
}

export interface StudyPlanRequest {
  examName: string;
  examDate: string;
  subjects: Subject[];
  studyHoursPerDay: number;
}

// New types for the structured study plan
export interface StudyTask {
  subject: string;
  topic: string;
}

export interface StudyDay {
  week: number;
  day: string;
  date: string;
  tasks: StudyTask[];
}

export interface StudyPlan {
  summary: string;
  schedule: StudyDay[];
  studyTips: string;
  detailedPlanText: string;
}

// New types for the Task Manager feature
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  text: string;
  subject: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}
