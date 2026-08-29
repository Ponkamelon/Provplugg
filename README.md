# ProvPlugget

Next.js-scaffolding: autentisering + rollhantering (admin/elev) mot
Supabase-projektet **"plugg hjälp"**. Databasschemat (12 tabeller + RLS)
är redan uppsatt i Supabase enligt sektion 62 och 64 i kravspecen.

## Kom igång

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Öppna http://localhost:3000.

### Viktigt i Supabase-projektet innan du testar

1. **Authentication → URL Configuration**: lägg till
   `http://localhost:3000/auth/callback` under Redirect URLs (och senare
   din Vercel-URL, t.ex. `https://provplugget.vercel.app/auth/callback`).
2. **Authentication → Providers → Email**: om "Confirm email" är påslaget
   måste kontot bekräftas via mejl innan inloggning fungerar (appen
   hanterar båda lägena automatiskt, se nedan). Under utveckling är det
   ofta enklare att stänga av det.

## Hur autentiseringen funkar

Två roller, samma `profiles`-tabell, kopplade via `admin_id`:

- **Admin** (förälder/lärare) skapar konto direkt på `/skapa-konto`.
- **Elev** aktiverar sitt konto via en inbjudningslänk: `/valkommen/[token]`.
  Token kommer från `invitations`-tabellen (skapas när admin bygger
  "Lägg till elev"-flödet, sektion 11 — inte byggt i denna omgång).

Elevens profil skapas **aldrig** via ett vanligt insert från klienten —
det går bara genom databasfunktionen `accept_invitation()`, som verifierar
token och sätter rätt `admin_id` åt eleven. Det stänger en lucka där någon
annars skulle kunna registrera sig som "elev" under valfri admin.

Båda flödena funkar oavsett om Supabase-projektet kräver mejlbekräftelse:

- **Utan bekräftelse**: sessionen finns direkt efter `signUp()`, så profilen
  skapas/aktiveras på en gång.
- **Med bekräftelse**: `signUp()` ger ingen session förrän länken i mejlet
  klickats. Den länken pekar på `/auth/callback`, som slutför samma jobb
  (skapar admin-profilen, eller kör `accept_invitation()`) efter att koden
  bytts mot en session.

Middleware (`middleware.ts`) skyddar `/admin/*` och `/elev/*`: kollar att
personen är inloggad och har rätt roll, annars omdirigeras den till rätt
ställe. `lib/auth.ts` gör samma kontroll en gång till inne i layouterna som
extra skyddslager.

## Struktur

```
app/
  page.tsx                    Landningssida (redirectar inloggade)
  (auth)/layout.tsx           Delad "notebook card"-inramning
  (auth)/logga-in/            Inloggning
  (auth)/skapa-konto/         Admin-signup
  (auth)/valkommen/[token]/   Elevens kontoaktivering
  auth/callback/route.ts      Slutför signup/inbjudan efter mejlbekräftelse
  admin/                      Adminskal + dashboard (elevantal, genvägar)
  admin/elever/                Elevlista + väntande inbjudningar (sektion 12)
  admin/elever/ny/              "Lägg till elev"-formulär (sektion 11)
  elev/                       Elevskal + platshållar-dashboard
  actions/auth.ts             Server actions: login, signup, invite, logout
  actions/students.ts         Server actions: skapa/avbryt inbjudan
lib/
  supabase/{client,server,middleware}.ts   Supabase-klienter
  database.types.ts           Typer genererade från Supabase-schemat
  auth.ts                     requireProfile() — rollskydd i Server Components
components/
  WaveDivider.tsx              Signaturelementet — handritad våglinje
  CompassMark.tsx               Kompass-logotyp
```

## Designtokens

Se `app/globals.css` och `tailwind.config.ts`: sand/navy/ocean/turkos/
coral/sol-paletten och typsnittstrion Fraunces (rubriker) + Plus Jakarta
Sans (brödtext/UI) + IBM Plex Mono (siffror/statistik) från sektion 6 i
kravspecen. Elevläget hålls medvetet lugnare än adminläget — se sektion 7.

## AI-frågegenerering (sektion 20–38)

`/admin/prov/ny` skapar ämne (om det inte redan finns) + kapitel +
pluggprojekt + materialrad, och anropar sedan Claude
(`lib/ai/generateQuestions.ts`) med en systemprompt som kodar reglerna från
kravspecen: frågetypsfördelning, max ordlängd, confidence score,
årskursanpassning, "hitta aldrig på fakta". Svaret parsas som JSON och
sparas i `questions`-tabellen med `status: "draft"`.

En enkel ordöverlapps-dublettkontroll (`lib/ai/dedupe.ts`) filtrerar bort
frågor som ligger för nära varandra eller redan sparade frågor — ingen
semantisk embeddings-modell, men bra nog för uppenbara dubbletter.

**Kräver `ANTHROPIC_API_KEY`** i `.env.local` (skaffa på
console.anthropic.com/settings/keys). Byter du modell: leta upp
`"claude-sonnet-5"` i `lib/ai/generateQuestions.ts` — `claude-haiku-4-5-20251001`
är billigare/snabbare om kvaliteten räcker.

Om genereringen misslyckas (sektion 66) sparas materialet ändå — admin ser
ett felmeddelande på `/admin/prov/[id]` med en "Försök igen"-knapp.

## Admin-granskning & tilldelning (sektion 38–39)

`/admin/prov/[id]` listar alla genererade frågor med säkerhetsbadge
(hög säkerhet / bör granskas), och admin kan publicera enskilt, publicera
alla högsäkra på en gång, redigera (`/admin/prov/[id]/fraga/[qid]`), eller
ta bort. Endast `status: "published"` syns för elever. Samma sida har ett
tilldelningsformulär (kryssrutor per elev).

## Elevens quiz-flöde (sektion 41–46)

`/elev` visar tilldelade och publicerade pluggprojekt. `/elev/plugga/[id]`
låter eleven välja Snabbtest (5) / Test (10) / Längre test (20) / Träna
mina fel. Frågorna prioriteras enkelt adaptivt: tidigare fel → otestat →
redan säkert, och flervalsalternativ slumpas.

Själva testet (`components/QuizRunner.tsx`) är en klientkomponent: en fråga
per skärm, men **rättning sker alltid server-side**
(`app/actions/quiz.ts`) — eleven får aldrig facit förrän efter svar. Varje
svar skapar en `answers`-rad och uppdaterar `question_progress` med en
enkel tregradig mastery (fel → behöver tränas, två rätt i rad → sitter,
annars på gång). Resultatskärmen visar poäng och procent.

**Inte byggt:** den mer detaljerade resultatvyn som bryter ner "det här
sitter / träna mer på" per kunskapsdel (sektion 44) — just nu bara
totalpoäng.

## "Lägg till elev"-flödet

`/admin/elever` visar aktiva elever och väntande inbjudningar.
`/admin/elever/ny` skapar en `invitations`-rad med en slumpad token
(giltig 7 dagar) och skickar dig tillbaka med länken synlig i UI:t.

**Inget mejl skickas automatiskt än** — länken visas för admin att kopiera
och skicka manuellt (SMS, mejl, vad som funkar). Att koppla in en riktig
mejltjänst (t.ex. Resend eller en Supabase Edge Function) är ett bra nästa
steg när ni är redo för det.

## Nästa steg

Kärnloopen (admin skapar → AI genererar → admin granskar → elev pluggar →
resultat sparas) är komplett. Inte byggt än:

- Riktigt inbjudningsmejl (mejltjänst, t.ex. Resend) — länken visas bara i UI:t
- Foto/PDF-material (OCR/bildanalys) — bara inklistrad text stöds (detta är
  faktiskt Version 2 enligt sektion 70, inte MVP v1)
- `student_preferences`-inställningar och UI (ADHD/ADD/autism/dyslexi,
  sektion 54–61) — tabellen finns, men inget gränssnitt för att sätta dem
- Detaljerad resultatvy per kunskapsdel (sektion 44)
- Fokusläge, "Sikta mot stjärnorna", "Prov imorgon" (sektion 47–51 — Version 2/3 i specen)
- Elevens egna UI-preferenser (textstorlek, uppläsning, sektion 61)

## Deploy

Projektet är redo för Vercel: koppla GitHub-repot, sätt samma miljövariabler
som i `.env.local`, men med `NEXT_PUBLIC_SITE_URL` satt till din riktiga
domän.
