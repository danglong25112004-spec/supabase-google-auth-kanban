export type TaskStatus = 'todo' | 'doing' | 'done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  project_id?: string | null;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  is_starred: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
}
