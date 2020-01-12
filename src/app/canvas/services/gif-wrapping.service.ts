import { Point , Vector2 } from '../point.model';
import { GraphService } from './graph.service';
import { Container } from 'pixi.js';

export class GiftWrappingService
{

    private graph : GraphService;
    private selectedPoints : Point[];
    private tempPointList : Point[];
    private currentMinAnglePoint : Point = null;
    private currentMinAngle : number = 0;

    constructor(private pointList : Point[] , private container : Container)
    {
        //pick a starting point for the gift wrapping
        this.pickStartingPoint();
        //initialize and start the gift wrapping
        this.initializeGiftWrapping();
    }

    private pickStartingPoint()
    {
        //find a starting point
        var leftPoint = this.getLeftPoint();
        this.markPointAsSelected( leftPoint );
    }

    private getLeftPoint() : Point
    {
        var result = this.pointList[0];

        for(let n = 1 ; n < this.pointList.length ; n++)
        {
            if(this.pointList[n].position.x < result.position.x)
            {
                result = this.pointList[n];
            }
        }

        return result;
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

    private initializeGiftWrapping()
    {
        this.graph = new GraphService(this.container);

        this.resetValuesForReuse();
        this.findNextPoint();
    }

    private findNextPoint()
    {
        var lastSelectedPoint = this.getLastSelectedPoint();
        var randomSelectedPoint = this.pickRandomElementFromArray(this.tempPointList);

        this.removeValueFromArray(this.tempPointList , randomSelectedPoint);

        this.graph.drawLine( lastSelectedPoint.position , randomSelectedPoint.position , 5 , 0xf5dea3 ).call( () =>
        {
            this.checkPointAngle( lastSelectedPoint , randomSelectedPoint );

            this.graph.clearLastGraphic();

            if( this.haveMorePointsToCheck() )
            {
                this.findNextPoint();
            }
            else
            {
                this.processPointSelected(lastSelectedPoint);
            }

        } );
    }

    private processPointSelected( selectedPoint : Point )
    {
        this.graph.drawLine( selectedPoint.position , this.currentMinAnglePoint.position , 5 , 0xf5dea3 ).call( () => {

          //if convex hull is no complete keep going
          if( !this.convexHullIsComplete() )
          {
              this.findNextPoint();
          }

        } );

        this.insertStartingPointInAvaliblePointsIfNecesary();
        this.markPointAsSelected( this.currentMinAnglePoint );
        this.resetValuesForReuse();
    }

    private insertStartingPointInAvaliblePointsIfNecesary()
    {
        //insert starting point in the avalible points after use it
        if(this.selectedPoints.length == 1)
        {
            this.pointList.push( this.selectedPoints[0] );
        }
    }

    private resetValuesForReuse()
    {
        this.currentMinAnglePoint = null;
        this.tempPointList = this.pointList.slice();
    }

    private convexHullIsComplete() : boolean
    {
        return this.selectedPoints[ this.selectedPoints.length - 1 ] == this.selectedPoints[ 0 ];
    }

    private haveMorePointsToCheck() : boolean
    {
        return this.tempPointList.length > 0
    }

    private checkPointAngle( lastSelectedPoint : Point , randomSelectedPoint : Point )
    {
        var angle = this.calculateLocalAngle( lastSelectedPoint , randomSelectedPoint );

        if( this.shouldReplaceCurrentMinAngle(angle) )
        {
            this.currentMinAnglePoint = randomSelectedPoint;
            this.currentMinAngle = angle;
        }
    }

    private calculateLocalAngle(from : Point , to : Point) : number
    {
        var dir = this.getDirection( from.position , to.position );
        var axis = this.calculateAxisAngle();
        return this.calculateAngle( dir , axis );
    }

    private calculateAxisAngle() : Vector2
    {
        var axis = new Vector2(1 , 0);

        if(this.selectedPoints.length > 1)
        {
            axis = this.getDirection( this.selectedPoints[ this.selectedPoints.length - 2 ].position , this.selectedPoints[ this.selectedPoints.length - 1 ].position );
            axis = new Vector2( axis.y , axis.x * -1 );
        }

        return axis;
    }

    private shouldReplaceCurrentMinAngle(angle : number)
    {
        return angle < this.currentMinAngle || this.currentMinAnglePoint == null;
    }

    private pickRandomElementFromArray(array : any) : any
    {
        return array[ this.pickRandomIndex(array) ];
    }

    private getLastSelectedPoint()  : Point
    {
        return this.selectedPoints[ this.selectedPoints.length - 1 ];
    }

    private pickRandomIndex(array : any) : number
    {
        return this.getRandomInt(0 , array.length);
    }

    private getRandomInt(min, max) : number
    {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    private removeElementFromIndex(array : any , index : number) : any
    {
        return array.splice(index , 1);
    }

    private calculateCrossProduct( p1 : Vector2 , p2 : Vector2 )
    {
        return (p2.y * p1.x) - ( p1.y * p2.x );
    }

    private calculateMagnitude(v : Vector2) : number
    {
        return Math.sqrt( Math.pow( v.x , 2 ) + Math.pow( v.y , 2 ) );
    }

    private calculateAngle(from : Vector2 , to : Vector2) : number
    {
        var v = ( this.calculateCrossProduct( from , to ) / (this.calculateMagnitude(from) * this.calculateMagnitude(to)) );
        return Math.asin(v) * (180 / Math.PI);
    }

    private getDirection(from : Vector2 , to : Vector2) : Vector2
    {
        var dir = new Vector2( from.x - to.x , from.y - to.y );
        var m = Math.sqrt( Math.pow( dir.x , 2 ) + Math.pow( dir.y , 2 ) );

        return new Vector2( dir.x / m , dir.y / m );
    }

}
