import { Graphics , Container , Sprite } from 'pixi.js';
import { Vector2 } from '../point.model';

declare var createjs: any;

export class GraphService
{

    private stage: any;
    private pos : Vector2;
    private line : Graphics;
    private fromSave : Vector2;
    constructor(private container : Container)
    {

    }

    public drawLine(from : Vector2 , to : Vector2 )
    {
        this.fromSave = from;
        this.line = new Graphics();
        this.line.x = 0;
        this.line.y = 0;
        this.line.lineStyle(5, 0xff0000);
        this.line.moveTo(from.x , from.y);
        this.pos = new Vector2( from.x , from.y );

        createjs.Tween.get(this.pos).to({ x: to.x , y : to.y }, 1000 ).addEventListener("change", () => this.onChange() );

        this.stage = new createjs.Stage("tweens");
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", this.stage);

    }

    private onChange()
    {
        this.line.moveTo(this.fromSave.x , this.fromSave.y);
        this.line.lineTo(this.pos.x , this.pos.y);
        this.container.addChild(this.line);
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
