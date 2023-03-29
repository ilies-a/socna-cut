export const totalOfKeys = (obj: any): number => {
    return Object.keys(obj).length;
}

export const pointInsideRect = (p:Point, r:Rect): boolean => {
    return (p.x > r.x && p.x < r.x + r.w && p.y > r.y && p.y < r.y + r.h)
}


export const rectOverlapsRect = (a:Rect, b:Rect): boolean => {
    return (a.x + a.w >= b.x && 
    a.x <= b.x + b.w &&
    a.y + a.h >= b.y &&
    a.y <= b.y + b.h)
}

export const rectContainsRect = (a:Rect, b:Rect): boolean => {
    return (a.x <= b.x && a.y <= b.y && a.xEnd >= b.xEnd && a.yEnd >= b.yEnd)
}

export class Point{
    x: number;
    y: number;

    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
    }
}

export class Rect{
    w: number;
    h: number;
    x: number;
    y: number;
    xEnd:number;
    yEnd:number;

    constructor(w:number, h:number, x:number, y:number){
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.xEnd = x + w;
        this.yEnd = y + h;
    }

}