import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Badge, Button } from '@/components/ui';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AuthField,
  AuthHeading,
  AuthInput,
  AuthShell,
  EMAIL_RE,
  PasswordInput,
} from '@/components/marketing/auth/AuthShell';
import { cn } from '@/lib/cn';

type Field = 'name' | 'email' | 'password' | 'units' | 'terms';
type Errors = Partial<Record<Field, string>>;

const PLAN_NAMES: Record<string, string> = { essencial: 'Essencial', pro: 'Pro', anfitriao: 'Anfitrião' };

const UNIT_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2-5', label: '2 a 5' },
  { value: '6-10', label: '6 a 10' },
  { value: '10+', label: 'Mais de 10' },
];

const MESSAGES: Record<Field, string> = {
  name: 'Informe seu nome.',
  email: 'Informe um e-mail válido.',
  password: 'Use pelo menos 8 caracteres.',
  units: 'Escolha uma opção.',
  terms: 'Aceite os termos para continuar.',
};

const ORDER: Field[] = ['name', 'email', 'password', 'units', 'terms'];

/** 0 = vazio, 1 = fraca, 2 = média, 3 = forte. */
function passwordStrength(pw: string): 0 | 1 | 2 | 3 {
  if (!pw) return 0;
  if (pw.length < 8) return 1;
  const variety = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) => re.test(pw)).length;
  if (pw.length >= 10 && variety >= 3) return 3;
  return 2;
}

const STRENGTH_LABEL = ['', 'fraca', 'média', 'forte'] as const;
const STRENGTH_COLOR = ['', 'bg-danger', 'bg-warning', 'bg-verde'] as const;

export default function Signup() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const planId = params.get('plano') ?? '';
  const planName = PLAN_NAMES[planId];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [units, setUnits] = useState('');
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const unitsRef = useRef<HTMLButtonElement>(null);
  const termsRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.title = 'Criar conta — Morada';
  }, []);

  const values = { name, email, password, units, terms };

  function check(field: Field, v = values): boolean {
    switch (field) {
      case 'name':
        return v.name.trim().length > 0;
      case 'email':
        return EMAIL_RE.test(v.email.trim());
      case 'password':
        return v.password.length >= 8;
      case 'units':
        return v.units !== '';
      case 'terms':
        return v.terms;
    }
  }

  /** Limpa o erro do campo assim que ele fica válido. */
  function revalidate(field: Field, patch: Partial<typeof values>) {
    if (errors[field] && check(field, { ...values, ...patch })) {
      setErrors((p) => ({ ...p, [field]: undefined }));
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Errors = {};
    for (const f of ORDER) if (!check(f)) next[f] = MESSAGES[f];
    setErrors(next);
    const first = ORDER.find((f) => next[f]);
    if (first) {
      const target = { name: nameRef, email: emailRef, password: passwordRef, units: unitsRef, terms: termsRef }[first];
      target.current?.focus();
      return;
    }
    navigate('/app/imoveis/novo');
  }

  const describe = (field: Field, extra?: string) =>
    [errors[field] ? `${fieldId(field)}-erro` : '', extra ?? ''].filter(Boolean).join(' ') || undefined;
  const invalid = (field: Field) => (errors[field] ? true : undefined);

  const strength = passwordStrength(password);

  return (
    <AuthShell>
      {planName && (
        <p className="mb-6 flex flex-wrap items-center gap-3">
          <Badge tone="verde">Plano {planName} selecionado</Badge>
          <Link to="/precos" className="t-body-sm text-verde hover:underline">
            Trocar ›
          </Link>
        </p>
      )}

      <AuthHeading title="Crie sua conta." subtitle="14 dias grátis. Sem cartão de crédito." />

      <form noValidate onSubmit={onSubmit} className="mt-10 flex flex-col gap-5">
        <AuthField id={fieldId('name')} label="Nome completo" error={errors.name}>
          <AuthInput
            ref={nameRef}
            id={fieldId('name')}
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              revalidate('name', { name: e.target.value });
            }}
            aria-invalid={invalid('name')}
            aria-describedby={describe('name')}
          />
        </AuthField>

        <AuthField id={fieldId('email')} label="E-mail" error={errors.email}>
          <AuthInput
            ref={emailRef}
            id={fieldId('email')}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              revalidate('email', { email: e.target.value });
            }}
            aria-invalid={invalid('email')}
            aria-describedby={describe('email')}
          />
        </AuthField>

        <AuthField
          id={fieldId('password')}
          label="Senha"
          error={errors.password}
          hint={
            <div id="cadastro-senha-forca" className="flex items-center gap-3" aria-live="polite">
              <div className="flex flex-1 gap-1.5" aria-hidden="true">
                {[1, 2, 3].map((bar) => (
                  <span
                    key={bar}
                    className={cn('h-1 flex-1 rounded-pill', strength >= bar ? STRENGTH_COLOR[strength] : 'bg-line')}
                  />
                ))}
              </div>
              <span className="t-caption w-24 text-right text-ink-2">
                {strength ? `Força: ${STRENGTH_LABEL[strength]}` : 'Mínimo 8 caracteres'}
              </span>
            </div>
          }
        >
          <PasswordInput
            ref={passwordRef}
            id={fieldId('password')}
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              revalidate('password', { password: e.target.value });
            }}
            aria-invalid={invalid('password')}
            aria-describedby={describe('password', 'cadastro-senha-forca')}
          />
        </AuthField>

        <AuthField id={fieldId('units')} label="Quantos imóveis você tem?" error={errors.units}>
          <Select
            value={units}
            onValueChange={(v) => {
              setUnits(v);
              revalidate('units', { units: v });
            }}
          >
            <SelectTrigger
              ref={unitsRef}
              id={fieldId('units')}
              className="h-12! w-full rounded-md border-line-strong bg-surface px-3.5 text-[17px] text-ink aria-invalid:border-danger"
              aria-invalid={invalid('units')}
              aria-describedby={describe('units')}
            >
              <SelectValue placeholder="Escolha uma opção" />
            </SelectTrigger>
            <SelectContent position="popper">
              {UNIT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-[17px]">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </AuthField>

        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <Checkbox
              ref={termsRef}
              id={fieldId('terms')}
              checked={terms}
              onCheckedChange={(v) => {
                const on = v === true;
                setTerms(on);
                revalidate('terms', { terms: on });
              }}
              className="mt-0.5 size-5 border-line-strong data-checked:border-verde data-checked:bg-verde data-checked:text-on-verde aria-invalid:border-danger"
              aria-invalid={invalid('terms')}
              aria-describedby={describe('terms')}
            />
            <Label htmlFor={fieldId('terms')} className="t-body-sm block font-normal text-ink">
              Li e aceito os{' '}
              <a href="#" className="text-verde underline-offset-2 hover:underline">
                Termos de uso
              </a>{' '}
              e a{' '}
              <a href="#" className="text-verde underline-offset-2 hover:underline">
                Política de privacidade
              </a>
            </Label>
          </div>
          {errors.terms && (
            <p id={`${fieldId('terms')}-erro`} className="t-body-sm text-danger">
              {errors.terms}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" fullWidth className="mt-2">
          Criar conta
        </Button>
      </form>

      <p className="t-body mt-10 text-center text-ink-2">
        Já tem conta?{' '}
        <Link to="/entrar" className="text-verde hover:underline">
          Entrar ›
        </Link>
      </p>
    </AuthShell>
  );
}

function fieldId(field: Field) {
  const map: Record<Field, string> = {
    name: 'cadastro-nome',
    email: 'cadastro-email',
    password: 'cadastro-senha',
    units: 'cadastro-imoveis',
    terms: 'cadastro-termos',
  };
  return map[field];
}
