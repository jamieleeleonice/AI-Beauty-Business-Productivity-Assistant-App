import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookText,
  CalendarCheck,
  Sparkles,
  MessageCircleHeart,
  Flower2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Notes Summarizer", url: "/notes", icon: NotebookText },
  { title: "Task Planner", url: "/planner", icon: CalendarCheck },
  { title: "Research Assistant", url: "/research", icon: Sparkles },
  { title: "Chat Assistant", url: "/chat", icon: MessageCircleHeart },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          to="/"
          className="flex items-center gap-2 px-2 py-2 text-sidebar-foreground"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Flower2 className="h-5 w-5" />
          </span>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-serif text-base">Lumen Beauty</span>
            <span className="text-[11px] text-muted-foreground">
              AI productivity studio
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active =
                  item.url === "/"
                    ? currentPath === "/"
                    : currentPath.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <p className="rounded-md bg-sidebar-accent/60 p-2 text-[11px] leading-snug text-sidebar-accent-foreground/80">
          AI-generated recommendations are intended for informational purposes
          and should not replace professional medical, dermatological, or
          business advice.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}