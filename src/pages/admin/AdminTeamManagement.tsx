import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  Edit, 
  Trash2, 
  RefreshCw,
  Check,
  X,
  Clock
} from "lucide-react";
import { format } from "date-fns";

interface TeamMember {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  department: string | null;
  permissions: string[];
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

const AVAILABLE_PERMISSIONS = [
  { key: "content_management", label: "Content Management", description: "Create and edit blog posts" },
  { key: "product_management", label: "Product Management", description: "Manage products and pricing" },
  { key: "booking_management", label: "Booking Management", description: "View and manage bookings" },
  { key: "feature_flags", label: "Feature Flags", description: "Toggle platform features" },
  { key: "team_management", label: "Team Management", description: "Manage team members" },
  { key: "tour_management", label: "Tour Management", description: "Manage tours and availability" },
  { key: "analytics", label: "Analytics Access", description: "View platform analytics" },
];

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800",
  editor: "bg-blue-100 text-blue-800",
  viewer: "bg-gray-100 text-gray-800",
};

export const AdminTeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const { toast } = useToast();

  // New member form state
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "viewer" as "admin" | "editor" | "viewer",
    department: "",
    permissions: [] as string[],
  });

  const fetchTeamMembers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTeamMembers(data as TeamMember[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const handleAddMember = async () => {
    try {
      if (!newMember.name || !newMember.email) {
        toast({
          title: "Missing Information",
          description: "Please provide name and email.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("team_members").insert({
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        department: newMember.department || null,
        permissions: newMember.permissions,
        is_active: true,
        invited_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;

      toast({
        title: "Team Member Added",
        description: `${newMember.name} has been added to the team.`,
      });

      setIsAddDialogOpen(false);
      setNewMember({
        name: "",
        email: "",
        role: "viewer",
        department: "",
        permissions: [],
      });
      fetchTeamMembers();
    } catch (error: unknown) {
      console.error("Error adding team member:", error);
      toast({
        title: "Error",
        description: (error as { message?: string })?.message || "Failed to add team member",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMember = async () => {
    if (!selectedMember) return;

    try {
      const { error } = await supabase
        .from("team_members")
        .update({
          name: selectedMember.name,
          role: selectedMember.role,
          department: selectedMember.department,
          permissions: selectedMember.permissions,
          is_active: selectedMember.is_active,
        })
        .eq("id", selectedMember.id);

      if (error) throw error;

      toast({
        title: "Team Member Updated",
        description: `${selectedMember.name}'s profile has been updated.`,
      });

      setIsEditDialogOpen(false);
      setSelectedMember(null);
      fetchTeamMembers();
    } catch (error) {
      console.error("Error updating team member:", error);
      toast({
        title: "Error",
        description: "Failed to update team member",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async (member: TeamMember) => {
    if (!confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", member.id);

      if (error) throw error;

      toast({
        title: "Team Member Removed",
        description: `${member.name} has been removed from the team.`,
      });

      fetchTeamMembers();
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast({
        title: "Error",
        description: "Failed to remove team member",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .update({ is_active: !member.is_active })
        .eq("id", member.id);

      if (error) throw error;

      setTeamMembers((prev) =>
        prev.map((m) =>
          m.id === member.id ? { ...m, is_active: !m.is_active } : m
        )
      );
    } catch (error) {
      console.error("Error toggling member status:", error);
    }
  };

  const handlePermissionChange = (
    permissionKey: string,
    checked: boolean,
    target: "new" | "edit"
  ) => {
    if (target === "new") {
      setNewMember((prev) => ({
        ...prev,
        permissions: checked
          ? [...prev.permissions, permissionKey]
          : prev.permissions.filter((p) => p !== permissionKey),
      }));
    } else if (selectedMember) {
      setSelectedMember((prev) =>
        prev
          ? {
              ...prev,
              permissions: checked
                ? [...prev.permissions, permissionKey]
                : prev.permissions.filter((p) => p !== permissionKey),
            }
          : null
      );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Management
              </CardTitle>
              <CardDescription>
                Manage team members, roles, and permissions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchTeamMembers}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="min-h-[44px]">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Team Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                    <DialogDescription>
                      Add a new member to your team with specific permissions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name *</Label>
                        <Input
                          placeholder="Full name"
                          value={newMember.name}
                          onChange={(e) =>
                            setNewMember({ ...newMember, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          value={newMember.email}
                          onChange={(e) =>
                            setNewMember({ ...newMember, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select
                          value={newMember.role}
                          onValueChange={(v: "admin" | "editor" | "viewer") =>
                            setNewMember({ ...newMember, role: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Input
                          placeholder="e.g. Marketing"
                          value={newMember.department}
                          onChange={(e) =>
                            setNewMember({ ...newMember, department: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Permissions</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {AVAILABLE_PERMISSIONS.map((perm) => (
                          <div key={perm.key} className="flex items-center space-x-2">
                            <Checkbox
                              id={`new-${perm.key}`}
                              checked={newMember.permissions.includes(perm.key)}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(perm.key, !!checked, "new")
                              }
                            />
                            <label
                              htmlFor={`new-${perm.key}`}
                              className="text-sm cursor-pointer"
                            >
                              {perm.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddMember}>Add Member</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Team Members Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">No Team Members Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first team member to get started.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={ROLE_COLORS[member.role]}>
                          <Shield className="w-3 h-3 mr-1" />
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.department || "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={member.is_active}
                            onCheckedChange={() => handleToggleActive(member)}
                          />
                          <span className="text-sm">
                            {member.is_active ? (
                              <span className="text-green-600">Active</span>
                            ) : (
                              <span className="text-gray-400">Inactive</span>
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {member.last_login
                            ? format(new Date(member.last_login), "MMM d, yyyy")
                            : "Never"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMember(member)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update {selectedMember?.name}'s profile and permissions.
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={selectedMember.name}
                    onChange={(e) =>
                      setSelectedMember({ ...selectedMember, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={selectedMember.email} disabled />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={selectedMember.role}
                    onValueChange={(v: "admin" | "editor" | "viewer") =>
                      setSelectedMember({ ...selectedMember, role: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input
                    value={selectedMember.department || ""}
                    onChange={(e) =>
                      setSelectedMember({
                        ...selectedMember,
                        department: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {AVAILABLE_PERMISSIONS.map((perm) => (
                    <div key={perm.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${perm.key}`}
                        checked={selectedMember.permissions.includes(perm.key)}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(perm.key, !!checked, "edit")
                        }
                      />
                      <label
                        htmlFor={`edit-${perm.key}`}
                        className="text-sm cursor-pointer"
                      >
                        {perm.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <div className="text-sm text-muted-foreground">Total Members</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {teamMembers.filter((m) => m.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {teamMembers.filter((m) => m.role === "admin").length}
              </div>
              <div className="text-sm text-muted-foreground">Admins</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {teamMembers.filter((m) => m.role === "editor").length}
              </div>
              <div className="text-sm text-muted-foreground">Editors</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTeamManagement;
