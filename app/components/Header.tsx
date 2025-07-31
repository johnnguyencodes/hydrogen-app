import {Suspense, useEffect, useState} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Button} from './ui/button';
import {MoonStar, Sun} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="header relative bg-[var(--color-bg-5)] text-[var(--color-fg-text)] before:content-[''] before:absolute before:inset-0 before:-mx-[calc((100vw-100%)/2)] before:w-screen before:bg-[var(--color-bg-5)] h-16 flex items-center">
      <NavLink
        prefetch="intent"
        to="/"
        style={activeLinkStyle}
        className="z-10"
        end
      >
        <strong>{shop.name}</strong>
      </NavLink>
      <div className="relative z-10 xs:mx-5 2xl:mx-0 flex-1">
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </div>
    </header>
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
      <div className="flex items-center">
        {viewport === 'mobile' && (
          <NavLink
            end
            onClick={close}
            prefetch="intent"
            style={activeLinkStyle}
            to="/"
          >
            Home
          </NavLink>
        )}
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
              end
              key={item.id}
              onClick={close}
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
            >
              {item.title}
            </NavLink>
          );
        })}
        |
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
              end
              key={item.id}
              onClick={close}
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
            >
              {item.title}
            </NavLink>
          );
        })}
      </div>
      <Button
        onClick={toggleDarkMode}
        className="w-7 h-7"
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

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
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

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
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
      id: 'header-menu-env',
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
