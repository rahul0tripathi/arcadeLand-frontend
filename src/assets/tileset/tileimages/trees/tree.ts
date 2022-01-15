import {TileSetImagePath} from "../../../../config";
import {ResolveAddressPath, ResolveName, TileSetConfig} from "../../../../util";

const TreeKey: string = "tree"
const path: string = `${TileSetImagePath}/trees`

let PlantConfig: TileSetConfig[] = [];
for (let i = 0o1; i < 0o5; i++) {
    PlantConfig.push({
        columns: 6,
        resolveAddress: ResolveAddressPath(path, TreeKey, i),
        imageheight: 96,
        imagewidth: 96,
        margin: 0,
        name: ResolveName(TreeKey, i),
        spacing: 0,
        tilecount: 36,
        tileheight: 16,
        tilewidth: 16,
    })
}
export default {Config: PlantConfig, Key: TreeKey}