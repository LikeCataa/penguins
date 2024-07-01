import styled from "@emotion/styled";
import { getTonNotPrice } from "../helpers/api";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { TonConnectButton } from '@tonconnect/ui-react';

import ton_penguins_logo from '../assets/ton_penguins_logo.png';
import twitter from '../assets/twitter.png';
import tg from '../assets/tg.png';

function Header() {
  const TVL = "600m";
  const Volume = "30.9m";
  const [tonPriceUSD, setTonPriceUSD] = useState<number>(0);

  useEffect(() => {
    const loopGetTonNotPrice = async () => {
      return new Promise((resolve) => {
        const loop = async () => {
          try {
            let result = await getTonNotPrice();
            setTonPriceUSD(Number(result.data[0].attributes.price_usd.substr(0, 4)));
            setTimeout(loop, 60_000);
            resolve(true);
          } catch (e) {
            console.log(e, "getTonNotPrice error");
            setTimeout(loop, 15_000);
          }
        };

        loop();
      });
    };

    // const [tonConnectUI, setOptions] = useTonConnectUI();
    // setOptions({buttonRootId: 'ton-connect'})

    return () => {
      loopGetTonNotPrice()
    };
  }, []);

  return (
    <HeaderBox>
      <div className="tonData">
        <div className="dataBox">
          <div className="item"><span>TVL:</span> ${TVL}</div>
          <div className="line"></div>
          <div className="item"><span>Volume:</span> ${Volume}</div>
          <div className="line"></div>
          <div className="item"><span>TON:</span> ${tonPriceUSD}</div>
        </div>

        <div className="hLine"></div>
      </div>

      <div className="header">
        <div className="left">
          <Link to="/">
            <img src={ton_penguins_logo} alt="" />
          </Link>

          <ProductBox>
            <Link to="/coinflip">
              Coinflip
            </Link>
            <Link to="/mass-sender">
              Mass Sender
            </Link>
            <Link to="/ton-daily">
              Ton Daily
            </Link>
            <Link to="/collection">
              Collection
            </Link>
          </ProductBox>
        </div>

        <div className="right">
          <SocialBox>
            <a href="#">
              <img src={tg} alt="" />
            </a>
            <a href="#">
              <img src={twitter} alt="" />
            </a>
          </SocialBox>

          <TonConnectButton className="connectBtn" style={{ float: "right" }} />
        </div>
      </div>
    </HeaderBox>
  );
}

export { Header };

const HeaderBox = styled.div`
  .tonData {
    position: relative;
    display: flex;
    justify-content: center;
    margin-top: 6px;

    .dataBox {
      z-index: 10;
      display: flex;
      margin-right: 16px;
      color: rgb(20, 20, 20);
      background-color: #fff;
      font-size: 10px;

      .item {
        margin: 0 12px;

        span {
          font-weight: 700;
        }
      }

      .line {
        border: 1px rgb(20, 20, 20) solid;
      }
    }

    .hLine {
      z-index: 1;
      position: absolute;
      top: 7.5px; 
      height: 1px;
      width: 100vw;
      background: linear-gradient(90deg, #FF0000 0%, #FFA51F 23%, #E8FC00 35%, #70FF6D 43%, #21FEFE 56%, #7F84FF 65%, #AE01FF 77%, #E903E0 93%);
    }
  }

  .header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 4vw;

    .left {
      display: flex;
      align-items: center;

      img {
        height: 48px;
        cursor: pointer;
        margin-right: 36px;
      }

      a {
        margin-right: 18px;
      }
    }

    .right {
      display: flex;
      align-items: center;

      button {
        height: 42px;
        width: 168px;
        font-size: 16px;
        line-height: 42px;
        text-align: center;
        color: #fff;
        /* border: 2px solid rgb(20, 20, 20); */
        background-color: #1a95e0;
        border-radius: 0!important;
        div {
          font-family: 'Mulish'!important;
        }
      }
    }
  }
`;

const ProductBox = styled.div`
  a {
    font-size: 18px;
    text-decoration: none;
    color: rgb(20, 20, 20);
  }
`;

const SocialBox = styled.div`
    display: flex;
    align-items: center;
    margin-right: 16px;

    a {
      display: block;
      line-height: 0;
    }

    img {
      height: 26px;
      margin: 0 5px;
    }
`;

const ConnectBtn = styled.div`
    height: 42px;
    width: 168px;
    font-size: 16px;
    line-height: 42px;
    text-align: center;
    color: rgb(20, 20, 20);
    border: 2px solid rgb(20, 20, 20);
    background-color: #fff;
    cursor: pointer;
    position: relative;
    transition: all linear 0.1s;
    top: 0px;
    left: 0px;

    &:hover {
      top: 4px;
      left: 5px;

      .connectWalletBg {
        top: 0px;
        left: 0px;
      }
    }

    .connectWalletBg {
      position: absolute;
      height: 100%;
      width: 100%;
      background-color: rgb(0, 0, 0);
      z-index: -1;
      top: 4px;
      left: 5px;
      transition: all linear 0.1s;
    }
`;