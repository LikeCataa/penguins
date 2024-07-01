import React from "react";
import styled from "@emotion/styled";
import { MessageBox } from "components";
import { Grid } from "@mui/material";
import { ROUTES } from "consts";

import coin from '../assets/coin.png';
import toolbox from '../assets/toolbox.png';
import resource from '../assets/resource.png';

export default function Homepage() {
    return (
        <>
            <SectorTitle>
                <img src={coin} alt="" />
                <div> Play&Earn </div>
            </SectorTitle>
            <StyledGrid container spacing={4}>
                <Grid item md={4} sm={6} xs={12}>
                    <MessageBox
                        title="Coin Flip"
                        description="Double your Ton & Not"
                        to="/"
                        bkType="rainbow"
                    />
                </Grid>
            </StyledGrid>

            <SectorTitle>
                <img src={toolbox} alt="" />
                <div> ToolBox </div>
            </SectorTitle>
            <StyledGrid container spacing={4}>
                <Grid item md={4} sm={6} xs={12}>
                    <MessageBox
                        title="Mass Sender"
                        description="Support comment and different value"
                        to="/mass-sender"
                        bkType="rainbow"
                    />
                </Grid>
                {/* <Grid item md={4} sm={6} xs={12}>
                    <MessageBox
                        title="Ton NFT Mass Sale"
                        description="Ton NFT Mass Sale"
                        to="/"
                        bkType="rainbow"
                    />
                </Grid> */}
                <Grid item md={4} sm={6} xs={12}>
                    <MessageBox
                        title="TG Bot"
                        description="Tranding bot"
                        to="/"
                        bkType="rainbow"
                    />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                    <MessageBox
                        title="Impermanent Loss Calculator"
                        description="Uses Ston.fi and Dedust`s formula to determine impermanent loss."
                        to={ROUTES.ILCalculator}
                        bkType="golden"
                    />
                </Grid>
                {/* <Grid item md={4} sm={6} xs={12}>
                    <MessageBox
                        title="Luck Wallet Generator"
                        description="Generate a wallet based on the letter suffix you gave"
                        to={ROUTES.LuckWalletGenerator}
                        bkType="golden"
                    />
                </Grid> */}
                <Grid item md={4} sm={6} xs={12}>
                    <MessageBox
                        title="Wallet Generator"
                        description="Offline & Trustworthy, batch generation Of wallets"
                        to={ROUTES.WalletGenerator}
                        bkType="common"
                    />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                    <MessageBox
                        title="Address Formatter"
                        description="Format v1, v2, v3R1, v3R2, v4R1, v4R2, v5R1 address"
                        to="/"
                        bkType="common"
                    />
                </Grid>
            </StyledGrid>

            <SectorTitle>
                <img src={resource} alt="" />
                <div> Resource </div>
            </SectorTitle>
            <StyledGrid container spacing={4}>
                <Grid item md={4} sm={6} xs={12}>
                    <MessageBox
                        title="Ton Daily"
                        description="Comprehensive, high-quality ton community news"
                        to="/"
                        bkType="rainbow"
                    />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                    <MessageBox
                        title="App"
                        description="Defi, Game, Mini-App, Wallet, Blockchain Explorer, Chart Tools, DEV Docs..."
                        to="/"
                        bkType="golden"
                    />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                    <MessageBox
                        title="Hall of Fame"
                        description="CEO, CFO, VC, KOL..."
                        to="/"
                        bkType="golden"
                    />
                </Grid>
            </StyledGrid>
        </>
    );
};

const SectorTitle = styled.div`
    display: flex;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    color: rgb(20, 20, 20);

    img {
        height: 24px;
        margin-right: 6px;
    }
`;

const StyledGrid = styled(Grid)({
    marginBottom: "36px",
});