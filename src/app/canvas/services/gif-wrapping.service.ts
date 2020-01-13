import { Point , Vector2 } from '../point.model';
import { GraphService } from './graph.service';
import { Container } from 'pixi.js';

export class GiftWrappingService
{

    private graph : GraphService; //helper for drawing
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
        //pick the most left point at the starting point
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

    //reset valus for reuse in the findNextPoint
    private resetValuesForReuse()
    {
        this.currentMinAnglePoint = null;
        this.tempPointList = this.pointList.slice();
    }

    private findNextPoint()
    {
        var lastSelectedPoint = this.getLastSelectedPoint();
        var randomSelectedPoint = this.pickRandomElementFromArray(this.tempPointList);

        //remove the selected point from the temp array
        this.removeValueFromArray(this.tempPointList , randomSelectedPoint);

        //draw a line to the random selected point
        this.graph.drawLine( lastSelectedPoint.position , randomSelectedPoint.position , 5 , 0xf5dea3 ).call( () =>
        {
            //check if we should override the current selected point base on the local angle
            this.checkPointAngle( lastSelectedPoint , randomSelectedPoint );

            //clear the last draw line
            this.graph.clearLastGraphic();

            //still have more temp points to check?
            if( this.haveMorePointsToCheck() )
            {
                this.findNextPoint();
            }
            else
            {
                //we found the most left local point process it
                this.processPointSelected(lastSelectedPoint);
            }

        } );
    }

    private getLastSelectedPoint()  : Point
    {
        return this.selectedPoints[ this.selectedPoints.length - 1 ];
    }

    private pickRandomElementFromArray(array : any) : any
    {
        return array[ this.pickRandomIndex(array) ];
    }

    private pickRandomIndex(array : any) : number
    {
        return this.getRandomInt(0 , array.length);
    }

    private getRandomInt(min, max) : number
    {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    private checkPointAngle( lastSelectedPoint : Point , randomSelectedPoint : Point )
    {
        //calculate the angle base on the local point
        var angle = this.calculateLocalAngle( lastSelectedPoint , randomSelectedPoint );

        //should we replace our current selected point?
        if( this.shouldReplaceCurrentMinAngle(angle) )
        {
            this.currentMinAnglePoint = randomSelectedPoint;
            this.currentMinAngle = angle;
        }
    }

    //calculate the local point angle
    private calculateLocalAngle(from : Point , to : Point) : number
    {
        //var dir = this.getDirection( from.position , to.position );
        var dir = from.position.dirTo( to.position );
        var axis = this.calculateAxisAngle(); //get the local axis
        return this.calculateAngle( dir , axis ); //calculate the angle base on the local axis
    }

    //get the local point position axis
    private calculateAxisAngle() : Vector2
    {
        var axis = new Vector2(1 , 0);

        if(this.selectedPoints.length > 1)
        {
            //axis = this.getDirection( this.selectedPoints[ this.selectedPoints.length - 2 ].position , this.selectedPoints[ this.selectedPoints.length - 1 ].position );
            var from = this.selectedPoints[ this.selectedPoints.length - 2 ].position;
            var to = this.selectedPoints[ this.selectedPoints.length - 1 ].position;
            axis = from.dirTo( to );
            axis = new Vector2( axis.y , axis.x * -1 );
        }

        return axis;
    }

    /*
    private getDirection(from : Vector2 , to : Vector2) : Vector2
    {
        //get the direction
        var dir = new Vector2( from.x - to.x , from.y - to.y );
        var m = this.getVectorMagnitude(dir); //calculate the magnitude

        return new Vector2( dir.x / m , dir.y / m ); //normalize the vector
    }

    private getVectorMagnitude(v : Vector2)
    {
        return Math.sqrt( Math.pow( v.x , 2 ) + Math.pow( v.y , 2 ) );
    }*/

    private calculateAngle(from : Vector2 , to : Vector2) : number
    {
        //var v = ( this.calculateCrossProduct( from , to ) / (this.getVectorMagnitude(from) * this.getVectorMagnitude(to)) );
        var v = ( this.calculateCrossProduct( from , to ) / ( from.magnitude * to.magnitude ) );
        return Math.asin(v) * (180 / Math.PI);
    }


    private calculateCrossProduct( p1 : Vector2 , p2 : Vector2 )
    {
        return (p2.y * p1.x) - ( p1.y * p2.x );
    }


    private haveMorePointsToCheck() : boolean
    {
        return this.tempPointList.length > 0
    }

    private shouldReplaceCurrentMinAngle(angle : number)
    {
        return angle < this.currentMinAngle || this.currentMinAnglePoint == null;
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

    //is the conex hull complete?
    private convexHullIsComplete() : boolean
    {
        //the convex hull is complete if and just is the last point is the same as the starting point
        return this.selectedPoints[ this.selectedPoints.length - 1 ] == this.selectedPoints[ 0 ];
    }

    private insertStartingPointInAvaliblePointsIfNecesary()
    {
        //insert starting point in the avalible points after use it
        if(this.selectedPoints.length == 1)
        {
            this.pointList.push( this.selectedPoints[0] );
        }
    }


}
