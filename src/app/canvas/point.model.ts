import { Injectable , Optional} from '@angular/core';
import { Graphics , Container , Sprite } from 'pixi.js';
import { TweenService } from './services/tween.service';

declare var createjs: any;

@Injectable()
export class Point
{
    //private graphic : Graphics;
    private sprite : Sprite;
    private scale : number = 0.5;
    private scaleTime : number = 600;
    private readonly spritePath : string = "../../assets/point.png";

    constructor(private tweenService : TweenService ,
                private container : Container ,
                private x : number ,
                private y : number)
    {
        this.sprite = Sprite.from(this.spritePath);
        this.sprite.anchor.set(0.5);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.scale.x = 0;
        this.sprite.scale.y = 0;
        this.container.addChild(this.sprite);
        tweenService.scaleTween(this.sprite.scale , this.scale , this.scale , this.scaleTime);
    }







}
