import { ASSETS, SYMBOLS, usd, pct, qty, units, changePct24 } from "../data";
import { positions, totals, TRANSACTIONS, CASH, STAKING } from "../portfolio";
import { Sparkline } from "./charts";
import { assetHref } from "./Page";
import { rangeChange } from "../data";

/**
 * The flat modules the signed-in reference places between its grids: the
 * quote card where the reference has its Buy / Sell / Convert panel, three
 * notes where it has promotions, the transactions list, the assets table.
 * Lists stay lists. The exchange is fictional and nothing here executes.
 */

/** The exchange's fee on a buy or sell: a share of the amount, with a floor of 99 cents. Fictional, like the exchange. */
const FEE = { rate: 1.49, floor: "99 cents" };

/**
 * The quote card, in the place the reference gives its order panel. It reads
 * and does not trade: no amount, no asset picker, no order type, no button.
 * Those were removed against Google Safe Browsing (CLAUDE.md, Safe Browsing
 * remediation) and must not come back.
 */
export function QuoteCard({ symbol = "BTC" }: { symbol?: string }) {
  const a = ASSETS[symbol];
  const ch = changePct24(a);
  return (
    <section className="panel quote" id="quote" aria-labelledby="quote-title">
      <div className="quote__head">
        <p className="quote__kicker">Quote</p>
        <h2 id="quote-title" className="quote__title">{a.name} <span className="muted">{a.symbol}</span></h2>
      </div>
      <div className="quote__body">
        <div className="quote__lead">
          <p className="quote__price">{usd(a.price)}</p>
          <p className={`quote__change ${ch >= 0 ? "is-up" : "is-down"}`}>{pct(ch)} <span className="muted">in twenty-four hours</span></p>
          <p className="quote__fee"><strong>What a fee is.</strong> The exchange's charge for carrying out a buy or a sell, taken from the amount: here {FEE.rate}% of it, and never less than {FEE.floor}. The price itself also carries a small spread between what buyers pay and what sellers receive.</p>
        </div>
        <dl className="quote__sum">
          <div><dt>{a.symbol} price</dt><dd>{usd(a.price)}</dd></div>
          <div><dt>24h change</dt><dd className={ch >= 0 ? "is-up" : "is-down"}>{usd(a.price - a.open24, { sign: true })}</dd></div>
          <div><dt>24h range</dt><dd>{usd(a.low24)} to {usd(a.high24)}</dd></div>
          <div><dt>Fee</dt><dd>{FEE.rate}%, at least {FEE.floor}</dd></div>
          <div><dt>USDC balance</dt><dd>{usd(CASH)}</dd></div>
        </dl>
      </div>
      <p className="note">A quote to read, not an order. GIFbase is fictional: it has no order form, and nothing here buys, sells or converts.</p>
    </section>
  );
}

/** Three notes in the band the reference gives its promotions. Each describes; none offers or asks. */
export function Notes() {
  return (
    <section className="promos" aria-label="Notes">
      <article className="promo">
        <p className="promo__kicker">Markets</p>
        <h2 className="promo__title">Trading never closes</h2>
        <p className="promo__pitch">Crypto assets trade every hour of every day, weekends and holidays included, so there is no opening or closing price. A day's change is measured from the price at the same time yesterday, and the figures here are a snapshot taken at the time printed above.</p>
      </article>
      <article className="promo">
        <p className="promo__kicker">Recurring buys</p>
        <h2 className="promo__title">A little every week</h2>
        <p className="promo__pitch">A recurring buy repeats a purchase of a set amount on a set day, whatever the price, so each week's amount buys more when the price is low and less when it is high. The three recent Bitcoin buys in Transactions are such an order, $1,000 a week.</p>
      </article>
      <article className="promo">
        <p className="promo__kicker">Earn</p>
        <h2 className="promo__title">Staking what is held</h2>
        <p className="promo__pitch">Ethereum and Solana in this account are staked and earning; Cardano, Polkadot and Avalanche can be. The rates and the waiting period to unstake each one are on the <a href="./earn.html">Earn page</a>.</p>
      </article>
    </section>
  );
}

export function TransactionsList({ limit, title = "Recent transactions" }: { limit?: number; title?: string }) {
  const rows = limit ? TRANSACTIONS.slice(0, limit) : TRANSACTIONS;
  return (
    <section className="list-band" id="transactions" aria-labelledby="tx-title">
      <div className="band__row"><h2 id="tx-title" className="band__title">{title}</h2>{limit && <a className="band__aside" href="./transactions.html">All transactions</a>}</div>
      <ul className="list">
        {rows.map((t, i) => (
          <li key={i} className="tx">
            <span className={`tx__kind tx__kind--${t.kind.toLowerCase()}`} aria-hidden="true">{t.kind[0]}</span>
            <span className="tx__main"><strong>{t.kind} {ASSETS[t.symbol]?.name ?? t.symbol}</strong><span className="tx__sub">{new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}{t.note ? ` · ${t.note}` : ""}</span></span>
            <span className="tx__amt"><strong>{t.kind === "Sell" || t.kind === "Send" ? "−" : "+"}{qty(t.qty, t.symbol)}</strong><span className="tx__sub">{usd(t.usd)}</span></span>
          </li>
        ))}
      </ul>
      <p className="note">Transactions are invented for the study and are not a record of anyone's account.</p>
    </section>
  );
}

export function AssetsTable() {
  const pos = positions();
  const t = totals();
  return (
    <section className="list-band" aria-labelledby="holdings-title">
      <h2 id="holdings-title" className="band__title">Your assets</h2>
      <table className="table">
        <thead><tr><th scope="col">Asset</th><th scope="col">Balance</th><th scope="col">Price</th><th scope="col">24h</th><th scope="col">Allocation</th><th scope="col">All time</th></tr></thead>
        <tbody>
          {pos.map((p) => (
            <tr key={p.symbol}>
              <th scope="row"><a href={assetHref(p.symbol)}>{p.name}</a> <span className="muted">{p.symbol}{p.staked ? " · staked" : ""}</span></th>
              <td><strong>{usd(p.value)}</strong><br /><span className="muted">{qty(p.qty, p.symbol)}</span></td>
              <td>{usd(p.price)}</td>
              <td className={changePct24(ASSETS[p.symbol]) >= 0 ? "is-up" : "is-down"}>{pct(changePct24(ASSETS[p.symbol]))}</td>
              <td>{p.share.toFixed(1)}%</td>
              <td className={p.gain >= 0 ? "is-up" : "is-down"}>{usd(p.gain, { sign: true })}<br /><span className="muted">{pct(p.gainPct, 1)}</span></td>
            </tr>
          ))}
          <tr><th scope="row">USDC <span className="muted">cash</span></th><td><strong>{usd(CASH)}</strong></td><td>$1.00</td><td>—</td><td>{t.cashShare.toFixed(1)}%</td><td>—</td></tr>
        </tbody>
      </table>
    </section>
  );
}

export function PricesTable() {
  const rows = SYMBOLS.map((s) => ASSETS[s]).sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0));
  return (
    <section className="list-band" aria-labelledby="prices-title">
      <h2 id="prices-title" className="band__title">All assets</h2>
      <table className="table">
        <thead><tr><th scope="col">#</th><th scope="col">Asset</th><th scope="col">Price</th><th scope="col">24h</th><th scope="col">Market cap</th><th scope="col">Volume (24h)</th><th scope="col">Week</th></tr></thead>
        <tbody>
          {rows.map((a, i) => {
            const spark = a.series["1W"] ?? [];
            return (
              <tr key={a.symbol} id={a.symbol}>
                <td className="muted">{i + 1}</td>
                <th scope="row"><a href={assetHref(a.symbol)}>{a.name}</a> <span className="muted">{a.symbol}</span></th>
                <td>{usd(a.price)}</td>
                <td className={changePct24(a) >= 0 ? "is-up" : "is-down"}>{pct(changePct24(a))}</td>
                <td>{a.marketCap ? usd(a.marketCap, { compact: true }) : "—"}</td>
                <td>{units(a.volume24)} {a.symbol}</td>
                <td className="table__spark"><Sparkline pts={spark} up={rangeChange(spark).abs >= 0} label={`${a.name}, past week`} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export function StakingNotes() {
  return (
    <section className="list-band" aria-labelledby="staking-title">
      <h2 id="staking-title" className="band__title">How staking works here</h2>
      <ul className="list list--plain">
        <li><strong>What it is.</strong> Proof-of-stake networks pay holders who lock their coins to help validate transactions. The exchange runs the validators; you keep ownership of the coins.</li>
        <li><strong>Rates.</strong> The figures above are what the networks have paid recently, net of a 25% commission on rewards. They move with network conditions and are not guaranteed.</li>
        <li><strong>Unstaking.</strong> Each network sets its own waiting period, from none to several weeks; coins cannot be sold while they wait.</li>
        <li><strong>Risk.</strong> Staked coins carry the price risk of the asset, and a validator penalty ("slashing") can reduce a position. The exchange covers slashing caused by its own validators.</li>
        <li><strong>Tax.</strong> Rewards are generally income when received; the Transactions page lists each one with its value that day.</li>
      </ul>
      <p className="note">Describes a fictional exchange for a layout study. Nothing here is advice. {STAKING.length} assets are listed on the Earn page.</p>
    </section>
  );
}
