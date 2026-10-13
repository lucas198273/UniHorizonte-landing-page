import { Link, NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { Container } from '../ui/Container';

/** Caminho da logo. Salve a imagem em /public/assets/logo.png (ou ajuste aqui). */
const LOGO_SRC = '/assets/logo.png';
const LOGO_ALT = 'UniHorizontes - Centro Universitário';

const navItems = [
  { to: '/',           label: 'Início' },
  { to: '/categorias', label: 'Categorias' },
  { to: '/sobre',      label: 'Sobre' },
  { to: '/cursos',     label: 'Cursos' },
  { to: '/contato',    label: 'Contato' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <Container>
        <div className="flex h-[72px] items-center justify-between gap-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center"
            aria-label="UniHorizontes - Página inicial"
          >
          <img
  src={LOGO_SRC}
  alt={LOGO_ALT}
  width={140}
  height={56}
  {...({ fetchpriority: 'high' } as Record<string, string>)}
  decoding="async"
  className="h-14 w-auto"
/>
          </Link>

          {/* Navegação */}
          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'text-[14px] font-medium transition-colors',
                    isActive
                      ? 'text-[#3E9642]'
                      : 'text-[#444444] hover:text-[#222222]',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Ações à direita */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Buscar"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#222222]"
            >
              <SearchIcon />
            </button>

            <Link
              to="/acesso-academico"
              className="hidden h-10 items-center rounded-lg bg-[#72D45A] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#5FC94B] sm:inline-flex"
            >
              Acesso Acadêmico
            </Link>

            <button
              type="button"
              aria-label="Abrir menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 md:hidden"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}

/* Ícones inalterados */
function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 3.5 3.5" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}