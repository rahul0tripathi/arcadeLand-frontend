import {Scene, Cameras, Tilemaps} from "phaser";
import Actor from "./Actor";
import {ASSET_LAYER} from "../config";

export declare interface TileSetImage {
    name: string,
    key: string

}

export class Map {
    map!: Tilemaps.Tilemap
    tilemapLayers!: Tilemaps.Tileset[]
    scale: integer
    layers!: { genesis: Tilemaps.TilemapLayer, plants: Tilemaps.TilemapLayer, nft: Tilemaps.TilemapLayer, assets:Tilemaps.TilemapLayer }

    constructor(scale: integer) {
        this.scale = scale
    }

    getWidth(): integer {
        return this.map.widthInPixels * this.scale
    }

    getHeight(): integer {
        return this.map.heightInPixels * this.scale
    }

    addCollision(scene: Scene, player: Actor): void {
        this.layers.genesis.setCollisionByProperty({collides: true});
        this.layers.plants.setCollisionByProperty({collides: true});
        scene.physics.add.collider(player, this.layers.genesis);
        scene.physics.add.collider(player, this.layers.plants);
        scene.physics.add.collider(player, this.layers.genesis);
    }
    phaserMap(){
        return this.map
    }
    init(scene: Scene, camera: Cameras.Scene2D.Camera, images: TileSetImage[] = []): void {
        this.map = scene.make.tilemap({
            key: "map"
        })
        camera.setBounds(
            0, 0, this.getWidth(), this.getHeight()
        )
        this.tilemapLayers = [
            this.map.addTilesetImage("test", "tiles"),
            this.map.addTilesetImage("island", "island"),
            this.map.addTilesetImage("plants", "plants"),
            this.map.addTilesetImage("showcase", "floor"),
            ...images.map(img =>{
                console.log(img)
                return this.map.addTilesetImage(img.name, img.key)
            })
        ]

        this.layers = {
            genesis: this.map.createLayer("genesis", this.tilemapLayers, 0, 0),
            assets: this.map.createLayer(
                ASSET_LAYER,
                this.tilemapLayers,
                0,
                0
            ),
            plants: this.map.createLayer("beach-trees", this.tilemapLayers, 0, 0),
            nft: this.map.createLayer("showcase", this.tilemapLayers, 0, 0)
        }
        this.layers.genesis.scale = this.scale
        this.layers.assets.scale = this.scale;
        this.layers.plants.scale = this.scale;
        this.layers.nft.scale = this.scale
        this.layers.plants.setDepth(10);
        this.layers.assets.setDepth(11);

    }

    getTileAt(x: number, y: number, camera: Cameras.Scene2D.Camera) {
        const test = this.map.getTileAtWorldXY(x, y, false, camera, this.layers.nft)
        console.log(test)
    }

}