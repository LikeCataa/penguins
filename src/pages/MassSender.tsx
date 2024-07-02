import styled from "@emotion/styled";
import { useState } from "react";
import { Container } from "@mui/material";
import { utils, writeFile } from "xlsx";
import { saveAs } from 'file-saver';
import { Address, Dictionary, DictionaryValue, beginCell, Cell, contractAddress, StateInit, toNano, storeStateInit } from "@ton/core";
import TonWeb from "tonweb";
import { InboxOutlined } from '@ant-design/icons';
// import type { GetProp, UploadProps } from 'antd';
import { Input, message, Popover, Dropdown } from 'antd';
import CodeMirrorEditor from '../components/CodeMirrorEditor';
import { MassSender as MassSenderContract, MassSenderConfig } from '../contracts/wrappers/MassSender';
import { useTonConnectUI } from '@tonconnect/ui-react';

import download from "../assets/download.png";

// const { Dragger } = Upload;

export default function MassSender() {
    const [inputOrUpload, setInputOrUpload] = useState<boolean>(true);
    const [comment, setComment] = useState<string>("");
    const [addressListStr, setAddressListStr] = useState<string>("");
    const [tonConnectUI, setOptions] = useTonConnectUI();

    const MassSenderBocBase64 = "te6cckECBwEAAVcAART/APSkE/S88sgLAQIBYgIGA+bQM9DTAwFxsJJfA+D6QDDtRNDTP/oA0w/TD9MA+kD0BDAiwACOITI2gggehIAjgQD9oIEA/qkEUkCgqBehUjC88tBlcQf4YY4VODj4KFJgxwVRaMcFFrHy4GT4ABBG4iWAEPR8b6WBAP4ktgiK5GwSs+MPAwQFAFQgjiYwAfoA+kAwAXCAEMjLBVADzxYB+gLLivhBzxbJcfsAJYAQ9Hxvpd4AfFtwIFUTVCYHBsjLP1AF+gITyw/LD8sAAc8W9ADJ7VRwgBjIywVYzxYh+gLLiouEV4Y2Vzc2VzjPFsmDBvsAAIQBgQD+oQGlEDZFE1BCBsjLP1AF+gITyw/LD8sAAc8W9ADJ7VT4KIIIHoSAcIAQyMsFUAPPFgH6AsuK+EHPFslx+wAANaFZZ9qJoaZ/9AGmH6YfpgH0gegIYCCMvg2AASLsoUc="

    // const props: UploadProps = {
    //     name: 'file',
    //     multiple: false,
    //     action: 'https://127.0.0.1/',
    //     onChange(info) {
    //         const { status } = info.file;
    //         if (status !== 'uploading') {
    //             console.log(info.file, info.fileList);
    //         }
    //         if (status === 'done') {
    //             message.success(`${info.file.name} file uploaded successfully.`);
    //         } else if (status === 'error') {
    //             message.error(`${info.file.name} file upload failed.`);
    //         }
    //     },
    //     onDrop(e) {
    //         console.log('Dropped files', e.dataTransfer.files);
    //     },
    // };

    const exportExample = async (type: string) => {
        const exampleData = [
            ["EQDSC7VDsiAa0xrUk96tZxQ2DilLmUlRIBo2sS0yuJk6Hhy1", 0.1],
            ["EQDzltTJ0iYpoXac6D5IrKFADyvS8o1DrIXFfIg3W_9s3U5S", 0.1],
            ["EQA8NbeIrAqi94K2iTAnfGvJaZP6CnE31Sw7zb7eV04-YCtz", 0.1]
        ]

        if (type == "json") {
            let content = JSON.stringify(exampleData);
            let blob = new Blob([content], { type: "text/plain;charset=utf-8" });
            saveAs(blob, "example.json");
        } else if (type == "excel") {
            const workbook = utils.book_new();
            const worksheet = utils.json_to_sheet(exampleData);
            worksheet["!cols"] = [{ wpx: 310, }, { wpx: 10, }]
            utils.book_append_sheet(workbook, worksheet, "Sheet1");
            writeFile(workbook, "example.xlsx");
        }
    };

    const handleCodeChange = (value: string) => {
        setAddressListStr(value);
    };
    const handleCommentChange = (value: string) => {
        setComment(value);
    };

    type Msg = {
        value: bigint;
        destination: Address;
    };

    function createMessageValue(): DictionaryValue<Msg> {
        return {
            serialize: (src, buidler) => {
                buidler.storeCoins(src.value).storeAddress(src.destination);
            },
            parse: (src) => {
                return { value: src.loadCoins(), destination: src.loadAddress() };
            },
        };
    }

    function messagesToDict(messages: Msg[]): Dictionary<number, Msg> {
        let dict = Dictionary.empty(Dictionary.Keys.Uint(16), createMessageValue());
        for (let i = 1; i <= messages.length; i++) {
            dict.set(i, messages[i - 1]);
        }
        return dict;
    }

    const send = async () => {
        let rowStrList;
        let addressAndValueList: any = [];
        let message: any = [];
        let totalValue: number = 0;

        //validate address list
        if (addressListStr != "") {
            rowStrList = addressListStr.split("\n");

            rowStrList.map((v, i, a) => {
                addressAndValueList.push(v.split(","));
            });

            for (let i = 0; i < addressAndValueList.length; i++) {
                if (addressAndValueList[i].length != 2) return;
                let tempAddress = addressAndValueList[i][0].trim();
                let tempValue = addressAndValueList[i][1].trim();

                if (!Address.isFriendly(tempAddress)) return;
                if (isNaN(tempValue)) return;

                addressAndValueList[i][0] = Address.parse(tempAddress);
                addressAndValueList[i][1] = toNano(tempValue);
                totalValue += Number(addressAndValueList[i][1]);

                message.push({
                    value: addressAndValueList[i][1],
                    destination: addressAndValueList[i][0]
                })
            }
        }
        console.log(1);

        // console.log(addressListStr, comment);
        // console.log(rowStrList);
        // console.log(addressAndValueList);

        if (message.length > 0) {
            let code = Cell.fromBase64(MassSenderBocBase64);
            let data = beginCell()
                .storeUint(Date.now(), 64)
                .storeCoins(toNano(totalValue))
                .storeUint(message.length, 16)
                .storeUint(0, 16)
                .storeUint(0, 1)
                .storeAddress(Address.parse('0QA1pWPJoe27enPAb9c-VNb4wYSrxluUvw61Ig8f_lC-ABYv'))
                .storeDict(messagesToDict(message))
                .endCell();

            console.log(2);

            const comment_boc = beginCell()
                .storeStringRefTail("hello.")
                .endCell().toBoc().toString("base64");

            const stateInit: StateInit = {
                code: code,
                data: data
            };

            console.log(3);
            let cAddress = contractAddress(0, stateInit);
            console.log(4);

            await tonConnectUI.sendTransaction({
                validUntil: Math.floor(Number(new Date()) / 1000) + 360,
                messages: [
                    {
                        address: cAddress.toRawString(),
                        amount: (BigInt(totalValue) + (BigInt(message.length + Math.ceil(message.length / 254)) * toNano('0.01')) + (BigInt(message.length) * toNano('1'))).toString(),
                        payload: comment_boc,
                        stateInit: beginCell().storeWritable(storeStateInit(stateInit)).endCell().toBoc().toString('base64')
                    }
                ]
            })
            console.log(5);

            // await tonConnectUI.sendTransaction({
            //     validUntil: Math.floor(Number(new Date()) / 1000) + 360,
            //     messages: [
            //         {
            //             address: '0:3c35b788ac0aa2f782b68930277c6bc96993fa0a7137d52c3bcdbede574e3e60',
            //             amount: "20000000"
            //         }
            //     ]
            // })


            // data.bits.writeUint(Date.now(), 64);
            // data.bits.writeCoins(totalValue);
            // data.bits.writeUint(message.length, 16);
            // data.bits.writeUint(0, 16);
            // data.bits.writeUint(0, 1);
            // data.bits.writeAddress(new TonWeb.utils.Address("0QA1pWPJoe27enPAb9c-VNb4wYSrxluUvw61Ig8f_lC-ABYv"));
            // data.refs.push(messagesToDict(message))

            // tonConnectUI.sendTransaction(myTransaction)


        }

    };

    return (
        <StyledContainer maxWidth="md">
            <IntroductBox>
                <div className="title">Ton Mass Sender</div>
            </IntroductBox>

            <ActionBox>
                <StyledInput placeholder="comment" value={comment} onChange={e => { handleCommentChange(e.target.value) }} />
                {/* <StyedCheckBox>
                    <div
                        className={inputOrUpload ? 'activate' : 'unactivate'}
                        onClick={() => { setInputOrUpload(true) }}
                    >
                        Manual
                    </div>
                    <div
                        className={inputOrUpload ? 'unactivate' : 'activate'}
                        onClick={() => { setInputOrUpload(false) }}
                    >
                        Upload
                    </div>
                </StyedCheckBox> */}

                <StyledBtn className="sendBtn" onClick={() => { send() }}>
                    Send
                    <div className="BtnBg"></div>
                </StyledBtn>
            </ActionBox>

            <InputBox>
                {/* <div style={{ marginTop: "4px" }}> */}
                <div className="rules">
                    Supports 250 wallet.
                </div>
                <div>
                    <CodeMirrorEditor
                        value={addressListStr}
                        onChange={handleCodeChange}
                    />
                </div>
                {/* <div className={inputOrUpload ? 'uploadHidden' : 'uploadShow'}>
                        <Dragger {...props} beforeUpload={beforeUpload}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                                banned files.
                            </p>
                        </Dragger>
                    </div> */}
                {/* </div> */}
                <div className="tip">
                    <div className="fee">
                        <Popover
                            content={
                                <div style={{ fontSize: "16px", color: "rgb(20, 20, 20)", fontFamily: "Mulish" }}>
                                    Each wallet only need ~0.0012 ton gas, 45% gas savings! <br />
                                    To ensure transaction success, a gas of 0.01 TON will be sent for each wallet. <br />
                                    The excess gas will be refunded after the transaction is completed.
                                </div>
                            }
                            trigger="click"
                        >
                            Fee?
                        </Popover>
                    </div>
                    <div className="example">
                        <Popover
                            content={
                                inputOrUpload ?
                                    <pre style={{ margin: "0", padding: "4px 4px", fontSize: "16px", color: "rgb(20, 20, 20)" }}>
                                        EQDSC7VDsiAa0xrUk96tZxQ2DilLmUlRIBo2sS0yuJk6Hhy1,0.1 <br />
                                        EQDzltTJ0iYpoXac6D5IrKFADyvS8o1DrIXFfIg3W_9s3U5S,0.1 <br />
                                        EQA8NbeIrAqi94K2iTAnfGvJaZP6CnE31Sw7zb7eV04-YCtz,0.1
                                    </pre> :
                                    <div>
                                        <div style={{ height: "28px", width: "80px", fontSize: "16px", color: "rgb(20, 20, 20)", fontFamily: "Mulish" }} onClick={() => { exportExample("json") }}>
                                            <img style={{ width: "16px", marginRight: "2px" }} src={download} alt="" />JSON
                                        </div>
                                        <div style={{ height: "28px", width: "80px", fontSize: "16px", color: "rgb(20, 20, 20)", fontFamily: "Mulish" }} onClick={() => { exportExample("excel") }}>
                                            <img style={{ width: "16px", marginRight: "2px" }} src={download} alt="" />Excel
                                        </div>
                                    </div>
                            }
                            trigger="click"
                        >
                            Example
                        </Popover>
                    </div>
                </div>
            </InputBox>
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
    justify-content: space-between;
    border: 2px rgb(20, 20, 20) solid;
    padding: 16px 18px;
    margin-bottom: 8px;
`;

const StyledInput = styled(Input)`
    height: 42px;
    width: 100%;
    font-size: 16px;
    line-height: 42px;
    margin-right: 4px;
    border: 2px rgb(20, 20, 20) solid;
    padding: 0 0 0 2px;
    font-family: Mulish;
    border-radius: 0;
    margin-bottom: 4px;
`;

const InputBox = styled.div`
    border: 2px rgb(20, 20, 20) solid;
    padding: 12px 18px 16px;

    .rules {
        margin-bottom: 6px;
        color: #2dd813;
    }

    .CodeMirror {
        font-size: 16px;
        border: 2px rgb(20, 20, 20) solid;
    }

    .tip {
        width: 100%;
        text-align: right;
        margin-top: 2px;
        display: flex;
        justify-content: end;

        .fee {
            cursor: pointer;
            margin-right: 6px;
            text-decoration: underline;
        }

        .example {
            cursor: pointer;
            text-decoration: underline;
        }
    }

    /* .show {
        position: unset;
        left: unset;
    }
    .hidden {
        position: absolute;
        left: 5000px;
        visibility: hidden;
    }
    .uploadShow {
        display: unset;
        .ant-upload {
            font-family: 'Mulish';
        }
    }
    .uploadHidden {
        display: none;
    } */
`;

// const StyedCheckBox = styled.div`
//     display: flex;
//     border: 2px solid rgb(20, 20, 20);

//     div {
//         height: 42px;
//         width: 100px;
//         font-size: 16px;
//         line-height: 42px;

//         text-align: center;
//         cursor: pointer;

//         &.activate {
//             background-color: #E3579A;
//             color: #fff;
//         }
//     }
// `;

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