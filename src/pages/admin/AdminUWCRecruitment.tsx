import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, Plus, Search, Filter, Download, Mail, Phone, Calendar,
  Building2, Briefcase, Globe, GraduationCap, ArrowRight, RefreshCw,
  Target, TrendingUp, ChevronRight, MoreHorizontal, Edit, Trash2
} from 'lucide-react';

// Pipeline stages
const stages = [
  { id: 'lead', label: 'Lead', color: 'bg-slate-500', description: 'New inquiry' },
  { id: 'qualified', label: 'Qualified', color: 'bg-blue-500', description: 'Discovery call done' },
  { id: 'applied', label: 'Applied', color: 'bg-amber-500', description: 'Documents submitted' },
  { id: 'accepted', label: 'Accepted', color: 'bg-green-500', description: 'Offer made' },
  { id: 'enrolled', label: 'Enrolled', color: 'bg-primary', description: 'Deposit paid' }
];

// Channel configurations
const channels = [
  { id: 'uwc_institutional', label: 'UWC Institutional', icon: Building2, target: 20, color: 'text-blue-600' },
  { id: 'professional', label: 'Professional', icon: Briefcase, target: 12, color: 'text-purple-600' },
  { id: 'digital', label: 'Digital', icon: Globe, target: 8, color: 'text-green-600' },
  { id: 'study_abroad', label: 'Study Abroad', icon: GraduationCap, target: 12, color: 'text-orange-600' }
];

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  institution?: string;
  channel: string;
  source?: string;
  stage: string;
  cohort?: string;
  is_international: boolean;
  notes?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  last_contact_date?: string;
  next_follow_up_date?: string;
}

const AdminUWCRecruitment: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { toast } = useToast();

  // New lead form state
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    institution: '',
    channel: 'digital',
    source: '',
    notes: '',
    is_international: false
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('uwc_programme_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch leads.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addLead = async () => {
    try {
      const { error } = await supabase
        .from('uwc_programme_leads')
        .insert({
          ...newLead,
          stage: 'lead'
        });

      if (error) throw error;

      toast({
        title: 'Lead Added',
        description: `${newLead.name} has been added to the pipeline.`
      });

      setIsAddDialogOpen(false);
      setNewLead({
        name: '',
        email: '',
        phone: '',
        country: '',
        institution: '',
        channel: 'digital',
        source: '',
        notes: '',
        is_international: false
      });
      fetchLeads();
    } catch (error) {
      console.error('Error adding lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to add lead.',
        variant: 'destructive'
      });
    }
  };

  const updateLeadStage = async (leadId: string, newStage: string) => {
    try {
      const { error } = await supabase
        .from('uwc_programme_leads')
        .update({ stage: newStage, updated_at: new Date().toISOString() })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(leads.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
      toast({
        title: 'Stage Updated',
        description: `Lead moved to ${stages.find(s => s.id === newStage)?.label}.`
      });
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to update lead stage.',
        variant: 'destructive'
      });
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const { error } = await supabase
        .from('uwc_programme_leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      setLeads(leads.filter(l => l.id !== leadId));
      toast({
        title: 'Lead Deleted',
        description: 'Lead has been removed from the pipeline.'
      });
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete lead.',
        variant: 'destructive'
      });
    }
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchQuery === '' || 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = filterChannel === 'all' || lead.channel === filterChannel;
    const matchesStage = filterStage === 'all' || lead.stage === filterStage;
    return matchesSearch && matchesChannel && matchesStage;
  });

  // Calculate stats
  const channelStats = channels.map(ch => ({
    ...ch,
    current: leads.filter(l => l.channel === ch.id).length,
    enrolled: leads.filter(l => l.channel === ch.id && l.stage === 'enrolled').length
  }));

  const stageStats = stages.map(st => ({
    ...st,
    count: leads.filter(l => l.stage === st.id).length
  }));

  const getLeadsByStage = (stageId: string) => 
    filteredLeads.filter(l => l.stage === stageId);

  const getChannelIcon = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    return channel?.icon || Globe;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">UWC Programme Recruitment</h2>
          <p className="text-muted-foreground">Cohort 1: July 2026 · Target: 36-66 students</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchLeads}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name *"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  />
                  <Input
                    placeholder="Email *"
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Phone"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  />
                  <Input
                    placeholder="Country"
                    value={newLead.country}
                    onChange={(e) => setNewLead({ ...newLead, country: e.target.value })}
                  />
                </div>
                <Input
                  placeholder="Institution"
                  value={newLead.institution}
                  onChange={(e) => setNewLead({ ...newLead, institution: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={newLead.channel}
                    onValueChange={(value) => setNewLead({ ...newLead, channel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Channel" />
                    </SelectTrigger>
                    <SelectContent>
                      {channels.map(ch => (
                        <SelectItem key={ch.id} value={ch.id}>{ch.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Source (e.g., LinkedIn)"
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                  />
                </div>
                <Textarea
                  placeholder="Notes"
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                />
                <Button 
                  className="w-full" 
                  onClick={addLead}
                  disabled={!newLead.name || !newLead.email}
                >
                  Add Lead
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Channel Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {channelStats.map((ch) => {
          const Icon = ch.icon;
          const progress = (ch.current / ch.target) * 100;
          return (
            <Card key={ch.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${ch.color}`} />
                  <Badge variant="outline" className="text-[10px]">
                    Target: {ch.target}
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm text-foreground">{ch.label}</h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{ch.current}</span>
                  <span className="text-xs text-muted-foreground">leads</span>
                  <span className="text-xs text-green-600 ml-auto">{ch.enrolled} enrolled</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterChannel} onValueChange={setFilterChannel}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            {channels.map(ch => (
              <SelectItem key={ch.id} value={ch.id}>{ch.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStage} onValueChange={setFilterStage}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {stages.map(st => (
              <SelectItem key={st.id} value={st.id}>{st.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {/* Kanban Pipeline */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {stages.map((stage) => {
            const stageLeads = getLeadsByStage(stage.id);
            return (
              <div key={stage.id} className="w-72 shrink-0">
                {/* Stage Header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <h3 className="font-semibold text-foreground">{stage.label}</h3>
                  <Badge variant="secondary" className="ml-auto">{stageLeads.length}</Badge>
                </div>

                {/* Lead Cards */}
                <div className="space-y-2 min-h-[200px] p-2 bg-muted/30 rounded-xl">
                  {stageLeads.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">No leads</p>
                  ) : (
                    stageLeads.map((lead) => {
                      const ChannelIcon = getChannelIcon(lead.channel);
                      return (
                        <Card key={lead.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium text-sm text-foreground truncate">{lead.name}</h4>
                                <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                              </div>
                              <ChannelIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                            </div>
                            
                            {lead.institution && (
                              <p className="text-xs text-muted-foreground truncate mb-2">{lead.institution}</p>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex gap-1">
                                {lead.is_international && (
                                  <Badge variant="outline" className="text-[9px] px-1">Intl</Badge>
                                )}
                                {lead.country && (
                                  <Badge variant="secondary" className="text-[9px] px-1">{lead.country}</Badge>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => window.open(`mailto:${lead.email}`, '_blank')}
                                >
                                  <Mail className="w-3 h-3" />
                                </Button>
                                {stage.id !== 'enrolled' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => {
                                      const nextStage = stages[stages.findIndex(s => s.id === stage.id) + 1];
                                      if (nextStage) updateLeadStage(lead.id, nextStage.id);
                                    }}
                                  >
                                    <ArrowRight className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-destructive"
                                  onClick={() => deleteLead(lead.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">{leads.length}</p>
              <p className="text-xs text-muted-foreground">Total Leads</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{leads.filter(l => l.stage === 'qualified').length}</p>
              <p className="text-xs text-muted-foreground">Qualified</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{leads.filter(l => l.stage === 'applied').length}</p>
              <p className="text-xs text-muted-foreground">Applied</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{leads.filter(l => l.stage === 'accepted').length}</p>
              <p className="text-xs text-muted-foreground">Accepted</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{leads.filter(l => l.stage === 'enrolled').length}</p>
              <p className="text-xs text-muted-foreground">Enrolled</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUWCRecruitment;
