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
import { useAuthStore } from "@/lib/auth-store";
import { useCompsStore } from "@/lib/comps-store";
import { API } from "@/lib/constants";
import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SubmitPage() {
  const { cookie, encryptedPassword, encryptedUsername } = useAuthStore();
  const params = useParams();
  const { setSelected, series, selected } = useCompsStore();
  const [seriesLabel, setSeriesLabel] = useState("");
  const [compLabel, setCompLabel] = useState("");
  const [file, setFile] = useState(initialFile);

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
                  <BreadcrumbItem>{seriesLabel}</BreadcrumbItem>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{compLabel}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto fixed top-3 right-3">
              <button
                className="py-2 px-4 bg-blue-800 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  const url = `${API}/submit`;
                  const options = {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json;charset=UTF-8",
                    },
                    body: JSON.stringify({
                      encryptedPassword,
                      encryptedUsername,
                      cookie,
                      file,
                      taskId: selected,
                    }),
                  };

                  fetch(url, options)
                    .then((response) => {
                      if (response.ok) {
                        return response.json();
                      } else {
                        throw new Error("");
                      }
                    })
                    .then((data) => {
                      console.log(data);
                    })
                    .catch((_err) => {
                      console.log("Shit went wrong!");
                    });
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </header>
        <div className="flex-1">
          <Editor
            height="100%"
            theme="vs-dark"
            defaultLanguage="cpp"
            onChange={(value, _event) => {
              if (value) setFile(value);
            }}
            defaultValue={file}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

const initialFile = `#include <iostream>

using namespace std;

int main() {
  cout << "Hello World" << endl;
  return 0;
}

`;
