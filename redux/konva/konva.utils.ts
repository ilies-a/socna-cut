import { MaterialData } from "@/global";

export const addMaterialData = (materialDataDict:{ [key: string]: MaterialData }, materialData:MaterialData): { [key: string]: MaterialData } => {
    return {...materialDataDict, [materialData.getId()]:materialData};
  };
  
export const updateMaterialData = (materialDataDict:{ [key: string]: MaterialData }, materialData:MaterialData):{ [key: string]: MaterialData } => {
    if(materialDataDict[materialData.getId()] instanceof MaterialData){
      return {...materialDataDict, [materialData.getId()]:materialData}
    };
    return materialDataDict;
  };

  export const updateDraggableIconPosition = (draggableIcon:{ [key: string]: any }, position:[number, number]):{ [key: string]: {} } => {
      return {...draggableIcon, 'position':position}
  };