import { Point , Vector2 } from '../point.model';
import { GraphService } from './graph.service';
import { Container } from 'pixi.js';

export class GiftWrappingService
{

    private graph : GraphService;

    constructor(private pointList : Point[] , private container : Container)
    {
        var startingPointIndex = this.getStartingPointIndex();
        var startingPoint = this.pointList[ startingPointIndex ];
        this.removePointFromIndex( startingPointIndex );

        this.graph = new GraphService(this.container);
        findNextPoint();
        /*
        this.graph.drawLine( startingPoint.position , this.pickRandomPoint().position , 5 , 0xf5dea3 ).call( () =>
        {

        } );*/
    }

    private findNextPoint()
    {

    }

    private getStartingPointIndex() : number
    {
        var result = this.pointList[0].position;
        var index = 0;

        for(let n = 1 ; n < this.pointList.length ; n++)
        {
            if(this.pointList[n].position.x < result.x)
            {
                result = this.pointList[n].position;
                index = n;
            }
        }

        return index;
    }

    private pickRandomPoint() : Point
    {
        return this.pointList[ this.getRandomInt(0 , this.pointList.length) ];
    }

    private getRandomInt(min, max) : number
    {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    private removePointFromIndex(index : number)
    {
        return this.pointList.splice(index , 1);
    }

    private calculateCrossProduct( p1 : Point , p2 : Point )
    {
        return (p2.position.y * p1.position.x) - ( p1.position.y * p2.position.x );
    }

}
