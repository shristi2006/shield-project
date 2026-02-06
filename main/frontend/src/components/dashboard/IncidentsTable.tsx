import React, { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import {
  RefreshCw,
  AlertTriangle,
  UserPlus,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";
import { getIncidents, assignIncident, updateIncidentStatus, addIncidentNote } from "@/services/incident.service";
import { onIncidentUpdate, onIncidentNew, offIncidentUpdate } from "@/services/socket.service";
import { useAuth } from "@/context/AuthContext";
import { SeverityBadge } from "./SeverityBadge";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import type { Incident, IncidentStatus, SocketIncidentEvent } from "@/types/api";

interface IncidentsTableProps {
  isAdmin?: boolean;
  className?: string;
}

export const IncidentsTable: React.FC<IncidentsTableProps> = ({
  isAdmin = false,
  className,
}) => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchIncidents = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getIncidents();
      setIncidents(data);
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();

    const handleUpdate = (data: SocketIncidentEvent) => {
      setIncidents((prev) =>
        prev.map((inc) =>
          inc._id === data.id
            ? { ...inc, status: data.status, updatedAt: data.updatedAt }
            : inc
        )
      );
    };

    const handleNewIncident = (incident: Incident) => {
      setIncidents((prev) => [incident, ...prev]);
      toast.warning("New incident detected", {
        description: incident.title,
      });
    };

    onIncidentUpdate(handleUpdate);
    onIncidentNew(handleNewIncident);

    return () => {
      offIncidentUpdate(handleUpdate);
    };
  }, [fetchIncidents]);

  const handleAssign = async (incident: Incident) => {
    setIsUpdating(true);
    try {
      await assignIncident(incident._id);
      toast.success("Incident assigned successfully");
      fetchIncidents();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to assign incident";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusUpdate = async (incidentId: string, status: IncidentStatus) => {
    setIsUpdating(true);
    try {
      await updateIncidentStatus(incidentId, status);
      toast.success(`Status updated to ${status}`);
      fetchIncidents();
      setIsManageDialogOpen(false);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update status";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!selectedIncident || !newNote.trim()) return;

    setIsUpdating(true);
    try {
      await addIncidentNote(selectedIncident._id, newNote.trim());
      toast.success("Note added successfully");
      setNewNote("");
      fetchIncidents();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to add note";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const filterIncidents = (filterType: string) => {
    switch (filterType) {
      case "assigned":
        return incidents.filter(
          (inc) =>
            inc.status === "ASSIGNED" &&
            (typeof inc.assignedTo === "object"
              ? inc.assignedTo?._id === user?.id
              : inc.assignedTo === user?.id)
        );
      case "pending":
        return incidents.filter(
          (inc) => inc.status === "IN_PROGRESS" || inc.status === "ASSIGNED"
        );
      case "new":
        return incidents.filter((inc) => inc.status === "OPEN");
      case "all":
      default:
        return incidents;
    }
  };

  const IncidentRow: React.FC<{ incident: Incident }> = ({ incident }) => (
    <TableRow className="hover:bg-muted/20">
      <TableCell className="font-mono text-xs text-muted-foreground">
        {incident._id.slice(-8)}
      </TableCell>
      <TableCell>
        <div className="max-w-[200px]">
          <p className="font-medium truncate">{incident.title}</p>
          <p className="text-xs text-muted-foreground font-mono">{incident.ip}</p>
        </div>
      </TableCell>
      <TableCell>
        <SeverityBadge severity={incident.severity} />
      </TableCell>
      <TableCell>
        <StatusBadge status={incident.status} />
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {typeof incident.assignedTo === "object" && incident.assignedTo
          ? incident.assignedTo.email
          : typeof incident.assignedTo === "string"
            ? incident.assignedTo
            : "—"}
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">
        {format(new Date(incident.createdAt), "MM/dd HH:mm")}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusUpdate(incident._id, "RESOLVED")}
                disabled={incident.status === "RESOLVED" || isUpdating}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Resolve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedIncident(incident);
                  setIsManageDialogOpen(true);
                }}
              >
                Manage
              </Button>
            </>
          ) : (
            <>
              {incident.status === "OPEN" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAssign(incident)}
                  disabled={isUpdating}
                >
                  <UserPlus className="w-3 h-3 mr-1" />
                  Request
                </Button>
              )}
              {(incident.status === "ASSIGNED" || incident.status === "IN_PROGRESS") &&
                (typeof incident.assignedTo === "object"
                  ? incident.assignedTo?._id === user?.id
                  : incident.assignedTo === user?.id) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedIncident(incident);
                      setIsManageDialogOpen(true);
                    }}
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    Details
                  </Button>
                )}
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  const IncidentTable: React.FC<{ incidents: Incident[] }> = ({ incidents: filteredIncidents }) => (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-mono text-xs">ID</TableHead>
            <TableHead className="font-mono text-xs">INCIDENT</TableHead>
            <TableHead className="font-mono text-xs">SEVERITY</TableHead>
            <TableHead className="font-mono text-xs">STATUS</TableHead>
            <TableHead className="font-mono text-xs">ASSIGNED TO</TableHead>
            <TableHead className="font-mono text-xs">CREATED</TableHead>
            <TableHead className="font-mono text-xs">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-muted-foreground font-mono text-sm">Loading...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredIncidents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No incidents found
              </TableCell>
            </TableRow>
          ) : (
            filteredIncidents.map((incident) => (
              <IncidentRow key={incident._id} incident={incident} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="text-lg font-semibold">Incidents</h3>
        </div>
        <Button variant="outline" size="sm" onClick={fetchIncidents} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {isAdmin ? (
        <IncidentTable incidents={filterIncidents("all")} />
      ) : (
        <Tabs defaultValue="assigned" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="assigned" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Assigned ({filterIncidents("assigned").length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending ({filterIncidents("pending").length})
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              New ({filterIncidents("new").length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="assigned">
            <IncidentTable incidents={filterIncidents("assigned")} />
          </TabsContent>
          <TabsContent value="pending">
            <IncidentTable incidents={filterIncidents("pending")} />
          </TabsContent>
          <TabsContent value="new">
            <IncidentTable incidents={filterIncidents("new")} />
          </TabsContent>
        </Tabs>
      )}

      {/* Manage Dialog */}
      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isAdmin ? "Manage Incident" : "Incident Details"}
            </DialogTitle>
            <DialogDescription>
              {selectedIncident?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Severity</Label>
                  <div className="mt-1">
                    <SeverityBadge severity={selectedIncident.severity} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <StatusBadge status={selectedIncident.status} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Source IP</Label>
                  <p className="font-mono text-sm mt-1">{selectedIncident.ip}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Created</Label>
                  <p className="font-mono text-sm mt-1">
                    {format(new Date(selectedIncident.createdAt), "yyyy-MM-dd HH:mm")}
                  </p>
                </div>
              </div>

              {isAdmin && (
                <div className="space-y-2">
                  <Label>Update Status</Label>
                  <Select
                    value={selectedIncident.status}
                    onValueChange={(value: IncidentStatus) =>
                      handleStatusUpdate(selectedIncident._id, value)
                    }
                    disabled={isUpdating}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="ASSIGNED">Assigned</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedIncident.notes && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Notes</Label>
                  <div className="bg-muted/30 rounded p-3 text-sm font-mono whitespace-pre-wrap max-h-32 overflow-auto">
                    {selectedIncident.notes}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Add Note</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <Button onClick={handleAddNote} disabled={isUpdating || !newNote.trim()}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManageDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
