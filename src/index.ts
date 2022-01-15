import {Game, Types} from 'phaser'
import {InitScene} from './scenes/init'
import './index.css'
// @ts-ignore
import M from 'materialize-css'
import ignore from "ignore";

declare global {
    interface Window {
        sizeChanged: () => void;
        game: Phaser.Game;
        enterverse: () => void
    }
}
const gameConfig: Types.Core.GameConfig = {
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
    }, scene: [InitScene],
}
var modalInstance: any;
var modalBottom: any;
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    let modal = document.getElementById("modal1")
    modalInstance = M.Modal.init(modal)
    modalBottom = M.Modal.init(document.getElementById("modal2"))
    var instances = M.Sidenav.init(elems);
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


window.game = new Game(gameConfig);

