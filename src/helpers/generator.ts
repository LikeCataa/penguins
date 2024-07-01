import { WalletContractV4 } from "@ton/ton";
import { generateMnemonic } from "tonweb-mnemonic";
import { mnemonicToPrivateKey } from "@ton/crypto";

async function main() {
    for (let i = 30; i > 0; i++) {
        const mnemonic = await generateMnemonic();
        const keyPair = await mnemonicToPrivateKey(mnemonic);

        const wallet = WalletContractV4.create({
            workchain: 0,
            publicKey: keyPair.publicKey,
        });

        console.log(wallet.address.toString(), wallet.address.toString().slice(45), i, "flag");

        if (wallet.address.toString().slice(45) == "_FK") {
            console.log("match");
            break;
        }
    }
}

main();