export const KONVA_WIDTH_SCALE = 0.8;
export const KONVA_HEIGHT_SCALE = 0.8;
// export const KONVA_PADDING = 1;
export const MATERIAL_STROKE = 0.2;

export class MaterialData {
  private id:string;
  private type:string;
  private x: number;
  private y: number;
  private widthRatio: number;
  private height: number = 20;
  // path:[number, number][];
  isSelected:boolean = false;

  constructor(id:string, type:string, x:number, y:number, widthRatio:number){
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.widthRatio = widthRatio;
  }

  getId(): string{
    return this.id;
  }

  getX(): number{
    return this.x
  }

  getY(): number{
    return this.y
  }

  getWidthRatio(): number{
    return this.widthRatio;
  }

  getHeight(): number{
    return this.height
  }

  getIsSelected(): boolean{
    return this.isSelected
  }

  setWidthRatio(newWidthRatio: number){
    this.widthRatio = newWidthRatio;
  }

  setHeight(newHeight: number){
    this.height = newHeight;
  }

  setIsSelected(isSelected: boolean){
    this.isSelected = isSelected;
  }
  // clone(): MaterialData{
  //   const newMaterialData = new MaterialData(

  //   );
  // }
}

export const getSelectedMaterialDataList = ( materialDataDict: { [key: string]: MaterialData }): MaterialData[] => {
  return Object.keys(materialDataDict).map(key => materialDataDict[key]).filter(materialData => materialData.getIsSelected());
}