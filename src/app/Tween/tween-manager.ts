import { ValueTween } from './value-tween';
import { Tween } from './tween';

export abstract class TweenManager
{
    static tweenArray : Tween[];

    public static valueTween(from : number , to : number , duration : number )  : Tween
    {
        var tween : ValueTween = new ValueTween(from , to , duration);
        this.tweenArray.push(tween);
        return tween;
    }

    public static update(delta : number)
    {

    }


}
