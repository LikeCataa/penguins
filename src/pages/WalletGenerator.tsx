import styled from "@emotion/styled";
import { useState } from "react";
import { WalletContractV4 } from "@ton/ton";
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";
import { Container, LinearProgress, Box } from "@mui/material";
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import { utils, writeFile } from "xlsx";
import { saveAs } from 'file-saver';
import Clipboard from 'clipboard';

import download from "../assets/download.png"
import copyIcon from "../assets/copy.png"
import check from "../assets/check.png"

export default function WalletGenerator() {
    const [walletNum, setWalletNum] = useState<number | null>(null);
    const [result, setResult] = useState<Array<any>>([]);
    const [copyResult, setCopyResult] = useState<Array<any>>([]);
    const [resultStr, setResultStr] = useState<string>("Generate Result 0/0");
    const [progress, setProgress] = useState<number>(100);

    const generateWallet = async () => {
        if (walletNum == null || walletNum == 0) return;

        let tempWalletNum = walletNum;
        let tempResult = [];
        let tempCopyResult = [];

        do {
            const mnemonics = await mnemonicNew(24, "");
            const keyPair = await mnemonicToPrivateKey(mnemonics);

            let mnemonicsStr = "";
            mnemonics.map((v, i, a) => { mnemonicsStr = mnemonicsStr + " " + v })
            mnemonicsStr = mnemonicsStr.substring(1);

            const wallet = WalletContractV4.create({
                workchain: 0,
                publicKey: keyPair.publicKey,
            });

            tempResult.push({
                address: wallet.address.toString(),
                mnemonics: mnemonicsStr
            });

            tempCopyResult.push(
                "Address\n" + wallet.address.toString() + "\nMnemonics\n" + mnemonicsStr
            );

            setResult(tempResult);
            setCopyResult(tempCopyResult);
            setResultStr("Generate Result " + tempResult.length + "/" + walletNum);
            setProgress(tempResult.length / walletNum * 100);

            tempWalletNum--;
        } while (tempWalletNum > 0);
    }

    const exportXlsx = async () => {
        if (result.length == 0) return;
        const fileName = "generate_" + result.length + "_wallet.xlsx"
        const workbook = utils.book_new();
        const worksheet = utils.json_to_sheet(result);
        worksheet["!cols"] = [{ wpx: 310, }, { wpx: 950, }]
        utils.book_append_sheet(workbook, worksheet, "Sheet1");
        writeFile(workbook, fileName);
    };

    const exportJSON = async () => {
        if (result.length == 0) return;
        const fileName = "generate_" + result.length + "_wallet.json"
        let content = JSON.stringify(result);
        let blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        saveAs(blob, fileName);
    };

    const copy = new Clipboard('.copy-btn');
    const copyClick = async (index: number) => {
        document.getElementById("copy-btn-" + index)?.setAttribute("class", "copy-btn hidden");
        document.getElementById("copy-success-" + index)?.setAttribute("class", "copy-success");

        setTimeout(() => {
            document.getElementById("copy-btn-" + index)?.setAttribute("class", "copy-btn");
            document.getElementById("copy-success-" + index)?.setAttribute("class", "copy-success hidden");
        }, 500)
    }

    return (
        <StyledContainer maxWidth="md">
            <IntroductBox>
                <div className="title">Batch Generate Ton Wallet</div>
            </IntroductBox>

            <ActionBox>
                <StyledNumberInput
                    className="numInput"
                    max={100000}
                    value={walletNum}
                    placeholder="Input Wallet Number"
                    onChange={(event, walletNum) => setWalletNum(walletNum)}
                />
                <StyledBtn onClick={generateWallet}>
                    Generate
                    <div className="BtnBg"></div>
                </StyledBtn>
            </ActionBox>

            <ResultBox>
                <div className="header">
                    {resultStr}

                    <div className="exportBox">
                        <StyledBtn onClick={exportJSON}>
                            <img src={download} alt="" />
                            Download JSON
                            <div className="BtnBg"></div>
                        </StyledBtn>
                        <StyledBtn className="exportXlsx" onClick={exportXlsx}>
                            <img src={download} alt="" />
                            Download Excel
                            <div className="BtnBg"></div>
                        </StyledBtn>
                    </div>
                </div>
                <Box sx={{ width: '100%' }}>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
                <div className="resultList">
                    <ul>
                        {
                            result.length > 0 ?
                                (result.map((item, index) => (
                                    <li key={index}>
                                        <div className="address">
                                            <div className="title">
                                                Address
                                                <img
                                                    onClick={() => copyClick(index)}
                                                    src={copyIcon}
                                                    data-clipboard-text={copyResult[index]}
                                                    id={"copy-btn-" + index}
                                                    className="copy-btn"
                                                />
                                                <img
                                                    src={check}
                                                    id={"copy-success-" + index}
                                                    className={["copy-success", "hidden"].join(' ')}
                                                />
                                            </div>
                                            <div className="content">
                                                {item.address}
                                            </div>
                                        </div>
                                        <div className="mnemonics">
                                            <div className="title">Mnemonics</div>
                                            <div className="content">
                                                {item.mnemonics}
                                            </div>
                                        </div>
                                    </li>
                                ))) :
                                <li className="noResult">No Result</li>
                        }
                    </ul>
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
    display: flex;
    border: 2px rgb(20, 20, 20) solid;
    padding: 16px 18px;
    margin-bottom: 8px;
`;

const ResultBox = styled.div`
    border: 2px rgb(20, 20, 20) solid;
    padding: 16px 18px;

    .header {
        height: 58px;
        padding-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .exportBox {
            display: flex;

            .exportXlsx {
                margin-left: 8px;
            }
        }
    }

    .MuiBox-root {
        margin-bottom: 6px;

        .MuiLinearProgress-root {
            height: 3px;
            background-color: rgb(0, 0, 0, 0.2);
            .MuiLinearProgress-bar {
                background-color: rgb(0, 0, 0);
            }
        }
    }

    .resultList {
        ul {
            padding: 0;

            .noResult {
                text-align: center;
            }

            li {
                padding: 12px;
                list-style-type: none;
                background-color: #FFF6FB;
                margin-bottom: 6px;

                .address {
                    margin-bottom: 5px;
                    word-break: break-all;
                }
                .title {
                    font-weight: 700;
                    
                    img {
                        float: right;
                        height: 24px;
                        cursor: pointer;
                        &.hidden {
                            display: none;
                        }
                    }
                }
            }
        }
    }
`;

const StyledNumberInput = styled(NumberInput)`
    button {
        display: none;
    }
    input {
        height: 42px;
        width: 168px;
        font-size: 16px;
        line-height: 42px;
        margin-right: 4px;
        border: 2px rgb(20, 20, 20) solid;
        padding: 0 0 0 2px;
        font-family: Mulish;
    }
`;

const StyledBtn = styled.div`
    height: 42px;
    width: 168px;
    font-size: 16px;
    line-height: 42px;
    color: rgb(20, 20, 20);
    border: 2px solid rgb(20, 20, 20);
    background-color: #fff;
    cursor: pointer;
    position: relative;
    transition: all linear 0.1s;
    top: 0px;
    left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 18px;
    }

    &:hover {
      top: 4px;
      left: 5px;

      .BtnBg {
        top: 0px;
        left: 0px;
      }
    }

    .BtnBg {
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