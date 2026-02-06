import React, { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { RefreshCw, ShieldBan, Plus } from "lucide-react";
import { getBlockedIPs, blockIP } from "@/services/blockedIP.service";
import { onAttackBlocked, offAttackBlocked } from "@/services/socket.service";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import type { BlockedIP, SocketBlockedEvent } from "@/types/api";

interface BlockedIPsTableProps {
  className?: string;
}

export const BlockedIPsTable: React.FC<BlockedIPsTableProps> = ({
  className,
}) => {
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIP, setNewIP] = useState("");
  const [newReason, setNewReason] = useState("");
  const [isBlocking, setIsBlocking] = useState(false);

  const fetchBlockedIPs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getBlockedIPs();
      setBlockedIPs(data);
    } catch (error) {
      console.error("Failed to fetch blocked IPs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlockedIPs();

    const handleBlocked = (data: SocketBlockedEvent) => {
      const newBlocked: BlockedIP = {
        _id: Date.now().toString(),
        ip: data.ip,
        reason: data.reason,
        blockedAt: data.time,
      };
      setBlockedIPs((prev) => [newBlocked, ...prev]);
      toast.warning(`IP ${data.ip} has been blocked`, {
        description: data.reason,
      });
    };

    onAttackBlocked(handleBlocked);

    return () => {
      offAttackBlocked(handleBlocked);
    };
  }, [fetchBlockedIPs]);

  const handleBlockIP = async () => {
    if (!newIP.trim() || !newReason.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // Basic IP validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(newIP.trim())) {
      toast.error("Invalid IP address format");
      return;
    }

    setIsBlocking(true);
    try {
      await blockIP(newIP.trim(), newReason.trim());
      toast.success(`IP ${newIP} has been blocked`);
      setNewIP("");
      setNewReason("");
      setIsDialogOpen(false);
      fetchBlockedIPs();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to block IP";
      toast.error(message);
    } finally {
      setIsBlocking(false);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <ShieldBan className="w-5 h-5 text-destructive" />
          <h3 className="text-lg font-semibold">Blocked IP Addresses</h3>
          <span className="px-2 py-0.5 text-xs font-mono bg-destructive/20 text-destructive rounded">
            {blockedIPs.length} blocked
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBlockedIPs}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-destructive hover:bg-destructive/90">
                <Plus className="w-4 h-4 mr-2" />
                Block IP
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Block IP Address</DialogTitle>
                <DialogDescription>
                  Manually block an IP address from accessing the system.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="ip">IP Address</Label>
                  <Input
                    id="ip"
                    placeholder="192.168.1.1"
                    value={newIP}
                    onChange={(e) => setNewIP(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Input
                    id="reason"
                    placeholder="Suspicious activity detected"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBlockIP}
                  disabled={isBlocking}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isBlocking ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                      Blocking...
                    </span>
                  ) : (
                    "Block IP"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-mono text-xs">IP ADDRESS</TableHead>
              <TableHead className="font-mono text-xs">REASON</TableHead>
              <TableHead className="font-mono text-xs">BLOCKED AT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-muted-foreground font-mono text-sm">
                      Loading...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : blockedIPs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  No blocked IPs
                </TableCell>
              </TableRow>
            ) : (
              blockedIPs.map((ip) => (
                <TableRow key={ip._id} className="hover:bg-muted/20">
                  <TableCell className="font-mono text-sm">
                    <span className="text-destructive">{ip.ip}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                    {ip.reason}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {format(new Date(ip.blockedAt), "yyyy-MM-dd HH:mm:ss")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
