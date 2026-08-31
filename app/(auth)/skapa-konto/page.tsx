import Link from "next/link";
import { signUpAction } from "@/app/actions/auth";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy">
        Skapa konto
      </h1>
      <p className="mt-1 text-sm text-navy/60">
        Som förälder eller lärare — du bjuder in elever sen.
      </p>

      {searchParams.error && (
        <p className="mt-4 rounded-xl bg-coral/10 px-3 py-2 text-sm text-coral-dark">
          {searchParams.error}
        </p>
      )}

      <form action={signUpAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="displayName" className="field-label">
            Namn
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            autoComplete="name"
            required
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="email" className="field-label">
            E-post
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="password" className="field-label">
            Lösenord
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className="field-input"
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Skapa konto
        </button>
        <p className="text-center text-xs text-navy/50">
          Genom att skapa ett konto godkänner du vår{" "}
          <Link href="/integritetspolicy" className="underline">
            integritetspolicy
          </Link>
          .
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-navy/60">
        Har du redan ett konto?{" "}
        <Link href="/logga-in" className="font-medium text-ocean underline">
          Logga in
        </Link>
      </p>
    </div>
  );
}
