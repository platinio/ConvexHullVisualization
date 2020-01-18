import { Vector2 } from '../point.model';

declare var createjs: any;

export class TweenService
{
    private stage: any;

    constructor()
    {
        this.stage = new createjs.Stage("tweens");
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", this.stage);
    }

    public scaleTween(target: any , to : Vector2 , time : number)  : any
    {
        return createjs.Tween.get(target).to({ x: to.x , y : to.y }, time , createjs.Ease.elasticOut);
    }
}
