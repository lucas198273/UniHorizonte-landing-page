import { useMemo, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';

/** Mesmo caminho do Header — salve a logo em /public/logo.png. */
const LOGO_SRC = '/assets/logo.png';
const LOGO_ALT = 'UniHorizontes - Centro Universitário';

export function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);

  function handleNewsletterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: integrar com API de newsletter
  }

  return (
    <footer className="mt-16 border-t border-[#1F3028] bg-[#111D19] text-white">
      <Container className="py-10 sm:py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          {/* Identidade */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center"
              aria-label="UniHorizontes - Página inicial"
            >
              <img
                src={LOGO_SRC}
                alt={LOGO_ALT}
                loading="lazy"
                decoding="async"
                className="h-11 w-auto brightness-0 invert"
              />
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
              Informação, conhecimento e conteúdo para ampliar seus horizontes.
            </p>

            <p className="mt-6 text-xs text-slate-500">
              © {year} UniHorizontes. Todos os direitos reservados.
            </p>
          </div>

          {/* Links úteis */}
          <div>
            <h3 className="text-sm font-semibold text-white">Links úteis</h3>
            <nav className="mt-4 flex flex-col gap-3">
              <Link
                to="/blog"
                className="w-fit text-sm text-slate-400 transition-colors hover:text-[#72D45A]"
              >
                Blog
              </Link>
              <Link
                to="/cursos"
                className="w-fit text-sm text-slate-400 transition-colors hover:text-[#72D45A]"
              >
                Cursos
              </Link>
            </nav>
          </div>

          {/* Redes sociais */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Siga a UniHorizontes
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition-all hover:border-[#72D45A] hover:text-[#72D45A]"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition-all hover:border-[#72D45A] hover:text-[#72D45A]"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition-all hover:border-[#72D45A] hover:text-[#72D45A]"
              >
                <LinkedinIcon />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Receba novidades no seu e-mail
            </h3>
            <p className="mt-2 text-sm leading-5 text-slate-400">
              Fique por dentro das novidades e conteúdos da UniHorizontes.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="mt-4 flex overflow-hidden rounded-lg border border-slate-700 bg-[#18241F] focus-within:border-[#72D45A]"
            >
              <input
                type="email"
                required
                placeholder="Seu e-mail"
                aria-label="Seu e-mail"
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="shrink-0 bg-[#72D45A] px-4 py-2.5 text-sm font-semibold text-[#163018] transition-colors hover:bg-[#5FC94B]"
              >
                Assinar
              </button>
            </form>
          </div>
        </div>

        {/* Linha inferior */}
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Conteúdo desenvolvido para a comunidade UniHorizontes.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="transition-colors hover:text-slate-300">
              Política de Privacidade
            </a>
            <a href="#" className="transition-colors hover:text-slate-300">
              Termos de Uso
            </a>
          </div>
        </div>
      </Container>

      {/* Barra de identidade */}
      <div className="h-1 bg-[#72D45A]" />
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/* Ícones                                                                     */
/* -------------------------------------------------------------------------- */

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.7" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a21 21 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.6v8h3.4Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5.1 7.2A2.1 2.1 0 1 0 5.1 3a2.1 2.1 0 0 0 0 4.2ZM3.3 20.8h3.6V9.2H3.3v11.6ZM9.1 9.2h3.4v1.6h.1c.5-.9 1.7-1.9 3.6-1.9 3.8 0 4.5 2.5 4.5 5.8v6.1h-3.6v-5.4c0-1.3 0-3.1-1.9-3.1s-2.2 1.5-2.2 3v5.5H9.1V9.2Z" />
    </svg>
  );
}