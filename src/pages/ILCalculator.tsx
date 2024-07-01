import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { Container, Grid, Input } from "@mui/material";

import calculate from "../assets/calculate.png"

export default function ILCalculator() {
    const [APR, setAPR] = useState<number | any>(89);
    const [timeInPool, setTimeInPool] = useState<number | any>(14);
    const [tokenAPrice0, setTokenAPrice0] = useState<number | any>(7.5);
    const [tokenBPrice0, setTokenBPrice0] = useState<number | any>(0.0017);
    const [tokenAPrice1, setTokenAPrice1] = useState<number | any>(8);
    const [tokenBPrice1, setTokenBPrice1] = useState<number | any>(0.0026);
    const [tokenAAmount0, setTokenAAmount0] = useState<number | any>(null);
    const [tokenBAmount0, setTokenBAmount0] = useState<number | any>(null);
    const [tokenAAmount1, setTokenAAmount1] = useState<number | any>(null);
    const [tokenBAmount1, setTokenBAmount1] = useState<number | any>(null);
    const [K, setK] = useState<number | any>(null);
    const [holdValue, setHoldValue] = useState<number | any>(null);
    const [lpValue, setLpValue] = useState<number | any>(null);
    const [iLossUSD, setILossUSD] = useState<number | any>(null);
    const [iLossPercentage, setILossPercentage] = useState<number | any>(null);
    const [rewardUSD, setRewardUSD] = useState<number | any>(null);
    const [rewardPercentage, setRewardPercentage] = useState<number | any>(null);
    const [totalProfit, setTotalProfit] = useState<number | any>(null);

    useEffect(() => {
        let tokenAAmount0Temp, tokenBAmount0Temp, KTemp, tokenAAmount1Temp,
            tokenBAmount1Temp, holdValueTemp, lpValueTemp, iLossUSDTemp,
            iLossPercentageTemp, rewardUSDTemp, rewardPercentageTemp, totalProfitTemp;

        let tokenAInitValue = 500;
        let tokenBInitValue = 500;
        let totalInitValue = tokenAInitValue + tokenBInitValue;

        tokenAAmount0Temp = tokenAInitValue / tokenAPrice0;
        tokenBAmount0Temp = tokenBInitValue / tokenBPrice0;

        KTemp = tokenAAmount0Temp * tokenBAmount0Temp;

        tokenAAmount1Temp = Math.sqrt(KTemp / (tokenAPrice1 / tokenBPrice1));
        tokenBAmount1Temp = Math.sqrt(KTemp / (tokenBPrice1 / tokenAPrice1));

        holdValueTemp = tokenAAmount0Temp * tokenAPrice1 + tokenBAmount0Temp * tokenBPrice1;
        lpValueTemp = tokenAAmount1Temp * tokenAPrice1 + tokenBAmount1Temp * tokenBPrice1;
        iLossUSDTemp = holdValueTemp - lpValueTemp;
        iLossPercentageTemp = ((holdValueTemp - lpValueTemp) / holdValueTemp) * 100;

        let DPR = (APR / 365 / 100) * timeInPool;

        rewardUSDTemp = lpValueTemp * DPR;
        rewardPercentageTemp = rewardUSDTemp / holdValueTemp * 100;
        totalProfitTemp = lpValueTemp + rewardUSDTemp - totalInitValue;

        setTokenAAmount0(tokenAAmount0Temp.toFixed(2));
        setTokenBAmount0(tokenBAmount0Temp.toFixed(2));
        setK(KTemp.toFixed(2));
        setTokenAAmount1(tokenAAmount1Temp.toFixed(2));
        setTokenBAmount1(tokenBAmount1Temp.toFixed(2));
        setHoldValue(holdValueTemp.toFixed(2));
        setLpValue(lpValueTemp.toFixed(2));
        setILossUSD(iLossUSDTemp.toFixed(2));
        setILossPercentage(iLossPercentageTemp.toFixed(2));
        setRewardUSD(rewardUSDTemp.toFixed(2));
        setRewardPercentage(rewardPercentageTemp.toFixed(2));
        setTotalProfit(totalProfitTemp.toFixed(2));

        // console.log("- calculate");
        // console.log(KTemp, tokenAAmount0Temp, tokenBAmount0Temp, tokenAAmount1Temp, tokenBAmount1Temp);
        // console.log(holdValueTemp, lpValueTemp, iLossUSDTemp, iLossPercentageTemp);
        // console.log(rewardUSDTemp, rewardPercentageTemp, totalProfitTemp);
    }, [APR, timeInPool, tokenAPrice0, tokenBPrice0, tokenAPrice1, tokenBPrice1]);



    return (
        <StyledContainer maxWidth="md">
            <IntroductBox>
                <div className="title">Impermanent Loss Calculator</div>
            </IntroductBox>

            <ActionBox>
                <StyledGrid container spacing={6}>
                    <Grid item md={4} sm={6} xs={12}>
                        <div style={{ width: '202.8px' }}>Token A Initial Prices</div>
                        <StyledNumberInput
                            className="numInput"
                            value={tokenAPrice0}
                            placeholder="0"
                            type="number"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setTokenAPrice0(event.target.value)
                            }}
                        />

                        <div style={{ width: '202.8px' }}>Token A Future Prices</div>
                        <StyledNumberInput
                            className="numInput"
                            value={tokenAPrice1}
                            placeholder="0"
                            type="number"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setTokenAPrice1(event.target.value)
                            }}
                        />
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                        <div style={{ width: '202.8px' }}>Token B Initial Prices</div>
                        <StyledNumberInput
                            className="numInput"
                            value={tokenBPrice0}
                            placeholder="0"
                            type="number"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setTokenBPrice0(event.target.value)
                            }}
                        />

                        <div style={{ width: '202.8px' }}>Token A Future Prices</div>
                        <StyledNumberInput
                            className="numInput"
                            value={tokenBPrice1}
                            placeholder="0"
                            type="number"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setTokenBPrice1(event.target.value)
                            }}
                        />
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                        <div style={{ width: '202.8px' }}>APR or APY (%)</div>
                        <StyledNumberInput
                            className="numInput"
                            value={APR}
                            placeholder="0"
                            type="number"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setAPR(event.target.value)
                            }}
                        />

                        <div style={{ width: '202.8px' }}>Time in Pool (Days)</div>
                        <StyledNumberInput
                            className="numInput"
                            value={timeInPool}
                            placeholder="0"
                            type="number"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setTimeInPool(event.target.value)
                            }}
                        />
                    </Grid>
                </StyledGrid>
            </ActionBox>

            <ResultBox>
                <div className="header">
                    <img style={{ marginRight: '4px' }} src={calculate} />
                    Assuming initial holdings of <span>&nbsp;$500&nbsp;</span> in token A and <span>&nbsp;$500&nbsp;</span> in token B
                </div>

                <div className="contentBox">
                    <div className="content top">
                        Held <br />
                        - Have <span>{tokenAAmount0}</span> Token A and <span>{tokenBAmount0}</span> Token B<br />
                        - Value if held: <span>${holdValue}</span><br /><br />

                        Provided as liquidity<br />
                        - Have <span>{tokenAAmount1}</span> Token A and <span>{tokenBAmount1}</span> Token B (in liquidity pool)<br />
                        - Value if providing liquidity: <span>${lpValue}</span>
                    </div>
                    <div className="content bottom">
                        <div>
                            Liqiudity Rewards<br />
                            <span>${rewardUSD} ({rewardPercentage}%)</span><br /><br />
                        </div>

                        <div>
                            Impermanent Loss<br />
                            <span>${iLossUSD} ({iLossPercentage}%)</span><br /><br />
                        </div>
                        <div>
                            Total Profit<br />
                            <span className={totalProfit>=0?'earn':'loss'}>${totalProfit}</span>
                        </div>
                    </div>
                </div>
            </ResultBox>
        </StyledContainer>
    );
}

const StyledContainer = styled(Container)({
});

const IntroductBox = styled.div`
    .title {
        text-align: center;
        font-size: 26px;
        font-weight: 700;
        color: rgb(20, 20, 20);
        margin-bottom: 18px;
    }
`;

const ActionBox = styled.div`
    border: 2px rgb(20, 20, 20) solid;
    padding: 16px 18px;
    margin-bottom: 8px;

    .MuiGrid-container {
        margin-bottom: 0;

        .MuiGrid-item {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    }
    
`;

const ResultBox = styled.div`
    border: 2px rgb(20, 20, 20) solid;
    padding: 16px 18px;

    span {
        font-size: 18px;
        font-weight: 700;
    }

    .header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 2px rgb(20, 20, 20) solid;
        padding-bottom: 8px;

        img {
            height: 26px;
        }
    }

    .contentBox {
        justify-content: space-between;

        .content {
            background-color: #FFF6FB;
            margin: 6px 0 0;
            padding: 16px 5%;

            &.bottom {
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;

                div {
                    flex: 1;
                    text-align: center;
                    margin: 0 26px;

                    .earn {
                        color: rgb(34, 197, 94);
                    }
                    .loss {
                        color: rgb(239, 68, 68);
                    }
                }
            }
        }
    }
`

const StyledGrid = styled(Grid)({
    marginBottom: "16px"
});

const StyledNumberInput = styled(Input)`
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type="number"]{
        -moz-appearance: textfield;
    }
    &::before {
        display: none;
    }
    &::after {
        display: none;
    }
    button {
        display: none;
    }
    input {
        height: 42px;
        font-size: 16px;
        line-height: 42px;
        margin: 0 4px 6px 0;
        border: 2px rgb(20, 20, 20) solid;
        padding: 0 0 0 2px;
        font-family: Mulish;
    }
`;