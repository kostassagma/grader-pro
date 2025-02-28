import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Editor from "@monaco-editor/react";

export default function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Tabs defaultValue="account" className="">
            <TabsList>
              <TabsTrigger value="1">main.cpp</TabsTrigger>
              <TabsTrigger value="2">babyratio.cpp</TabsTrigger>
              <TabsTrigger value="3">babyratio.cpp</TabsTrigger>
            </TabsList>
          </Tabs>
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
