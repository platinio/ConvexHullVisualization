import { Injectable , Optional} from '@angular/core';
import { Graphics , Container , Sprite } from 'pixi.js';
import { TweenService } from './services/tween.service';

declare var createjs: any;

@Injectable()
export class Point
{

    private sprite : Sprite;
    private readonly desireScale : Vector2 = new Vector2(0.5 , 0.5);
    private readonly scaleTime : number = 600;
    private readonly spritePath : string = "../../assets/point.png";

    constructor(private tweenService : TweenService ,
                private container : Container ,
                public position : Vector2)
    {

        this.sprite = Sprite.from(this.spritePath);
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        this.sprite.scale.x = 0;
        this.sprite.scale.y = 0;
        this.container.addChild(this.sprite);
        tweenService.scaleTween(this.sprite.scale , this.desireScale , this.scaleTime);
    }
}

export class Vector2
{
    constructor(public x : number , public y : number)
    {

    }

    public dirTo(to : Vector2)
    {
        //get the direction
        var dir = new Vector2( this.x - to.x , this.y - to.y );
        var m = dir.magnitude; //calculate the magnitude

        return new Vector2( dir.x / m , dir.y / m ); //normalize the vector
    }

    get magnitude() : number
    {
        return Math.sqrt( Math.pow( this.x , 2 ) + Math.pow( this.y , 2 ) );
    }

}
