import { supabase } from '../lib/supabase';
import { Project, Task, TaskStatus, TaskPriority } from '../types';

export const projectService = {
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Project[];
  },

  async createProject(name: string, description?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .insert([{ name, description, user_id: user.id }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  },

  async updateProject(id: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  },

  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async ensureDefaultProject() {
    const projects = await this.getProjects();
    if (projects.length === 0) {
      return await this.createProject('Dự án mặc định', 'Đây là dự án đầu tiên của bạn.');
    }
    return projects[0];
  }
};

export const taskService = {
  async getTasks(projectId?: string) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return [];

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Task[];
  },

  async createTask(task: Partial<Task>) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) throw new Error("User not authenticated");

    const payload = {
      title: task.title,
      description: task.description || null,
      status: task.status || 'todo',
      priority: task.priority || 'Medium',
      is_starred: task.is_starred || false,
      user_id: user.id,
      project_id: task.project_id || null
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([payload])
      .select()
      .single();
    
    if (error) throw error;
    return data as Task;
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Task;
  },

  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async moveTaskStatus(id: string, status: TaskStatus) {
    return await this.updateTask(id, { status });
  }
};
