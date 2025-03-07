import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";
import { useState } from "react";
import { API } from "@/lib/constants";
import { useAuthStore } from "@/lib/auth-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAutCredentials } = useAuthStore();

  return (
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Omerta</AlertDialogTitle>
          <AlertDialogDescription>
            In order to use this hack, you have to comply with the omerta
            agreement:
            <br /> I don't see, I don't hear, I don't speak.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <a href="https://www.google.com/search?q=snitch&oq=snitch&gs_lcrp=EgZjaHJvbWUyCQgAEEUYORiABDINCAEQLhivARjHARiABDIHCAIQABiABDIHCAMQABiABDIHCAQQLhiABDIHCAUQLhiABDIYCAYQLhgKGK8BGMcBGIsDGKYDGKgDGIAEMgwIBxAAGAoYiwMYgAQyBwgIEAAYjwIyBwgJEAAYjwLSAQc5NDZqMWo3qAIAsAIA&sourceid=chrome&ie=UTF-8">
            <AlertDialogCancel>I am snitch</AlertDialogCancel>
          </a>
          <AlertDialogAction>I Agree</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const url = `${API}/login`;
                const options = {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                  },
                  body: JSON.stringify({
                    username,
                    password,
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
                    setAutCredentials(
                      data.encrypted_username,
                      data.encrypted_password,
                      data.cookie
                    );
                    navigate("/app");
                  })
                  .catch((_err) => {
                    console.log("Shit went wrong!");
                  });
              }}
            >
              <div className="grid gap-6">
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-background text-muted-foreground relative z-10 px-2">
                    Fill your grader credentials
                  </span>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="username"
                      placeholder="pi..."
                      value={username}
                      onChange={(e) => {
                        e.preventDefault();
                        setUsername(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => {
                        e.preventDefault();
                        setPassword(e.target.value);
                      }}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <AlertDialogTrigger className="underline hover:cursor-pointer">
            Terms of Service
          </AlertDialogTrigger>
        </div>
      </div>
    </AlertDialog>
  );
}
