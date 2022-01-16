import {Scene, Physics, Types, Cameras} from 'phaser'
import Actor from "../../classes/Actor";
import {Map, TileSetImage} from "../../classes/map";
import miniverse from "../../assets/tileset/miniverse.json";
import Miniverse from "../../classes/miniverse";
import {Layer, LoadTileSetToScene} from "../../util";
import staticSets from "../../assets/tileset/index";
import {SCALE} from "../../config";
import {pinJSONToIPFS} from "../../ipfs";
import Chain from "../../chain";

declare interface Nft extends TileSetImage {
    x: number,
    y: number,
    width: number,
    height: number,
    url: string
}

const soundWeight = (x: integer, y: integer, x1: integer, y1: integer) => {
    return Phaser.Math.Distance.Between(x, y, x1, y1);
};

const genNftNK = (name: string) => {
    return {
        name,
        key: `${name}set`
    }
}
// let x = document.getElementById("x");
// let y = document.getElementById("y");
// x!.innerText = String(0);
// y!.innerText = String(0);
export class InitScene extends Scene {
    private player!: Actor
    private cursorKeys!: Types.Input.Keyboard.CursorKeys
    private map!: Map
    private tileset!: Object
    private readonly nftList!: Nft[]
    private assetNK!: TileSetImage[]
    private verse!: Miniverse
    private DLayerData!: Layer

    constructor() {
        super('init-scene');
        this.tileset = {}
        this.nftList = [{
            ...genNftNK("ape"),
            x: 50,
            y: 60,
            width: 64,
            height: 64,
            url: "images/ape.png"
        }, {
            ...genNftNK("ape2"),
            x: 20,
            y: 30,
            width: 64,
            height: 64,
            url: "images/ape2.png"
        }]
        this.assetNK = []
        this.DLayerData = window.layer
    }

    static getRandomAsset() {
        let m = new Miniverse(miniverse)
        return m.genRandomAsset()

    }

    preload(): void {
        this.load.baseURL = 'assets/'
        this.load.atlas('player', 'player/player.png', 'player/player.json')
        this.load.image("tiles", "tileset/tileimages/default/default.png")
        this.load.image("floor", "tileset/tileimages/default/floor.png")
        this.load.image("island", "tileset/tileimages/default/island.png")
        this.load.image("plants", "tileset/tileimages/default/plants.png")
        this.load.audio("shore", "audio/shore.wav", {
            instance: 1,
        });
        staticSets.forEach(set => {
            LoadTileSetToScene(set.Config, this)
            set.Config.forEach(x => {
                this.assetNK.push({
                    ...genNftNK(x.name)
                })
            })
        })
        this.renderNFT()
        this.load.tilemapTiledJSON("map", this.tileset)
    }

    create(): void {
        console.log("init scene")

        this.cursorKeys = this.input.keyboard.createCursorKeys()
        const controls = new Cameras.Controls.FixedKeyControl({
            camera: this.cameras.main,
            left: this.cursorKeys.left,
            right: this.cursorKeys.right,
            up: this.cursorKeys.up,
            down: this.cursorKeys.down,
            speed: 0.5,
        })

        this.map = new Map(SCALE)
        this.map.init(this, this.cameras.main, [...this.nftList, ...this.assetNK])

        this.player = new Actor(this, 'player', this.cursorKeys, 175)
        this.player.Resize(0.8, 0.8)
        this.player.Teleport(this.map.getWidth() / 2, this.map.getHeight() / 2)
        this.player.InitAnimations()
        this.map.addCollision(this, this.player)
        this.cameras.main.startFollow(this.player)
        // setInterval(() => {
        //     this.map.getTileAt(this.player.x, this.player.y, this.cameras.main)
        // }, 2000)
        let instance = this.sound.add("shore", {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0,
        });
        instance.play();


    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.player.update()
        let minDist = Math.max(
            soundWeight(this.player.x, 0, 50, 0),
            soundWeight(this.player.x, 0, this.map.phaserMap().widthInPixels * SCALE, 0),
            soundWeight(0, this.player.y, 0, 50),
            soundWeight(0, this.player.y, 0, this.map.phaserMap().heightInPixels * SCALE)
        );
        let vol =
            minDist /
            Math.min(this.map.phaserMap().heightInPixels * SCALE, this.map.phaserMap().widthInPixels * SCALE) -
            0.7;
//@ts-ignore
        this.sound.setVolume(vol < 0 ? 0 : vol);

    }

    private renderNFT(): void {
        this.verse = new Miniverse(miniverse)
        this.nftList.map((v) => {
            this.verse.addNewNFT(v.x, v.y, v.name, v.url, v.width, v.height, this)
        })
        if (!window.layer) {
            window.genLayer = this.verse.genRandomAsset();
            this.verse.initAssets(window.genLayer)
        } else {
            this.verse.initAssets(window.layer)
        }
        this.tileset = this.verse.gettileset()
        console.log(this.tileset)
    }
}