import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookText,
  CalendarCheck,
  Sparkles,
  MessageCircleHeart,
  Flower2,
  ShieldCheck,
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

const responsibleAi = [
  "AI outputs may contain inaccuracies",
  "Users should verify information",
  "Human review is recommended before business decisions",
  "Recommendations do not replace medical or professional advice",
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

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Responsible AI
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ul className="space-y-1.5 px-2 pb-2 pt-1 text-[11px] leading-snug text-sidebar-foreground/70">
              {responsibleAi.map((line) => (
                <li key={line} className="flex gap-1.5">
                  <span aria-hidden className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
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