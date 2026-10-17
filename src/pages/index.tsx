import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Page } from "../lib/Page";
import { useFontsReady } from "../lib/fonts";
import "../styles.css";
import { BalanceBand, WatchlistBand, MoversBand, LearnBand } from "../bands/bands";
import { QuoteCard, Notes, TransactionsList } from "../lib/modules";

function App() {
  useFontsReady(["700 1em Inter", "500 1em Inter"]);
  return (
    <Page current="index.html" title="Home" standfirst="Your balance and the markets: the account home of a fictional exchange, priced from live public data.">
      <BalanceBand />
      <QuoteCard />
      <WatchlistBand symbols={["BTC", "ETH", "SOL", "XRP", "LINK", "DOGE"]} />
      <Notes />
      <MoversBand />
      <TransactionsList limit={5} />
      <LearnBand keys={[["BTC", "What is Bitcoin?"], ["staking", "How staking pays"], ["stablecoin", "What a stablecoin is"], ["wallet", "Keys and wallets"]]} />
    </Page>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
