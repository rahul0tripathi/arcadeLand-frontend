import * as phaser from "phaser";
import axios from "axios";
import {TileSetImage} from "../classes/map";

declare interface Nft extends TileSetImage {
    x: number,
    y: number,
    width: number,
    height: number,
    url: string,
    owner:string,
    data:string
}

declare interface TileSetConfig {
    columns: number
    resolveAddress: string
    imageheight: number
    imagewidth: number
    margin: number
    name: string
    spacing: number
    tilecount: number
    tileheight: number
    tilewidth: number
}

declare interface ModuleConfig {
    Key: string,
    Config: TileSetConfig[]
}

declare interface Root {
    compressionlevel: number
    height: number
    infinite: boolean
    layers: Layer[]
    nextlayerid: number
    nextobjectid: number
    orientation: string
    renderorder: string
    tiledversion: string
    tileheight: number
    tilesets: Tileset[]
    tilewidth: number
    type: string
    version: string
    width: number
}

declare interface Layer {
    data: number[]
    height: number
    id: number
    name: string
    opacity: number
    type: string
    visible: boolean
    width: number
    x: number
    y: number
}

declare interface Tileset {
    columns: number
    firstgid: number
    image: string
    imageheight: number
    imagewidth: number
    margin: number
    name: string
    spacing: number
    tilecount: number
    tileheight: number
    tiles?: Tile[]
    tilewidth: number
    transparentcolor: string
}

declare interface Tile {
    id: number
    properties: Property[]
}

declare interface Property {
    name: string
    type: string
    value: boolean
}

const ResolveAddressPath = function (url: string, key: string, id: integer): string {
    return `${url}/${key}${id}.png`
}
const ResolveName = function (key: string, id: integer): string {
    return `${key}${id}`
}
const LoadTileSetToScene = function (tileset: TileSetConfig[], scene: phaser.Scene): void {
    for (let set of tileset) {
        scene.load.image(`${set.name}set`, set.resolveAddress)
    }

}
const RandomInRange = function (min: integer, max: integer): integer {
    return Math.floor(Math.random() * (max - min) + min)
}

enum RenderLayerErrors {
    InvalidPosition,
    ImageOutOfBounds,
    LocationAlreadyOccupied
}

const GetLayerMetaData = (uri: string): Promise<Layer | null> => {
    console.log(uri)
    return axios.get(uri).then(resp => {
        return resp.data
    }).catch(() => {
        return null
    })
}
const genNftNK = (name: string) => {
    return {
        name,
        key: `${name}set`
    }
}
export {
    ResolveAddressPath,
    ResolveName,
    LoadTileSetToScene,
    RandomInRange,
    TileSetConfig,
    ModuleConfig,
    Tile,
    Tileset,
    Root,
    Property,
    Layer,
    RenderLayerErrors,
    GetLayerMetaData,
    Nft,
    genNftNK
}