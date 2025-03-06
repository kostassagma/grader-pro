import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useCompsStore } from "@/lib/comps-store";
import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SubmitPage() {
  const params = useParams();
  const { setSelected, series, selected } = useCompsStore();
  const [seriesLabel, setSeriesLabel] = useState("");
  const [compLabel, setCompLabel] = useState("");

  useEffect(() => {
    if (params && params.id) {
      setSelected(params.id);
    }
  }, [params]);

  useEffect(() => {
    series.forEach((e) => {
      e.comps.forEach((comp) => {
        if (comp.id == selected) {
          setCompLabel(comp.label);
          setSeriesLabel(e.label);
        }
      });
    });
  }, [selected]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbItem>
                    {seriesLabel}
                  </BreadcrumbItem>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{compLabel}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1">
          <Editor
            height="100%"
            theme="vs-dark"
            defaultLanguage="cpp"
            defaultValue="// some comment"
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
