import { useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Header } from "layouts/Header";
import { Container } from "@mui/material";
import styled from "@emotion/styled";
import { ROUTES } from "consts";
import ExamplePage from "./pages/ExamplePage";
import HomePage from "./pages/HomePage";
import LuckWalletGenerator from "./pages/LuckWalletGenerator";
import WalletGenerator from "./pages/WalletGenerator";
import ILCalculator from "./pages/ILCalculator";
import MassSender from "./pages/MassSender";
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const StyledContainer = styled(Container)({
  paddingBottom: "120px"
});

function App() {
  return (
    <TonConnectUIProvider
      manifestUrl="https://likecataa.github.io/penguins/tonconnect-manifest.json"
      walletsListConfiguration={{
        includeWallets: [
          {
            appName: "bitgetTonWallet",
            name: "Bitget Wallet",
            imageUrl: "https://raw.githubusercontent.com/bitkeepwallet/download/main/logo/png/bitget%20wallet_logo_iOS.png",
            aboutUrl: "https://web3.bitget.com",
            deepLink: "bitkeep://",
            jsBridgeKey: "bitgetTonWallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["ios", "android", "chrome"],
            universalLink: "https://bkcode.vip/ton-connect"
          },
          {
            appName: "tonwallet",
            name: "TON Wallet",
            imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
            aboutUrl: "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
            universalLink: "https://wallet.ton.org/ton-connect",
            jsBridgeKey: "tonwallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["chrome", "android"]
          },
          {
            appName: "nicegramWallet",
            name: "Nicegram Wallet",
            imageUrl: "https://static.nicegram.app/icon.png",
            aboutUrl: "https://nicegram.app",
            universalLink: "https://nicegram.app/tc",
            deepLink: "nicegram-tc://",
            jsBridgeKey: "nicegramWallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["ios", "android"]
          }
        ]
      }}
    >
      <StyledContainer maxWidth="lg">
        <Header />

        <Routes>
          <Route path={ROUTES.ExamplePage} element={<ExamplePage />} />
          <Route path={ROUTES.HomePage} element={<HomePage />} />
          <Route path={ROUTES.LuckWalletGenerator} element={<LuckWalletGenerator />} />
          <Route path={ROUTES.WalletGenerator} element={<WalletGenerator />} />
          <Route path={ROUTES.ILCalculator} element={<ILCalculator />} />
          <Route path={ROUTES.MassSender} element={<MassSender />} />
        </Routes>
      </StyledContainer>
    </TonConnectUIProvider>
  );
}

export default App;
