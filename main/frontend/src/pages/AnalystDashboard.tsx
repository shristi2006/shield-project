import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  LayoutDashboard,
  FileText,
  AlertTriangle,
  LogOut,
  Menu,
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
  useSidebar,
} from "@/components/ui/sidebar";
import { initSocket, disconnectSocket } from "@/services/socket.service";

const analystNavItems = [
  { title: "Overview", url: "/analyst", icon: LayoutDashboard },
  { title: "Live Logs", url: "/analyst/logs", icon: FileText },
  { title: "Incidents", url: "/analyst/incidents", icon: AlertTriangle },
];

const AnalystSidebarContent: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full pulse-dot" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-sm truncate">MicroSOC</h2>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded">
            ANALYST
          </span>
          <span className="text-xs text-muted-foreground">Active</span>
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground font-mono">
            NAVIGATION
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analystNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/analyst"}
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

const AnalystDashboard: React.FC = () => {
  useEffect(() => {
    // Initialize socket connection
    initSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-sidebar-border">
          <AnalystSidebarContent />
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-card/50">
            <SidebarTrigger>
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
            <div className="flex-1" />
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              LIVE MONITORING ACTIVE
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

export default AnalystDashboard;
