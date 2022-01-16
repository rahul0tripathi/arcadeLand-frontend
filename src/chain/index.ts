import Web3 from "web3";
import ArcadeLand from "../assets/contracts/arcadeLand.sol/ArcadeLand.json"
import {CONTRACT} from "../config";
import {Contract} from "web3-eth-contract";

declare let window: any;
export default class Chain {
    provider: Web3 | undefined;
    contract: Contract | undefined;
    public connected: boolean = false
    public alreadyMinted: boolean = false;
    private userAddress: string = "";

    constructor() {
    }

    public getAddress = () => {
        return this.userAddress
    }
    public connectToWallet = async () => {
        if (window.ethereum) {
            let account = await window.ethereum.send('eth_requestAccounts');
            this.provider = new Web3(window.ethereum);
            this.userAddress = account.result[0]
            let e = document.getElementById("address");
            if (e)
                e.innerText = this.userAddress.substring(0, 8) + '...'
            // @ts-ignore
            this.contract = new this.provider.eth.Contract(ArcadeLand.abi, CONTRACT)
            await this.contract.methods.balanceOf(this.userAddress).call({
                from: this.userAddress,
            }).then((data: any) => {
                console.log(data)
                this.connected = true
                if (data > 0) {
                    this.alreadyMinted = true
                    document.getElementById("mint")!.setAttribute("disabled", "true")
                }
            }).catch((err: any) => {
                console.log(err)
            });


        }

    }

    public mint(uri: string) {
        if (this.provider && this.userAddress) {
            this.contract?.methods.mint(uri).send({
                from: this.userAddress,
                value: Web3.utils.toWei("0.001", "ether")
            });
        }
    }

    public getLayerDataURL(): Promise<string> {
        console.log("called")
        return this.contract?.methods.tokenOfOwnerByIndex(this.userAddress, 0).call().then((tokenId: any) => {
            return this.contract?.methods.tokenURI(tokenId).call().then((uri: any) => {
                return uri
            })

        })
    }
}

