import {Suspense} from 'react';
import {Await} from '@remix-run/react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {ExternalLink} from 'lucide-react';
import {useState, useEffect} from 'react';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({footer: footerPromise, header}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="relative bg-[var(--color-bg-5)] text-[var(--color-fg-text)] before:content-[''] before:absolute before:inset-0 before:-mx-[calc((100vw-100%)/2)] before:w-screen before:bg-[var(--color-bg-5)] flex items-center">
            <div className="relative z-10 2xl:mx-0 flex-1">
              {footer?.menu && header.shop.primaryDomain?.url && <FooterMenu />}
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="flex items-center justify-end h-16">
      <p className="mx-2">&copy; {year} John Nguyen</p>
      <span className="mx-2">|</span>
      <a
        href="https://www.shopfiy.com"
        target="_blank"
        rel="noreferrer noopener"
        className="flex items-center mx-2 text-[var(--color-fg-text)] hover:text-[var(--color-fg-text-hover)]"
      >
        <span className="inline-flex items-center border-b border-transparent hover:border-current">
          Shopify
          <ExternalLink size="16" className="ml-1" />
        </span>
      </a>
      <a
        href="https://hydrogen.shopfiy.com"
        target="_blank"
        rel="noreferrer noopener"
        className="flex items-center mx-2 text-[var(--color-fg-text)] hover:text-[var(--color-fg-text-hover)]"
      >
        <span className="inline-flex items-center border-b border-transparent hover:border-current">
          Hydrogen
          <ExternalLink size="16" className="ml-1" />
        </span>
      </a>
      <a
        href="https://github.com/johnnguyencodes/hydrogen-app"
        target="_blank"
        rel="noreferrer noopener"
        className="flex items-center mx-2 text-[var(--color-fg-text)] hover:text-[var(--color-fg-text-hover)]"
      >
        <span className="inline-flex items-center border-b border-transparent hover:border-current">
          GitHub
          <ExternalLink size="16" className="ml-1" />
        </span>
      </a>
    </div>
  );
}
