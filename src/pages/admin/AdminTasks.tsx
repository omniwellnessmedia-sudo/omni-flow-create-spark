import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus,
  Mail,
  Target,
  FileText,
  Users,
  Megaphone,
  Calendar
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'sales' | 'newsletter' | 'content' | 'outreach' | 'general';
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  dueDate?: string;
  createdAt: string;
}

// Local storage key for tasks (will be moved to Supabase later)
const TASKS_STORAGE_KEY = 'omni_admin_tasks';

const AdminTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filter, setFilter] = useState<'all' | Task['type']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Task['status']>('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'general' as Task['type'],
    priority: 'medium' as Task['priority'],
    dueDate: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    try {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        setTasks(JSON.parse(stored));
      } else {
        // Initialize with sample tasks
        const sampleTasks: Task[] = [
          {
            id: '1',
            title: 'Follow up with wellness retreat leads',
            description: 'Contact leads from the Cape Point tour inquiry form',
            type: 'sales',
            priority: 'high',
            status: 'todo',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Weekly newsletter - Wellness Tips',
            description: 'Draft and send the weekly wellness newsletter',
            type: 'newsletter',
            priority: 'medium',
            status: 'in_progress',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            title: 'New blog post: Benefits of Dru Yoga',
            description: 'Write and publish blog content on Dru Yoga benefits',
            type: 'content',
            priority: 'medium',
            status: 'todo',
            createdAt: new Date().toISOString()
          }
        ];
        setTasks(sampleTasks);
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(sampleTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  const addTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: 'Error',
        description: 'Task title is required',
        variant: 'destructive'
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      type: newTask.type,
      priority: newTask.priority,
      status: 'todo',
      dueDate: newTask.dueDate || undefined,
      createdAt: new Date().toISOString()
    };

    saveTasks([task, ...tasks]);
    setNewTask({ title: '', description: '', type: 'general', priority: 'medium', dueDate: '' });
    setShowAddDialog(false);
    toast({ title: 'Task created', description: 'New task added successfully' });
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, status } : t);
    saveTasks(updated);
    toast({ title: 'Task updated' });
  };

  const deleteTask = (taskId: string) => {
    saveTasks(tasks.filter(t => t.id !== taskId));
    toast({ title: 'Task deleted' });
  };

  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'sales': return <Target className="h-4 w-4 text-green-600" />;
      case 'newsletter': return <Mail className="h-4 w-4 text-blue-600" />;
      case 'content': return <FileText className="h-4 w-4 text-purple-600" />;
      case 'outreach': return <Megaphone className="h-4 w-4 text-orange-600" />;
      default: return <CheckCircle2 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: Task['type']) => {
    switch (type) {
      case 'sales': return 'bg-green-100 text-green-800';
      case 'newsletter': return 'bg-blue-100 text-blue-800';
      case 'content': return 'bg-purple-100 text-purple-800';
      case 'outreach': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter !== 'all' && t.type !== filter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const todoTasks = filteredTasks.filter(t => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
  const doneTasks = filteredTasks.filter(t => t.status === 'done');

  const TaskCard = ({ task }: { task: Task }) => (
    <div className={`p-3 bg-white rounded-lg border shadow-sm ${task.priority === 'high' ? 'border-l-4 border-l-red-500' : ''}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {getTypeIcon(task.type)}
          <h4 className="font-medium text-sm truncate">{task.title}</h4>
        </div>
        <Badge className={`text-[10px] shrink-0 ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </Badge>
      </div>
      {task.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
      )}
      <div className="flex flex-wrap items-center gap-1 mb-2">
        <Badge className={`text-[10px] ${getTypeColor(task.type)}`}>{task.type}</Badge>
        {task.dueDate && (
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      <div className="flex gap-1 flex-wrap">
        {task.status !== 'done' && (
          <Button 
            size="sm" 
            variant="outline" 
            className="h-6 text-[10px] px-2"
            onClick={() => updateTaskStatus(task.id, task.status === 'todo' ? 'in_progress' : 'done')}
          >
            {task.status === 'todo' ? 'Start' : 'Complete'}
          </Button>
        )}
        {task.status !== 'todo' && task.status !== 'done' && (
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-6 text-[10px] px-2"
            onClick={() => updateTaskStatus(task.id, 'todo')}
          >
            Back to Todo
          </Button>
        )}
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-6 text-[10px] px-2 text-red-600 hover:text-red-700"
          onClick={() => deleteTask(task.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Task Management</CardTitle>
              <CardDescription>Manage sales, newsletters, and content tasks</CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>Add a new task to your workflow</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input 
                      value={newTask.title}
                      onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Task title..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      value={newTask.description}
                      onChange={e => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Task description..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={newTask.type} onValueChange={v => setNewTask(prev => ({ ...prev, type: v as Task['type'] }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                          <SelectItem value="content">Content</SelectItem>
                          <SelectItem value="outreach">Outreach</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={newTask.priority} onValueChange={v => setNewTask(prev => ({ ...prev, priority: v as Task['priority'] }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date (optional)</Label>
                    <Input 
                      type="date"
                      value={newTask.dueDate}
                      onChange={e => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                  <Button onClick={addTask}>Create Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Select value={filter} onValueChange={v => setFilter(v as any)}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="outreach">Outreach</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* To Do */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <AlertCircle className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-sm">To Do</span>
                <Badge variant="secondary" className="text-xs">{todoTasks.length}</Badge>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {todoTasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No tasks</p>
                ) : (
                  todoTasks.map(task => <TaskCard key={task.id} task={task} />)
                )}
              </div>
            </div>

            {/* In Progress */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-sm">In Progress</span>
                <Badge variant="secondary" className="text-xs">{inProgressTasks.length}</Badge>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {inProgressTasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No tasks</p>
                ) : (
                  inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)
                )}
              </div>
            </div>

            {/* Done */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="font-medium text-sm">Done</span>
                <Badge variant="secondary" className="text-xs">{doneTasks.length}</Badge>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {doneTasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No completed tasks</p>
                ) : (
                  doneTasks.map(task => <TaskCard key={task.id} task={task} />)
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTasks;
