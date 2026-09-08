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
import ReadFailureNotice from '@/components/admin/ReadFailureNotice';

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'sales' | 'newsletter' | 'content' | 'outreach' | 'general';
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  due_date?: string | null;
  created_at: string;
}

const AdminTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
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
    void loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoadError(null);
    const { data, error } = await (supabase
      .from('admin_tasks' as any)
      .select('*')
      .order('created_at', { ascending: false }) as any);

    if (error) {
      // An empty board and a board nobody could read look identical, and
      // the first one says "you are on top of everything".
      setLoadError(error.message);
      setTasks([]);
    } else {
      setTasks((data || []) as Task[]);
    }
    setLoading(false);
  };

  const addTask = async () => {
    if (busy) return;
    if (!newTask.title.trim()) {
      toast({
        title: 'A task needs a title',
        description: 'That is what everyone else will see on the board.',
        variant: 'destructive'
      });
      return;
    }

    setBusy(true);
    const { error } = await (supabase
      .from('admin_tasks' as any)
      .insert({
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        type: newTask.type,
        priority: newTask.priority,
        status: 'todo',
        due_date: newTask.dueDate || null,
      }) as any);
    setBusy(false);

    if (error) {
      toast({ title: 'Not created', description: error.message, variant: 'destructive' });
      return;
    }

    setNewTask({ title: '', description: '', type: 'general', priority: 'medium', dueDate: '' });
    setShowAddDialog(false);
    toast({ title: 'Task created', description: 'It is on the board for everyone.' });
    void loadTasks();
  };

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    const previous = tasks;
    setTasks(tasks.map(t => (t.id === taskId ? { ...t, status } : t)));

    const { error } = await (supabase
      .from('admin_tasks' as any)
      .update({ status })
      .eq('id', taskId) as any);

    if (error) {
      // Put the card back where it was. A card that moves on screen and
      // nowhere else is worse than one that refuses to move.
      setTasks(previous);
      toast({ title: 'Not moved', description: error.message, variant: 'destructive' });
    }
  };

  const deleteTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!window.confirm(`Delete "${task?.title ?? 'this task'}" for everyone? This cannot be undone.`)) {
      return;
    }

    const previous = tasks;
    setTasks(tasks.filter(t => t.id !== taskId));

    const { error } = await (supabase
      .from('admin_tasks' as any)
      .delete()
      .eq('id', taskId) as any);

    if (error) {
      setTasks(previous);
      toast({
        title: 'Not deleted',
        description: `${error.message}. Deleting a task is held to admin.`,
        variant: 'destructive'
      });
    }
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
        {task.due_date && (
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(task.due_date).toLocaleDateString()}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        Loading the board
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loadError && (
        <ReadFailureNotice what="the task board" reason={loadError} onRetry={loadTasks} />
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Task Board</CardTitle>
              <CardDescription>
                Shared with everyone who can open the admin. Anyone here can add a task
                and move it; only an admin can delete one.
              </CardDescription>
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
                  <DialogDescription>This goes on the shared board, not a private list.</DialogDescription>
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
                  <Button onClick={addTask} disabled={busy}>
                    {busy ? 'Creating...' : 'Create Task'}
                  </Button>
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
