import Web3 from "web3";
import ArcadeLand from "../assets/contracts/arcadeLand.sol/ArcadeLand.json"
import Land from "../assets/contracts/rentedLands.sol/Land.json"
import ERC721 from "../assets/contracts/lib/ERC721.sol/ERC721.json"
import {CONTRACT} from "../config";
import {Contract} from "web3-eth-contract";
// @ts-ignore
import M from 'materialize-css'
import {genNftNK, Nft} from "../util";

declare let window: any;
export default class Chain {
    provider: Web3 | undefined;
    contract: Contract | undefined;
    public connected: boolean = false
    public alreadyMinted: boolean = false;
    public rentedNftList: Nft[] = []
    private userAddress: string = "";
    private tokenId: string = "0";
    private landContract: Contract | undefined;

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
            if (this.alreadyMinted) {
                this.tokenId = await this.contract?.methods.tokenOfOwnerByIndex(this.userAddress, 0).call()
                let addr = await this.contract?.methods.lands(this.tokenId).call();
                console.log(addr)
                // @ts-ignore
                this.landContract = new this.provider.eth.Contract(Land.abi, addr)
                let rentedLands = await this.landContract.methods.getRentedLands().call();

                for (let rent of rentedLands) {
                    // @ts-ignore
                    let nftContract = new this.provider.eth.Contract(ERC721.abi, "0xee29727e946d3b1b6a8c0a97b1058bdff7e9bec3")
                    console.log(rent[1][7])
                    let tokenURI = await nftContract.methods.tokenURI(Web3.utils.toBN(297)).call()
                    let data = await fetch(tokenURI).then(r => r.json());
                    console.log(data)
                    if (data?.image) {
                        this.rentedNftList.push({
                            ...genNftNK(`${rent[1][3]}`),
                            owner: rent[1][0],
                            url: `https://ik.imagekit.io/0otpum7apgg/tr:w-${parseInt(rent[1][3]) * 16},h-${parseInt(rent[1][4]) * 16}/${data.image}`,
                            x: parseInt(rent[1][1]),
                            y: parseInt(rent[1][2]),
                            width: parseInt(rent[1][3]) * 16,
                            height: parseInt(rent[1][4]) * 16,
                            data: JSON.stringify(data)
                        })
                    }

                    console.log(this.rentedNftList)
                }

            }

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

    public async getLayerDataURL(landId?: number): Promise<string> {
        console.log("called")
        let tokenId = 0;
        if (!landId) {
            tokenId = await this.contract?.methods.tokenOfOwnerByIndex(this.userAddress, 0).call()
        } else {
            tokenId = landId
        }

        return this.contract?.methods.tokenURI(tokenId).call().then((uri: any) => {
            return uri
        })
    }

    public async newProposal() {
        try {


            let setX = Web3.utils.toBN(parseInt((<HTMLInputElement>document.getElementById("setX"))!.value)).toString()
            let setY = Web3.utils.toBN(parseInt((<HTMLInputElement>document.getElementById("setY"))!.value)).toString()
            let landId = Web3.utils.toBN(parseInt((<HTMLInputElement>document.getElementById("land"))!.value)).toString()
            let width = parseInt((<HTMLInputElement>document.getElementById("widthNFT"))!.value)
            let height = parseInt((<HTMLInputElement>document.getElementById("heightNFT"))!.value)
            let duration = parseInt((<HTMLInputElement>document.getElementById("duration"))!.value)
            let tokenId = Web3.utils.toBN(parseInt((<HTMLInputElement>document.getElementById("tokenId"))!.value)).toString();
            let addr = (<HTMLInputElement>document.getElementById("contractAddress"))!.value
            let landAddress = await this.contract?.methods.lands(landId).call();
            console.log(landAddress)
            // @ts-ignore
            let rentContract = new this.provider.eth.Contract(Land.abi, landAddress)
            if (!parseInt(await rentContract!.methods.pendingProposal().call())) {
                console.log(Web3.utils.toWei(`${0.001 * width * height * duration}`, "ether"))
                console.log(setX,
                    setY,
                    Web3.utils.toBN(width).toString(),
                    Web3.utils.toBN(height).toString(),
                    Web3.utils.toBN(duration).toString(),
                    tokenId,
                    addr)
                rentContract?.methods.newProposal(
                    setX,
                    setY,
                    Web3.utils.toBN(width).toString(),
                    Web3.utils.toBN(height).toString(),
                    Web3.utils.toBN(duration).toString(),
                    tokenId,
                    addr).send({
                    from: this.userAddress,
                    value: Web3.utils.toWei(`${0.001 * width * height * duration}`, "ether")
                })
            } else {
                M.toast({html: 'Proposal queue not empty'})
            }
        } catch (err) {
            M.toast({html: err})
        }

    }

    public async getTokenToApprove() {
        if (!await this.isProposalQueueEmpty()) {
            return await this.landContract?.methods._rents(await this.landContract!.methods.pendingProposal().call()).call()
        } else {
            return null
        }
    }

    public async approve(value: boolean) {
        if (this.alreadyMinted && !await this.isProposalQueueEmpty()) {
            this.landContract?.methods.updateProposalStatus(value).send({
                from: this.userAddress,
            });
            return true
        } else {
            return null
        }
    }

    private async isProposalQueueEmpty(): Promise<boolean> {
        if (this.alreadyMinted) {
            return !parseInt(await this.landContract!.methods.pendingProposal().call())
        } else {
            return false
        }

    }
}

