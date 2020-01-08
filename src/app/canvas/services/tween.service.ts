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

    public scaleTween(target : any , x : number , y : number , time : number)
    {
        createjs.Tween.get(target).to({ x: x , y : y }, time , createjs.Ease.elasticOut);
    }
}
