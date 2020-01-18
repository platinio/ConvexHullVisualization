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

    public clear()
    {
        this.tweenService.scaleTween(this.sprite.scale , new Vector2(0 , 0) , this.scaleTime).call( () => { this.sprite.destroy(); } );

    }
}

export class Vector2
{
    get magnitude() : number
    {
        return Math.sqrt( Math.pow( this.x , 2 ) + Math.pow( this.y , 2 ) );
    }

    get perpendicular() : Vector2
    {
        return new Vector2( this.y , this.x * -1 )
    }

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

    public angleTo(to : Vector2)
    {
        var v = ( this.getcrossProduct(to) / ( this.magnitude * to.magnitude ) );
        return Math.asin(v) * (180 / Math.PI);
    }

    public getcrossProduct( v : Vector2 ) : number
    {
        return (v.y * this.x) - ( this.y * v.x );
    }

}
