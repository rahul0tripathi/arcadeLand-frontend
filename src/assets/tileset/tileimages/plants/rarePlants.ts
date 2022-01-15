import {ResolveAddressPath, ResolveName, TileSetConfig} from "../../../../util";
import {TileSetImagePath} from "../../../../config";

const RarePlantsKey: string = "rarePlant"
const path: string = `${TileSetImagePath}/plants`


let PlantConfig: TileSetConfig[] = [];

for (let i = 0o1; i < 0o6; i++) {
    PlantConfig.push({
        columns: 2,
        resolveAddress: ResolveAddressPath(path, RarePlantsKey, i),
        imageheight: 32,
        imagewidth: 32,
        margin: 0,
        name: ResolveName(RarePlantsKey, i),
        spacing: 0,
        tilecount: 4,
        tileheight: 16,
        tilewidth: 16,
    })
}

export default {Config: PlantConfig, Key: RarePlantsKey}
