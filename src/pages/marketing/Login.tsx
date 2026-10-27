import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui';
import {
  AuthField,
  AuthHeading,
  AuthInput,
  AuthShell,
  EMAIL_RE,
  PasswordInput,
} from '@/components/marketing/auth/AuthShell';

type Errors = { email?: string; password?: string };

const EMAIL_ERROR = 'Informe um e-mail válido.';
const PASSWORD_ERROR = 'Informe sua senha.';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    document.title = 'Entrar — Morada';
    return () => window.clearTimeout(timer.current);
  }, []);

  const emailValid = EMAIL_RE.test(email.trim());

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const next: Errors = {};
    if (!emailValid) next.email = EMAIL_ERROR;
    if (!password) next.password = PASSWORD_ERROR;
    setErrors(next);
    if (next.email) return emailRef.current?.focus();
    if (next.password) return passwordRef.current?.focus();
    setSubmitting(true);
    timer.current = window.setTimeout(() => navigate('/app'), 600);
  }

  function onMagicLink() {
    if (!emailValid) {
      setErrors((prev) => ({ ...prev, email: EMAIL_ERROR }));
      emailRef.current?.focus();
      return;
    }
    setErrors((prev) => ({ ...prev, email: undefined }));
    toast(`Enviamos um link para ${email.trim()}.`);
  }

  return (
    <AuthShell>
      <AuthHeading title="Entrar na Morada." subtitle="Bom te ver de novo." />

      <form noValidate onSubmit={onSubmit} className="mt-10 flex flex-col gap-5">
        <AuthField id="login-email" label="E-mail" error={errors.email}>
          <AuthInput
            ref={emailRef}
            id="login-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email && EMAIL_RE.test(e.target.value.trim())) setErrors((p) => ({ ...p, email: undefined }));
            }}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'login-email-erro' : undefined}
          />
        </AuthField>

        <AuthField id="login-senha" label="Senha" error={errors.password}>
          <PasswordInput
            ref={passwordRef}
            id="login-senha"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password && e.target.value) setErrors((p) => ({ ...p, password: undefined }));
            }}
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? 'login-senha-erro' : undefined}
          />
        </AuthField>

        <a href="#" className="t-body-sm -mt-2 self-start py-1 text-verde hover:underline">
          Esqueci minha senha ›
        </a>

        <Button type="submit" size="lg" fullWidth disabled={submitting} aria-live="polite" className="mt-2">
          {submitting ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        <span className="t-body-sm text-ink-2">ou</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button variant="secondary" fullWidth onClick={onMagicLink}>
        Entrar com link por e-mail
      </Button>

      <p className="t-body mt-10 text-center text-ink-2">
        Ainda não tem conta?{' '}
        <Link to="/cadastro" className="text-verde hover:underline">
          Criar conta ›
        </Link>
      </p>
    </AuthShell>
  );
}
