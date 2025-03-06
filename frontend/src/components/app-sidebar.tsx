import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/lib/auth-store";
import { useCompsStore } from "@/lib/comps-store";
import { API } from "@/lib/constants";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { cookie } = useAuthStore();
  const { setSeries, series, selected } = useCompsStore();

  console.log(series);

  React.useEffect(() => {
    if (!cookie) return;
    console.log(cookie);

    const url = `${API}/get-competitions`;
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        cookie,
      }),
    };

    fetch(url, options)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("");
        }
      })
      .then((_data) => {
        setSeries(_data.series);
      });
  }, [cookie]);

  return (
    <Sidebar {...props}>
      <div className="flex p-3 flex-row gap-2">
        <div className="bg-blue-800 flex h-full aspect-square rounded-md p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            fill="currentColor"
            className="m-auto"
            viewBox="0 0 16 16"
          >
            <path d="M3 4.5h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM1 2a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 2m0 12a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 14" />
          </svg>
        </div>
        <h2 className="font-medium my-auto">Active Competitions:</h2>
      </div>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {series.map((item) => (
          <Collapsible
            key={item.label}
            title={item.label}
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {item.label}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.comps.map((comp) => (
                      <SidebarMenuItem key={comp.label}>
                        <SidebarMenuButton asChild isActive={selected==comp.id}>
                          <Link to={`/app/${comp.id}`}>{comp.label}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
