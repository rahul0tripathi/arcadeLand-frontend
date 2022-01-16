import {Game, Types} from 'phaser'
import {InitScene} from './scenes/init'
import './index.css'
// @ts-ignore
import M from 'materialize-css'
import ignore from "ignore";
import Chain from "./chain";
import {pinJSONToIPFS} from "./ipfs";
import {GetLayerMetaData, Layer} from "./util";


declare global {
    interface Window {
        sizeChanged: () => void;
        game: Phaser.Game;
        enterverse: () => void
        layer: Layer;
        genLayer: Layer;
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
    if (web3.connected && web3.alreadyMinted) {
        let layerURL = await web3.getLayerDataURL()
        let layer = await GetLayerMetaData(layerURL)
        if (layer) {
            window.layer = layer
            console.log(layer)
            gameConfig.scene = [InitScene]
            window.game = new Game(gameConfig);
        }
    }else{
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


});
const handlerInspector = (e: KeyboardEvent) => {
    if (e.key == 'x') {
        console.log(modalInstance)
        if (modalInstance.isOpen) {
            modalInstance.close()
        } else {
            let modal = document.getElementById("modal1")
            if (modal)
                modal.innerHTML = `<iframe style=" height: 100%; width: 100%" src="https://opensea.io/assets/0x60e4d786628fea6478f785a6d7e704777c86a7c6/7197"/>`
            modalInstance.open()
        }

    } else if (e.key == 'c') {
        if (modalBottom.isOpen) {
            modalBottom.close()
        } else {
            modalBottom.open()
        }
    }

}

document.addEventListener('keydown',
    handlerInspector
);


//window.game = new Game(gameConfig);



