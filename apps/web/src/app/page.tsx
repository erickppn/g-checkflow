import { createFileRoute, redirect } from "@tanstack/react-router";

import loginBackground from "@/imgs/login-background.png";
import { FileText, Lock, LogIn, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLogin } from "@/features/auth/auth.mutations";
import { toast } from "react-toastify";
import { authQueries } from "@/features/auth/auth.queries";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(
        authQueries.currentUser(),
      );
    } catch {
      return;
    }

    throw redirect({
      to: "/dashboard",
    });
  },

  component: Home,
});

function Home() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const login = useLogin();
  const navigate = Route.useNavigate();

  const currentYear = new Date().getFullYear();

  const updateField = <K extends keyof typeof form>(
    field: K,
    value: (typeof form)[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  function handleLogin(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      email: form.email.trim(),
      password: form.password,
    };

    login.mutate(payload, {
      onSuccess: () => {
        navigate({
          to: "/dashboard",
        });
      },

      onError: () => {
        toast.error("E-mail ou senha inválidos");
      },
    });
  }

  return (
    <main className="flex min-h-dvh w-full">
      <section
        className="relative bg hidden w-1/2 flex-col justify-between overflow-hidden bg-cover  p-16 text-white lg:flex"
        style={{
          backgroundImage: `url(${loginBackground})`,
        }}
      >
        <div className="absolute inset-0 bg-slate-950/45" />

        <div className="relative z-10 mt-40">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-xl bg-white text-blue-600 shadow-lg">
              <FileText className="size-7" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Sistema de Cheques
              </h1>

              <p className="mt-1 text-lg text-blue-100">
                Potencial Jeans
              </p>
            </div>
          </div>

          <div className="mt-6 h-1 w-18 rounded-full bg-blue-400" />

          <p className="mt-6 max-w-md leading-relaxed text-blue-50">
            Sistema interno para gestão e controle de
            operações e cheques da empresa.
          </p>
        </div>

        <footer className="relative z-10 text-sm text-blue-200">
          <p>© {currentYear} Potencial Jeans. Todos os direitos reservados.</p>

          <p className="mt-1">
            Desenvolvido por
            <a
              href="https://www.linkedin.com/in/erickppn/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 underline hover:text-white transition-colors"
            >
              Erick Prospero
            </a>
          </p>
        </footer>
      </section>

      <section className="flex flex-col w-full items-center justify-center bg-background px-8 py-12 lg:w-1/2 lg:px-20">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <Lock className="size-7" />
            </div>

            <h2 className="mt-6 text-2xl font-bold tracking-tight">
              Acesse a sua conta
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Informe suas credenciais para continuar
            </p>
          </div>

          <form className="mt-10 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">
                E-mail
              </Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="seu.email@potencialjeans.com.br"
                  className="h-12 pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Senha
              </Label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Digite sua senha"
                  className="h-12 pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full"
              disabled={login.isPending}
            >
              <LogIn />
              {login.isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-8 border-t pt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Sistema interno corporativo • Potencial Jeans
            </p>
          </div>
        </div>

        <p className="mt-1 text-xs text-muted-foreground lg:hidden">
          Desenvolvido por
          <a
            href="https://www.linkedin.com/in/erickppn/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 underline hover:text-white transition-colors"
          >
            Erick Prospero
          </a>
        </p>
      </section>
    </main>
  );
}