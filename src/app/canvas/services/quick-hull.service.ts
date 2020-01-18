import { Point , Vector2 } from '../point.model';
import { GraphService } from './graph.service';
import { Container , Graphics } from 'pixi.js';
import { ConvexHull } from './convex-hull';

export class QuickHullService extends ConvexHull
{
    private selectedPoints : Point[] = null;

    constructor(pointList : Point[] , private container : Container , speed : number)
    {
        super();
        this.speed = speed;
        this.graph = new GraphService(this.container);
        this.pointList = pointList.slice();
        var points = this.pickStartingLine();

        this.markPointAsSelected( points[0] );
        this.markPointAsSelected( points[1] );
        this.findNextLine();
    }

    public clearAllLines()
    {

    }

    private findNextLine()
    {
        var lastSelectedPoints = this.getLastSelectedPoints();

        var result = this.graph.drawLine( lastSelectedPoints[0].position , lastSelectedPoints[1].position , 5 , 0xf5dea3 , this.speed  );
        result[0].call( () =>
        {
            var midPoint = this.calculateMidPoint( lastSelectedPoints[0].position , lastSelectedPoints[1].position );
            var maxDistancePoint = this.getMaxDistancePoint( midPoint );

            this.graph.drawLine( lastSelectedPoints[0].position , maxDistancePoint.position , 5 , 0xf5dea3 , this.speed  );
            this.graph.drawLine( lastSelectedPoints[1].position , maxDistancePoint.position , 5 , 0xf5dea3 , this.speed  );

        } );
    }

    private getLastSelectedPoints() : Point[]
    {
        return [this.selectedPoints[ this.selectedPoints.length - 1 ] , this.selectedPoints[ this.selectedPoints.length - 2 ]];
    }

    private pickStartingLine() : Point[]
    {
        var leftPoint = null;
        var rightPoint = null;

        for(let n = 0 ; n < this.pointList.length ; n++)
        {
            if( leftPoint == null || this.pointList[n].position.x < leftPoint.position.x  )
            {
                leftPoint = this.pointList[n];
            }

            if( rightPoint == null || this.pointList[n].position.x > rightPoint.position.x )
            {
                rightPoint = this.pointList[n];
            }
        }

        return [ leftPoint , rightPoint ];
    }

    private markPointAsSelected(point : Point)
    {
        if(this.selectedPoints == null)
        {
            this.selectedPoints = [];
        }

        this.selectedPoints.push( point );
        this.removeValueFromArray( this.pointList , point );
    }

    private removeValueFromArray(array : any , value : any)
    {
        for(let n = 0 ; n < array.length ; n++)
        {
            if(array[n] == value)
            {
                array.splice(n , 1);
                return;
            }
        }
    }

    private calculateMidPoint(a : Vector2 , b : Vector2) : Vector2
    {
        return new Vector2( (a.x + b.x) / 2 , ( a.y + b.y ) / 2 );
    }

    private getMaxDistancePoint(p : Vector2 ) : Point
    {
        var closerPoint = null;
        var maxDistance = -99999;

        for(let n = 0 ; n < this.pointList.length ; n++)
        {
            var distance = this.pointList[n].position.getDistance( p );
            if( distance > maxDistance )
            {
                closerPoint = this.pointList[n];
                maxDistance = distance;
            }
        }

        return closerPoint;
    }

}
