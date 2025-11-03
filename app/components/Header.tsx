import {useEffect, useState} from 'react';
import {NavLink} from 'react-router';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Button} from './ui/button';
import {AlignJustify, MoonStar, Sun} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({header, publicStoreDomain}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <div>
      <header className="header relative bg-[var(--color-bg-5)] text-[var(--color-fg-text)] before:content-[''] before:absolute before:inset-0 before:-mx-[calc((100vw-100%)/2)] before:w-screen before:bg-[var(--color-bg-5)] flex items-center h-16 text-base">
        <NavLink
          prefetch="intent"
          to="/"
          style={activeLinkStyle}
          className="z-10 ml-5 2xl:ml-0"
          end
        >
          <strong>{shop.name}</strong>
        </NavLink>
        <div className="relative z-10 flex-1">
          <div className="hidden sm:block">
            <HeaderMenu
              menu={menu}
              viewport="desktop"
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
            />
          </div>
        </div>
        <div className="flex sm:hidden z-50 items-center mr-5">
          <HeaderMenuMobileToggle />
        </div>
      </header>
    </div>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const headerMenuClassName = `header-menu-${viewport} flex items-center justify-between w-full`;
  const {close} = useAside();

  const loadFromLocalStorage = (key: string): string | null => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.warn(`Unable to access localStorage for key: ${key}`, error);
    }
    return null;
  };

  const {isDarkMode, toggleDarkMode} = useDarkMode();

  function useDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
      const savedTheme = loadFromLocalStorage('theme');

      const prefersDark = window.matchMedia?.(
        '(prefers-color-scheme: dark)',
      ).matches;
      const shouldUseDark =
        savedTheme === 'dark' || (!savedTheme && prefersDark);

      setIsDarkMode(shouldUseDark);
      document.documentElement.classList.toggle('dark', shouldUseDark);
    }, []);

    const toggleDarkMode = () => {
      setIsDarkMode((prev) => {
        const nextMode = !prev;
        document.documentElement.classList.toggle('dark', nextMode);
        localStorage.setItem('theme', nextMode ? 'dark' : 'light');
        return nextMode;
      });
    };

    return {isDarkMode, toggleDarkMode};
  }
  return (
    <nav className={headerMenuClassName} role="navigation">
      <div className="flex items-center mx-auto">
        {HEADER_MENU_1.items.map((item) => {
          if (!item.url) return null;

          // if the url is internal, we strip the domain
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <NavLink
              className="header-menu-item text-[var(--color-fg-text)] mx-2"
              end={false}
              key={item.id}
              onClick={close}
              prefetch="intent"
              style={({isActive}) => ({
                fontWeight: isActive ? 'bold' : undefined,
              })}
              to={url}
            >
              {item.title}
            </NavLink>
          );
        })}
        <span className="mx-2">|</span>
        {HEADER_MENU_2.items.map((item) => {
          if (!item.url) return null;

          // if the url is internal, we strip the domain
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <NavLink
              className="header-menu-item text-[var(--color-fg-text)] mx-2"
              end={false}
              key={item.id}
              onClick={close}
              prefetch="intent"
              style={({isActive}) => ({
                fontWeight: isActive ? 'bold' : undefined,
              })}
              to={url}
            >
              {item.title}
            </NavLink>
          );
        })}
      </div>
      <Button
        onClick={toggleDarkMode}
        className="w-7 h-7 mr-5 2xl:mr-0"
        data-testid="themeToggle"
        variant="default"
      >
        {isDarkMode ? (
          <MoonStar className="h-4 w-4"></MoonStar>
        ) : (
          <Sun className="h-4 w-4"></Sun>
        )}
      </Button>
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <nav role="navigation">
      <button onClick={() => open('mobile')}>
        <h3>
          <AlignJustify />
        </h3>
      </button>
    </nav>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
}

const HEADER_MENU_1 = {
  id: '',
  items: [
    {
      id: 'header-menu-about',
      title: 'About',
      url: '/about',
    },
    {
      id: 'header-menu-projects',
      title: 'Projects',
      url: '/projects',
    },
    {
      id: 'header-menu-gadgets',
      title: 'Gadgets',
      url: '/gadgets',
    },
    {
      id: 'header-menu-blog',
      title: 'Blog',
      url: '/blogs/blog',
    },
  ],
};

const HEADER_MENU_2 = {
  id: '',
  items: [
    {
      id: 'header-menu-plants',
      title: 'Plants',
      url: '/plants',
    },
    {
      id: 'header-menu-photography',
      title: 'Photography',
      url: '/photography',
    },
    {
      id: 'header-menu-trails',
      title: 'Trails',
      url: '/trails',
    },
    {
      id: 'header-menu-curios',
      title: 'Curios',
      url: '/curios',
    },
    {
      id: 'header-menu-notes',
      title: 'Notes',
      url: '/blogs/notes',
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'var(--color-fg-text)' : 'var(--color-fg-text)',
  };
}
