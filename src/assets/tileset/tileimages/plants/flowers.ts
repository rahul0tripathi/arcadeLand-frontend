import {TileSetImagePath} from "../../../../config";
import {ResolveAddressPath, ResolveName, TileSetConfig} from "../../../../util";

const FlowerKey: string = "flower"
const path: string = `${TileSetImagePath}/plants`

let PlantConfig: TileSetConfig[] = [];
for (let i = 0o1; i < 0o5; i++) {
    PlantConfig.push({
        columns: 2,
        resolveAddress: ResolveAddressPath(path, FlowerKey, i),
        imageheight: 32,
        imagewidth: 32,
        margin: 0,
        name: ResolveName(FlowerKey, i),
        spacing: 0,
        tilecount: 4,
        tileheight: 16,
        tilewidth: 16,
    })
}
export default {Config: PlantConfig, Key: FlowerKey}