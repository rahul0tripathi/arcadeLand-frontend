import {Game, Types} from 'phaser'
import {InitScene} from './scenes/init'
import './index.css'
// @ts-ignore
import M from 'materialize-css'
import Chain from "./chain";
import {pinJSONToIPFS} from "./ipfs";
import {GetLayerMetaData, Layer, Nft} from "./util";

declare global {
    interface Window {
        sizeChanged: () => void;
        game: Phaser.Game;
        enterverse: () => void
        layer: Layer;
        genLayer: Layer;
        runningScene: Phaser.Scene;
        verseBase: Object,
        nftList: Nft[]
    }
}
let gameConfig: Types.Core.GameConfig = {
    scale: {
        parent: 'game-view',
        mode: Phaser.Scale.ScaleModes.RESIZE,
        autoCenter: Phaser.Scale.NO_CENTER,
    },
    title: 'miniverse', type: Phaser.AUTO, parent: 'game-view', backgroundColor: "transparent", physics: {
        default: 'arcade', arcade: {
            debug: true
        }
    }, render: {
        antialiasGL: true, pixelArt: true,
    }, callbacks: {
        postBoot: () => {

        },
    }, canvasStyle: `width: 100%; height: 100%`, autoFocus: true, audio: {
        noAudio: false,
    }, scene: [],

}
var modalInstance: any;
var modalBottom: any;
document.addEventListener('DOMContentLoaded', async function () {
    let web3 = new Chain()
    await web3.connectToWallet()
    window.nftList = web3.rentedNftList
    let proposals = await web3.getTokenToApprove();
    if (proposals) {
        document.getElementById("proposal")!.innerText = JSON.stringify(proposals)
    }
    let val = window.localStorage.getItem("teleportTo")
    window.localStorage.clear()
    if ((web3.connected && web3.alreadyMinted) || val) {
        let layerURL;
        if (val) {
            layerURL = await web3.getLayerDataURL(parseInt(val))

            window.localStorage.clear()
        } else {
            layerURL = await web3.getLayerDataURL()
        }


        let layer = await GetLayerMetaData(layerURL)
        if (layer) {
            window.layer = layer
            if (val) await web3.updateRentedLands(val)
            window.nftList = web3.rentedNftList
            window.game = new Game(gameConfig);
            window.game.events.on('ready', () => {
                window.runningScene = window.game.scene.add("init", InitScene, true)

            })
        }
    } else {
        gameConfig.scene = [InitScene]
        window.game = new Game(gameConfig);
    }
    var elems = document.querySelectorAll('.sidenav');
    let modal = document.getElementById("modal1")
    modalInstance = M.Modal.init(modal)
    modalBottom = M.Modal.init(document.getElementById("modal2"))
    var instances = M.Sidenav.init(elems);
    let mintTrigger = document.getElementById("mint");
    mintTrigger!.addEventListener('click', () => {
        let assets = window.genLayer
        pinJSONToIPFS(assets).then(uri => {
            web3.mint(uri);
        })
    })
    document.getElementById("triggerRentTxn")!.addEventListener("click", async () => {
        console.log("called")
        await web3.newProposal()
    })
    let teleportBtn = document.getElementById("teleport");
    teleportBtn!.addEventListener('click', async () => {
        let teleportTo = parseInt((<HTMLInputElement>document.getElementById("landId"))!.value)

        localStorage.setItem("teleportTo", `${teleportTo}`)
        window.location.reload()
    })
    document.getElementById("approve")!.addEventListener('click', () => {
        web3.approve(true)
    })
    document.getElementById("deny")!.addEventListener('click', () => {
        web3.approve(false)
    })
    document.getElementById("rent")!.addEventListener('click', () => {
        if (modalInstance.isOpen) {
            modalInstance.close()
        } else {
            modalInstance.open()
        }
    })


});


//window.game = new Game(gameConfig);



