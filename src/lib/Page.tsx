import type { ReactNode } from "react";
import { Tools } from "./tools";
import { StudyBanner, StudyDisclosure } from "./study";
import { ACCOUNT, SNAPSHOT_NOTE } from "../portfolio";
import { ASSETS, PAGES, SYMBOLS } from "../data";

/**
 * The signed-in shell, after the reference's: a left rail of sections at
 * desktop (a top bar and a bottom tab bar at phone width), a search field,
 * and the account. Where the reference has a Buy & sell button the top bar
 * says, in plain text, that the account is a demo: there is no control that
 * looks like it moves money (CLAUDE.md, Safe Browsing remediation).
 * GIFbase is a fictional exchange; the prices are real and the account is not.
 */
export const NAV: [string, string][] = [["index.html", "Home"], ["assets.html", "My assets"], ["trade.html", "Trade"], ["earn.html", "Earn"], ["transactions.html", "Transactions"], ["learn.html", "Learn"]];

export function Page({ current, title, standfirst, back, children }: { current: string; title: string; standfirst?: string; back?: { href: string; label: string }; children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <StudyBanner />
      <Tools />
      <div className="app">
        <nav className="rail" aria-label="Sections">
          <a className="wordmark" href="./index.html"><span className="wordmark__dot" aria-hidden="true" />GIFbase</a>
          <ul>
            {NAV.map(([href, label]) => (
              <li key={href}>
                <a href={`./${href}`} aria-current={href === current ? "page" : undefined}><span className="rail__glyph" aria-hidden="true">{label[0]}</span>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="frame">
          <header className="topbar">
            <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="q" className="visually-hidden">Search assets</label>
              <input id="q" type="search" placeholder="Search for an asset" list="assets" autoComplete="off" />
              <datalist id="assets">{SYMBOLS.map((s) => <option key={s} value={ASSETS[s].name} />)}</datalist>
            </form>
            <p className="topbar__demo">Demo account</p>
            <p className="account" aria-label={`Demo account holder, ${ACCOUNT.name}`}><span className="account__avatar" aria-hidden="true">{ACCOUNT.initial}</span><span className="account__name">{ACCOUNT.name}</span></p>
          </header>
          <main id="content">
            <header className="masthead">
              {back && <p className="masthead__back"><a href={back.href}><span aria-hidden="true">←</span> {back.label}</a></p>}
              <h1 className="masthead__title">{title}</h1>
              {standfirst && <p className="masthead__standfirst">{standfirst}</p>}
              <p className="masthead__asof">{SNAPSHOT_NOTE}</p>
            </header>
            {children}
          </main>
        </div>
      </div>
      <StudyDisclosure>
        <p><strong>Why nothing here links to Coinbase.</strong> The app this study follows, and the documentation of the public market data it is priced from, are named but not linked. A page styled after an exchange that links to that exchange's own site can be flagged as phishing by automated scanners, as the address this series is published at was in October 2026, so the study does not link out to it. The addresses are listed in the study's repository.</p>
      </StudyDisclosure>
      <nav className="tabbar" aria-label="Sections, phone">
        {NAV.slice(0, 5).map(([href, label]) => <a key={href} href={`./${href}`} aria-current={href === current ? "page" : undefined}>{label}</a>)}
      </nav>
    </>
  );
}

export function assetHref(symbol: string) { return PAGES[symbol] ? `./${PAGES[symbol]}.html` : `./trade.html#${symbol}`; }
