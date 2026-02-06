import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Shield,
  LayoutDashboard,
  ShieldBan,
  AlertTriangle,
  LogOut,
  Menu,
  Crown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { initSocket, disconnectSocket } from "@/services/socket.service";

const adminNavItems = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Blocked IPs", url: "/admin/blocked-ips", icon: ShieldBan },
  { title: "Incidents", url: "/admin/incidents", icon: AlertTriangle },
];

const AdminSidebarContent: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Shield className="w-8 h-8 text-primary" />
            <Crown className="w-4 h-4 text-warning absolute -top-1 -right-1" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-sm truncate">MicroSOC</h2>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="px-2 py-0.5 text-xs font-medium bg-destructive/20 text-destructive rounded">
            ADMIN
          </span>
          <span className="text-xs text-muted-foreground">Full Access</span>
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground font-mono">
            NAVIGATION
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-primary"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>
    </>
  );
};

const AdminDashboard: React.FC = () => {
  useEffect(() => {
    initSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-sidebar-border">
          <AdminSidebarContent />
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-card/50">
            <SidebarTrigger>
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
            <div className="flex-1" />
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
              ADMIN MODE
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
