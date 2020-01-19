import { Graphics , Container , Sprite } from 'pixi.js';
import { Vector2 } from '../point.model';

declare var createjs: any;

export class GraphService
{

    private stage: any;
    private graphicList : Graphics[] = [];


    constructor(private container : Container)
    {

    }

    public drawLine(from : Vector2 , to : Vector2  , size : number , color : any , t : number ) : any
    {

        var line = new Graphics();
        this.graphicList.push( line );
        line.x = 0;
        line.y = 0;
        line.lineStyle(size, color);
        line.moveTo(from.x , from.y);
        var desirePos = new Vector2( from.x , from.y );

        var tween = createjs.Tween.get(desirePos).to({ x: to.x , y : to.y }, t * 1000 );

        tween.addEventListener("change", () => {
          line.moveTo(from.x , from.y);
          line.lineTo(desirePos.x , desirePos.y);
          this.container.addChild(line);
        } );



        this.stage = new createjs.Stage("tweens");
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", this.stage);

        this.graphicList.push(line);

        //return {tween: tween , line: line };
        return [tween , line];
    }

    public clearLastGraphic()
    {
        var g = this.graphicList.pop();

        //this.container.removeChild( g );
        g.clear();
    }

    public getLastGraphic() : Graphics
    {
        return this.graphicList.pop();
    }

    private calculatePointArray(from : Vector2 , to : Vector2) : any
    {
        var points = [];
        var dir = this.getDirection( from , to );
        dir.x = dir.x * -1;
        dir.y = dir.y *-1;

        var d = this.getDistance(from , to);
        var step = d / 100;
        var vectorStep = new Vector2( dir.x * step , dir.y * step );

        for (let i = 0; i < 2; i++)
        {
            if(i == 0)
            {
                points.push( from );
            }
            else
            {
                //points.push( new Vector2( points[i - 1].x + vectorStep.x ,  points[i - 1].y + vectorStep.y  ) );
                points.push( to );
            }

        }

        return points;
    }

    private getDirection(from : Vector2 , to : Vector2) : Vector2
    {
        var dir = new Vector2( from.x - to.x , from.y - to.y );
        var m = Math.sqrt( Math.pow( dir.x , 2 ) + Math.pow( dir.y , 2 ) );

        return new Vector2( dir.x / m , dir.y / m );
    }

    private getDistance(from : Vector2 , to : Vector2)
    {
        return Math.sqrt( Math.pow( to.x - from.x , 2 ) + Math.pow( to.y - from.y , 2 ) );
    }




}
