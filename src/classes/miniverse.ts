import {Scene} from "phaser";
import {Root, Tileset, Tile, Layer, Property, TileSetConfig, RandomInRange, RenderLayerErrors} from '../util/index'
import staticSets from "../assets/tileset/index";
import {ASSET_LAYER, NFT_LAYER} from "../config";
import flowers from "../assets/tileset/tileimages/plants/flowers";
import rarePlants from "../assets/tileset/tileimages/plants/rarePlants";
import tree from "../assets/tileset/tileimages/trees/tree";
import bush from "../assets/tileset/tileimages/bushes/bush";


export default class Miniverse {
    tileset!: Root
    width: integer
    height: integer
    renderSet: TileSetConfig[]
    allowedSets: { [key: string]: boolean }
    assetMap: { [key: string]: Tileset }

    constructor(map: any) {
        this.tileset = map
        this.width = this.tileset.layers[0].data.length / this.tileset.height
        this.height = this.tileset.height
        let layer = this.newLayerData(NFT_LAYER)
        this.tileset.layers.push(layer)
        this.renderSet = []
        this.allowedSets = {}
        this.assetMap = {}
    }

    genRandomAsset() {
        // fixed flowers
        for (let i = 0; i < 8; i++) {
            this.renderSet.push(flowers.Config[RandomInRange(0, flowers.Config.length)])
        }
        // fixed number of trees
        for (let i = 0; i < 2; i++) {
            this.renderSet.push(tree.Config[RandomInRange(0, tree.Config.length)])
        }
        //Giving extra flowers and rare plants equally
        let extraFlowersProbability = RandomInRange(0, 20);
        if (extraFlowersProbability) {
            extraFlowersProbability = extraFlowersProbability % 2 == 0 ? extraFlowersProbability : extraFlowersProbability - 1;
            for (let i = 0; i < extraFlowersProbability / 2; i++) {
                this.renderSet.push(flowers.Config[RandomInRange(0, flowers.Config.length)])
                this.renderSet.push(rarePlants.Config[RandomInRange(0, rarePlants.Config.length)])
            }
        }

    }

    initAssets() {
        let assetLayer = this.newLayerData(ASSET_LAYER)
        try {
            for (let set of staticSets) {
                for (let tile of set.Config) {
                    let temp_set = this.newTileSet(tile)
                    this.assetMap[temp_set.name] = temp_set
                    this.tileset.tilesets.push(temp_set)
                }
            }
        } catch (err) {
            console.log(err)
        }
        for (let i of this.renderSet) {
            let x = RandomInRange(16, 80)
            let y = RandomInRange(16, 80)
            while (true) {
                let snapShot = assetLayer.data
                try {
                    assetLayer.data = this.computeLayerData(this.assetMap[i.name], x, y, assetLayer.data)
                    break
                } catch (err) {
                    console.log(err)
                    if (err === RenderLayerErrors.LocationAlreadyOccupied) {
                        assetLayer.data = snapShot
                        x = RandomInRange(16, 80)
                        y = RandomInRange(16, 80)
                    } else {
                        break
                    }
                }

            }
        }
        this.tileset.layers.push(assetLayer)

    }

    addNewNFT(initx: integer, inity: integer, key: string, url: string, scene: Scene, width: number, height: number): void {
        scene.load.image(`${key}set`, url)
        let config: TileSetConfig = {
            columns: width / 16,
            imageheight: height,
            resolveAddress: "",
            imagewidth: width,
            margin: 0,
            name: key,
            spacing: 0,
            tilecount: Math.floor(width / 16 * height / 16),
            tileheight: 16,
            tilewidth: 16,
        }
        let set = this.newTileSet(config)
        this.tileset.layers[this.tileset.layers.length - 1].data = this.computeLayerData(set, initx, inity, this.tileset.layers[this.tileset.layers.length - 1].data)
        this.tileset.tilesets.push(set)
    }

    gettileset(): Root {
        return this.tileset
    }

    private newTileSet(config: TileSetConfig): Tileset {
        return {
            columns: config.columns,
            firstgid: this.tileset.tilesets[this.tileset.tilesets.length - 1].firstgid + this.tileset.tilesets[this.tileset.tilesets.length - 1].tilecount,
            imageheight: config.imageheight,
            imagewidth: config.imagewidth,
            margin: config.margin,
            image: "metaverse.gg",
            name: config.name,
            spacing: config.spacing,
            tilecount: config.tilecount,
            tileheight: config.tileheight,
            tilewidth: config.tilewidth,
            transparentcolor: "transparent"
        }
    }

    private newLayerData(name: string): Layer {
        return {
            y: 0,
            height: this.tileset.height,
            id: this.tileset.layers.length + 1,
            name,
            opacity: 1,
            type: "tilelayer",
            width: this.width,
            x: 0,
            visible: true,
            data: new Array(this.width * this.height).fill(0) as number[],
        }
    }

    private computeLayerData(set: Tileset, x: integer, y: integer, layer: integer[]): integer[] {
        console.log(set.name, x, y, layer)
        if (x > this.width || x < 0 || y < 0 || y > this.height) {
            throw RenderLayerErrors.InvalidPosition
        }
        let traverseDistanceX = set.imagewidth / set.tilewidth
        let traverseDistanceY = set.imageheight / set.tileheight
        if (x + traverseDistanceX > this.width) {
            throw RenderLayerErrors.ImageOutOfBounds
        }
        let currentIndex = y === 0 ? 1 * this.height : (y - 1) * this.height
        if (x > 0) {
            currentIndex += x
        }
        let currentGrid = set.firstgid
        for (let j = 0; j < traverseDistanceY; j++) {
            for (let i = 0; i < traverseDistanceX; i++) {
                if (layer[currentIndex + i])
                    throw RenderLayerErrors.LocationAlreadyOccupied
                layer[currentIndex + i] = currentGrid
                currentGrid++
            }
            currentIndex += this.tileset.height
        }
        return layer
    }
}