import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Page } from "../lib/Page";
import { useFontsReady } from "../lib/fonts";
import "../styles.css";
import { MoversBand } from "../bands/bands";
import { PricesTable, QuoteCard } from "../lib/modules";

function App() {
  useFontsReady(["700 1em Inter", "500 1em Inter"]);
  return (
    <Page current="trade.html" title="Trade" standfirst="Twelve assets by market capitalisation, with the past day\u2019s change and the past week\u2019s line, and a quote for Bitcoin that reads the price and the fee.">
      <QuoteCard />
      <PricesTable />
      <MoversBand />
    </Page>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
