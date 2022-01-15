import {ResolveAddressPath, ResolveName, TileSetConfig} from "../../../../util";
import {TileSetImagePath} from "../../../../config";

const key: string = "bush"
const path: string = `${TileSetImagePath}/bushes`


let BushConfig: TileSetConfig[] = [];
for (let i = 0o1; i < 0o5; i++) {
    BushConfig.push({
        columns: 6,
        resolveAddress: ResolveAddressPath(path, key, i),
        imageheight: 96,
        imagewidth: 96,
        margin: 0,
        name: ResolveName(key, i),
        spacing: 0,
        tilecount: 36,
        tileheight: 16,
        tilewidth: 16,
    })
}

export default {
    Config: BushConfig,
    Key: key
}