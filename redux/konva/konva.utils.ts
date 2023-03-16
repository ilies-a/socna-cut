import { MaterialData } from "@/global";

export const addMaterialData = (materialDataDict:{ [key: string]: MaterialData }, materialData:MaterialData) => {
    return {...materialDataDict, [materialData.getId()]:materialData};
  };
  
export const updateMaterialData = (materialDataDict:{ [key: string]: MaterialData }, materialData:MaterialData) => {
    if(materialDataDict[materialData.getId()] instanceof MaterialData){
      return {...materialDataDict, [materialData.getId()]:materialData}
    };
    return materialDataDict;
  };