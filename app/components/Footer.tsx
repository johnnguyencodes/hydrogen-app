import {Suspense} from 'react';
import {Await} from '@remix-run/react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {ExternalLink} from 'lucide-react';

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
            <div className="relative flex-1">
              {footer?.menu && header.shop.primaryDomain?.url && <FooterMenu />}
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu() {
  return (
    <>
      <div className="xxs:block xs:flex items-center justify-end sm:h-16 xxs:text-sm sm:text-base xxs:mx-0 xs:mx-5 2xl:mx-0">
        <div className="justify-end items-center text-center xxs:block md:flex my-2">
          <p className="mx-2">John Nguyen</p>
        </div>
        <span className="mx-2 hidden xs:block">|</span>
        <hr className="mx-10 xs:hidden" />
        <div className="flex flex-wrap justify-center my-2">
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
            className="flex items-center ml-2 text-[var(--color-fg-text)] hover:text-[var(--color-fg-text-hover)]"
          >
            <span className="inline-flex items-center border-b border-transparent hover:border-current">
              GitHub
              <ExternalLink size="16" className="ml-1" />
            </span>
          </a>
        </div>
      </div>
    </>
  );
}
