import { Graphics , Container , Sprite } from 'pixi.js';

declare var createjs: any;

export class Point
{
    //private graphic : Graphics;
    private sprite : Sprite;
    private scale : number = 0.5;
    private scaleTime : number = 600;

    constructor(private container : Container ,  private x : number , private y : number)
    {
        /*
        this.graphic = new Graphics();
        this.graphic.beginFill(0xFFFF00);
        this.graphic.drawEllipse(0, 0, 10 , 10);
        this.graphic.endFill();
        this.graphic.x = x;
        this.graphic.y = y;
        this.container.addChild(this.graphic);

        createjs.Tween.get(this.graphic.scale)
        .to({ x: this.size , y : this.size }, this.scaleTime, createjs.Ease.elasticOut);*/

        this.sprite = Sprite.from("../../assets/point.png");
        this.sprite.anchor.set(0.5);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.scale.x = 0;
        this.sprite.scale.y = 0;
        this.container.addChild(this.sprite);
        createjs.Tween.get(this.sprite.scale)
        .to({ x: this.scale , y : this.scale }, this.scaleTime, createjs.Ease.elasticOut);

    }
}
