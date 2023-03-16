
export const canvasElements: CanvasElement[] = [
    // new CanvasElement("1", [[50, 50], [200, 50], [200, 100], [50, 100], [50, 50]], "blue"),
    // new CanvasElement("2", [[0, 150], [300, 150], [300, 200], [0, 200], [0, 150]], "green"),
  ];

export class Handle{
  num: number;
  position: [number, number];
  constructor(num:number, position:[number, number]){
    this.num = num;
    this.position = position;
  }
}

export class CanvasElement {
  id:string;
  type:string;
  path:[number, number][];
  fillColor:string;
  isSelected:boolean = false;
  handle:Handle | undefined; //8 possibilities, 0 is none

  constructor(id:string, type:string, path:[number, number][], fillColor:string){
    this.id = id;
    this.type = type;
    this.path = path;
    this.fillColor = fillColor;
  }

  getX(): number{
    return this.path[0][0]
  }

  getY(): number{
    return this.path[0][1]
  }


  getWidth(): number{
    return this.path[1][0]
  }

  getHeight(){
    return this.path[2][1]
  }
}
