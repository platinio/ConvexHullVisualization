export class Sprite
{
    public x : number;
    public y : number;
    public z : number;

    constructor(private renderContext : CanvasRenderingContext2D) {}

    render()
    {
        this.renderContext.fillRect(0 , 0 , 50 , 50);
    }

}
