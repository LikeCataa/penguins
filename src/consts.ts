import ChinaLogo from "assets/china.png";
import UsLogo from "assets/usa.png";

const ROUTES = {
  ExamplePage: "/example-page",
  HomePage: "/",
  WalletGenerator: "/wallet-generator",
  LuckWalletGenerator: "/luck-wallet-generator",
  ILCalculator: "/impermanent-loss-calculator",
  MassSender: "/mass-sender",
};

const supportedLanguages = [
  {
    lang: "en",
    image: UsLogo,
  },
  {
    lang: "cn",
    image: ChinaLogo,
  },
];

// const TON_WALLET_EXTENSION_URL  = 'https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd'

export { ROUTES, supportedLanguages };
