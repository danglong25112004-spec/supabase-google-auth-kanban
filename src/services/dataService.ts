import { supabase } from '../lib/supabase';
import { Project, Task, TaskStatus, TaskPriority } from '../types';

export const projectService = {
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Project[];
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

    if (!user) throw new Error("User not authenticated");

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) {
      console.error("GET TASKS ERROR:", error);
      throw error;
    }
    return data as Task[];
  },

  async createTask(task: Partial<Task>) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      throw new Error("User not authenticated");
    }

    const payload = {
      title: task.title,
      description: task.description || null,
      status: task.status || 'todo',
      priority: task.priority || 'Medium',
      is_starred: task.is_starred || false,
      user_id: user.id,
      project_id: (task.project_id && task.project_id !== "") ? task.project_id : null
    };

    console.log("USER:", user);
    console.log("CREATE TASK PAYLOAD:", payload);

    const { data, error } = await supabase
      .from('tasks')
      .insert([payload])
      .select()
      .single();
    
    if (error) {
      console.error("INSERT ERROR:", error);
      alert(`Lỗi thêm task: ${error.message}`);
      throw error;
    }
    return data as Task;
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Sanitize updates: convert empty string project_id to null
    const sanitizedUpdates = { ...updates };
    if (sanitizedUpdates.project_id === "") {
      sanitizedUpdates.project_id = undefined; // or null, but let's be explicit
      (sanitizedUpdates as any).project_id = null;
    }

    console.log("UPDATING TASK ID:", id);
    console.log("UPDATE PAYLOAD:", sanitizedUpdates);

    const { data, error } = await supabase
      .from('tasks')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("UPDATE ERROR:", error);
      alert(`Lỗi cập nhật task: ${error.message}`);
      throw error;
    }
    return data as Task;
  },

  async deleteTask(id: string) {
    console.log("DELETING TASK:", id);
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("DELETE ERROR:", error);
      alert(error.message);
      throw error;
    }
  },

  async moveTaskStatus(id: string, status: TaskStatus) {
    return await this.updateTask(id, { status });
  }
};
