import styled from "@emotion/styled";
import { useState, useEffect, useRef } from "react";
import { WalletContractV4 } from "@ton/ton";
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";
import { Container, LinearProgress, Box, Input } from "@mui/material";
import Clipboard from 'clipboard';

import copyIcon from "../assets/copy.png"
import check from "../assets/check.png"

export default function LuckWalletGenerator() {
    const [matchStr, setMatchStr] = useState<string>("");
    const [strError, setStrError] = useState<boolean>(false);
    const [resultStr, setResultStr] = useState<string>("Matching 0/0");
    const [difficulty, setDifficulty] = useState<number>(0);
    const [matching, setMatching] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(100);
    const [matchWallet, setMatchWallet] = useState<Array<any>>([]);
    const [copyResult, setCopyResult] = useState<Array<any>>([]);

    const pause = useRef(false);

    const findWallet = async () => {
        if (matchStr == "" || strError || matching) return;

        setMatching(true);
        pause.current = false;
        //reset
        setProgress(100);
        setResultStr("Matching 0/0");
        setMatchWallet([]);
        setCopyResult([]);

        let mnemonics;
        let wallet;
        let walletNum = 0;
        let tempMatchWallet = [];
        let tempCopyResult = [];

        do {console.log(111);
        
            mnemonics = await mnemonicNew(24, "");
            const keyPair = await mnemonicToPrivateKey(mnemonics);

            wallet = WalletContractV4.create({
                workchain: 0,
                publicKey: keyPair.publicKey,
            });

            walletNum++;
            setProgress(walletNum / difficulty * 100);
            setResultStr("Matching " + walletNum + "/" + difficulty);
        } while (wallet.address.toString().slice(48 - matchStr.length) != matchStr && !pause.current);

        if (!pause.current) {
            let mnemonicsStr = "";
            mnemonics.map((v, i, a) => { mnemonicsStr = mnemonicsStr + " " + v })
            mnemonicsStr = mnemonicsStr.substring(1);

            tempMatchWallet.push({
                address: wallet.address.toString(),
                mnemonics: mnemonicsStr
            });
            tempCopyResult.push(
                "Address\n" + wallet.address.toString() + "\nMnemonics\n" + mnemonicsStr
            );

            setMatchWallet(tempMatchWallet);
            setCopyResult(tempCopyResult);
        }

        setMatching(false);
        pause.current = false;
    };

    const pauseMatching = async () => {
        pause.current = true;
    };

    const handleStrInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setMatchStr(event.target.value);

        if (event.target.value.length > 46 || event.target.value == "") {
            setStrError(true);
            return;
        }

        setDifficulty(Math.pow(64, event.target.value.length) * 2)

        var regu = "^[0-9a-zA-Z\_]+$";
        var re = new RegExp(regu);
        setStrError(!re.test(event.target.value));
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

    useEffect(() => {
        console.log("eee");
        
        if(matchStr == "") pause.current = true;
    }, [matchStr]);

    return (
        <StyledContainer maxWidth="md">
            <IntroductBox>
                <div className="title">Luck Wallet Generator</div>
            </IntroductBox>

            <ActionBox>
                <div className="rules">
                    46 Characters. Allowed characters: 0-9, A-Z, a-z, -_
                </div>
                <div className="actions">
                    <StyledInput
                        disabled={matching}
                        className="strInput"
                        value={matchStr}
                        placeholder="Input Wallet Suffix"
                        onChange={handleStrInputChange}
                    />
                    <StyledBtn onClick={findWallet} className={strError || matching ? 'disable' : ''}>
                        Find
                        <div className="BtnBg"></div>
                    </StyledBtn>
                </div>
            </ActionBox>

            <ResultBox>
                <div className="header">
                    Difficulty {difficulty} &nbsp; {resultStr}
                    <StyledBtn onClick={pauseMatching} className={matching ? 'show' : 'hidden'}>
                        Pause
                        <div className="BtnBg"></div>
                    </StyledBtn>
                </div>
                <Box sx={{ width: '100%' }}>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
                <div className="resultList">
                    <ul>
                        {
                            matchWallet.length > 0 ?
                                (matchWallet.map((item, index) => (
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
                                <li className="noResult">No Match</li>
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
    border: 2px rgb(20, 20, 20) solid;
    padding: 16px 18px;
    margin-bottom: 8px;

    .rules {
        margin-bottom: 6px;
        color: #2dd813;
    }
    .actions {
        display: flex;
    }
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

        .show {
            display: flex;
        }
        .hidden {
            display: none;
        }
    }

    .MuiBox-root {
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

const StyledInput = styled(Input)`
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
        height: 38.8px;
        width: 162.8px;
        font-size: 16px;
        line-height: 42px;
        margin-right: 4px;
        border: 2px rgb(20, 20, 20) solid;
        padding: 0 0 0 2px;
        font-family: Mulish;

        ::-webkit-input-placeholder { /* WebKit browsers */
            color: rgb(0, 0, 0)
        }
        :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
            color: rgb(0, 0, 0)
        }
        ::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: rgb(0, 0, 0)
        }
        :-ms-input-placeholder { /* Internet Explorer 10+ */
            color: rgb(0, 0, 0)
        }
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

    &.disable {
        cursor: not-allowed;
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