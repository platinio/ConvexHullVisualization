import { Point , Vector2 } from '../point.model';
import { GraphService } from './graph.service';
import { Container , Graphics } from 'pixi.js';

export class GiftWrappingService
{

    private graph : GraphService; //helper for drawing
    private selectedPoints : Point[];
    private tempPointList : Point[];
    private currentMinAnglePoint : Point = null;
    private currentMinAngle : number = 0;
    private currentMinAngleLine : Graphics = null;
    private activeLines : Graphics[] = [];

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
        var result = this.graph.drawLine( lastSelectedPoint.position , randomSelectedPoint.position , 5 , 0xf5dea3 );
        result[0].call( () =>
        {
            //check if we should override the current selected point base on the local angle
            this.checkPointAngle( lastSelectedPoint , randomSelectedPoint );

            //clear the last draw line
            //this.graph.clearLastGraphic();
            result[1].clear();

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

            if(this.currentMinAngleLine != null)
            {
                this.currentMinAngleLine.clear();
            }

            this.currentMinAngleLine = this.graph.drawLine( lastSelectedPoint.position , randomSelectedPoint.position , 5 , 0xe89da2 )[1];

        }
    }

    //calculate the local point angle
    private calculateLocalAngle(from : Point , to : Point) : number
    {
        //var dir = this.getDirection( from.position , to.position );
        var dir = from.position.dirTo( to.position );
        var axis = this.calculateAxisAngle(); //get the local axis
        return dir.angleTo(axis);
    }

    //get the local point position axis
    private calculateAxisAngle() : Vector2
    {
        var axis = new Vector2(1 , 0);

        if(this.selectedPoints.length > 1)
        {
            var from = this.selectedPoints[ this.selectedPoints.length - 2 ].position;
            var to = this.selectedPoints[ this.selectedPoints.length - 1 ].position;
            axis = from.dirTo( to );
            axis = axis.perpendicular;
        }

        return axis;
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
        var result = this.graph.drawLine( selectedPoint.position , this.currentMinAnglePoint.position , 5 , 0xf5dea3 );
        result[0].call( () => {

          this.activeLines.push( result[1] );
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
