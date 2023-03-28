export const KONVA_WIDTH_SCALE = 0.8;
export const KONVA_HEIGHT_SCALE = 0.8;
// export const KONVA_PADDING = 1;
export const MATERIAL_STROKE = 0.2;

export enum Direction {ToLeft, ToRight, ToTop, ToBottom};

export abstract class MaterialData {
  private id:string;
  private xRatio: number;
  private y: number;
  private widthRatio: number;
  private height: number = 20;
  // path:[number, number][];
  isSelected:boolean = false;

  constructor(id:string, xRatio:number, y:number, widthRatio:number){
    this.id = id;
    this.xRatio = xRatio;
    this.y = y;
    this.widthRatio = widthRatio;
  }

  getId(): string{
    return this.id;
  }

  getXRatio(): number{
    return this.xRatio;
  }

  getY(): number{
    return this.y;
  }

  getWidthRatio(): number{
    return this.widthRatio;
  }

  getHeight(): number{
    return this.height;
  }

  getIsSelected(): boolean{
    return this.isSelected;
  }

  getLeft(): number{
    return this.xRatio;
  }

  getRight(): number{
    return this.xRatio + this.widthRatio; 
  }

  getTop(): number{
    return this.y;
  }

  getBottom(): number{
    return this.y + this.height; 
  }

  setXRatio(newXRatio: number){
    this.xRatio = newXRatio;
  }

  setY(newY: number){
    this.y = newY;
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

  getStart(direction:Direction): number{
      switch(direction){
        case Direction.ToLeft:
            return this.getRight();
        case Direction.ToRight:
            return this.getLeft();
        case Direction.ToTop:
          return this.getBottom();
        case Direction.ToBottom:
          return this.getTop();
    }
  }

  getEnd(direction:Direction): number{
    switch(direction){
      case Direction.ToLeft:
        return this.getLeft();
      case Direction.ToRight:
        return this.getRight();
      case Direction.ToTop:
        return this.getTop();
      case Direction.ToBottom:
        return this.getBottom();
    }
  }

  getPos(direction:Direction): number{
    switch(direction){
      case Direction.ToLeft:
      case Direction.ToRight:
          return this.getXRatio();
      case Direction.ToTop:
      case Direction.ToBottom:
          return this.getY();
    }
  }

  getSize(direction:Direction): number{
    switch(direction){
      case Direction.ToLeft:
      case Direction.ToRight:
          return this.getWidthRatio();
      case Direction.ToTop:
      case Direction.ToBottom:
          return this.getHeight();
    }
  }

  calculateEndWithSizeAndDirection(size:number, direction:Direction): number{
    switch(direction){
      case Direction.ToLeft:
        return this.getLeft() - (size - this.getWidthRatio());
      case Direction.ToRight:
        return this.getLeft() + size;
      case Direction.ToTop:
        return this.getY() - (size - this.getHeight());
      case Direction.ToBottom:
        return this.getY() + size;
    }
  }

  calculateEndWithPosAndDirection(pos:number, direction:Direction): number{
    switch(direction){
      case Direction.ToLeft:
      case Direction.ToTop:
        return pos;
      case Direction.ToRight:
        return pos + this.getWidthRatio();
      case Direction.ToBottom:
        return pos + this.getHeight();
    }
  }

  setSizeWithDirection(value:number, direction:Direction){
    switch(direction){
      case Direction.ToLeft:
        this.setXRatio(this.getXRatio() - (value - this.getWidthRatio()));
        this.setWidthRatio(value);
        break;
      case Direction.ToRight:
        this.setWidthRatio(value);
        break;
      case Direction.ToTop:
        this.setY(this.getY() - (value - this.getHeight()));
        this.setHeight(value);
        break;
      case Direction.ToBottom:
        this.setHeight(value);
        break;
    }
  }
  setPos(value:number, direction:Direction){
    switch(direction){
      case Direction.ToLeft:
      case Direction.ToRight:
        this.setXRatio(value);
        break;
      case Direction.ToTop:
      case Direction.ToBottom:
        this.setY(value);
        break;
    }
  }
  setPosWithEndAndDirection(end:number, direction:Direction){
    switch(direction){
      case Direction.ToLeft:
        
        break;
      case Direction.ToRight:
        this.setXRatio(end);
        break;
      case Direction.ToTop:
        break;
      case Direction.ToBottom:
        this.setY(end);
        break;
    }
  }

}

export const blockTypes: { [key: string]: any } = {
    'Type1': {
      'name': 'Type1',
      'colorForTests': 'blue' 
    },
    'Type2': {
      'name': 'Type2',
      'colorForTests': 'green' 
    },
    'Type3': {
      'name': 'Type3',
      'colorForTests': 'yellow' 
    },
    'Type4': {
      'name': 'Type4',
      'colorForTests': 'orange' 
    },
    'Type5': {
      'name': 'Type5',
      'colorForTests': 'cyan' 
    },
    'Type6': {
      'name': 'Type6',
      'colorForTests': 'magenta' 
    },
    'Type7': {
      'name': 'Type7',
      'colorForTests': 'brown' 
    },
    'Type8': {
      'name': 'Type8',
      'colorForTests': 'red' 
    },
  };


export class BlockType1Data extends MaterialData {
  imageUrl = "dalle.png";
  colorForTests = "blue";
  constructor(id:string, xRatio:number, y:number, widthRatio:number){
    super(id, xRatio, y, widthRatio )
  }
}

export class BlockType2Data extends MaterialData {
  imageUrl = "dalle.png";
  colorForTests = "green";
  constructor(id:string, xRatio:number, y:number, widthRatio:number){
    super(id, xRatio, y, widthRatio )
  }
}

export class BlockType3Data extends MaterialData {
  imageUrl = "dalle.png";
  colorForTests = "yellow";
  constructor(id:string, xRatio:number, y:number, widthRatio:number){
    super(id, xRatio, y, widthRatio )
  }
}

// class BlockType{
//   name:string;
//   imageUrl:string;

//   constructor(name:string, imageUrl:string){
//     this.name = name;
//     this.imageUrl = imageUrl; 
//   }
// }


export const getSelectedMaterialDataArray = ( materialDataDict: { [key: string]: MaterialData }): MaterialData[] => {
  return Object.keys(materialDataDict).map(key => materialDataDict[key]).filter(materialData => materialData.getIsSelected());
}

export const getMaterialDataArray = ( materialDataDict: { [key: string]: MaterialData }): MaterialData[] => {
  return Object.keys(materialDataDict).map(key => materialDataDict[key]);
}

export const getPlanLimit = (direction:Direction, planHeight:number): number => {
  switch(direction){
    case Direction.ToLeft:
      return 0
    case Direction.ToRight:
      return 1;
    case Direction.ToTop:
      return 0;
    case Direction.ToBottom:
        return planHeight;
    default:
        return 0;
  }
}

// export const valueOverflows = (value:number, limit:number, direction:Direction): boolean => {
//   switch(direction){
//     case Direction.ToLeft:
//     case Direction.ToTop:
//       return value < limit;
//     case Direction.ToRight:
//     case Direction.ToBottom:
//       return value > limit;
//     default:
//         return false;
//   }
// }

export class KonvaPlanHandler {
  static limitLeft:number = 0;
  static limitTop:number = 0;
  static limitRight:number = 100;
  static limitBottom:number = 100;

  static setLimitBottom(planHeight:number){
    KonvaPlanHandler.limitBottom = planHeight;
  }

  static valueOverflow = (value:number, direction:Direction): number => {
    switch(direction){
      case Direction.ToLeft:
        return value < KonvaPlanHandler.limitLeft ? Math.abs(value - KonvaPlanHandler.limitLeft) : 0;
      case Direction.ToRight:
        return value > KonvaPlanHandler.limitRight ? Math.abs(value - KonvaPlanHandler.limitRight) : 0;
      case Direction.ToTop:
        return value < KonvaPlanHandler.limitTop ? Math.abs(value - KonvaPlanHandler.limitTop) : 0;
      case Direction.ToBottom:
        return value > KonvaPlanHandler.limitBottom ? Math.abs(value - KonvaPlanHandler.limitBottom) : 0;
    }
  }
  static blocOverflow = (bloc:MaterialData, direction:Direction): number => {
    const blocEnd = bloc.getEnd(direction);
    return KonvaPlanHandler.valueOverflow(blocEnd, direction);
    }
}
