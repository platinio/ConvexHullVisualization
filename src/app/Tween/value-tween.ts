import { Tween } from './tween';

export class ValueTween extends Tween
{
    public from : number;
    public to : number;

    constructor(from : number , to : number , duration : number)
    {
        super();

        this.from = from;
        this.to = to;
        this.duration = duration;
    }

    update( delta : number )
    {
        super.update(delta);

    }

}
