import { Point , Vector2 } from '../point.model';
import { Line } from '../line.model';
import { GraphService } from './graph.service';
import { Container , Graphics } from 'pixi.js';
import { ConvexHull } from './convex-hull';

export class QuickHullService extends ConvexHull
{
    private selectedPoints : Point[] = null;
    private selectedLines : [] = [];
    private convexHull : Line[] = [];
    private convexHullStack : any = [];
    public firstTime : boolean = true;

    constructor(pointList : Point[] , private container : Container , speed : number)
    {
        super();
        this.speed = speed;
        this.graph = new GraphService(this.container);
        this.pointList = pointList.slice();
        var points = this.pickStartingLine();

        this.markPointAsSelected( points[0] );
        this.markPointAsSelected( points[1] );

        var line = new Line( points[0].position , points[1].position );


        var above = this.getPointsAboveLine( line , this.pointList );
        var below = this.getPointsBelowLine( line , this.pointList );

        this.convexHull.push( line );


        this.convexHullStack.push( [ line , above , -1 ] );
        this.convexHullStack.push( [ line , below , 1 ] );

        this.nextStep(  );

    }



    public clearAllLines()
    {

    }

    private findNextLine(line : Line , points : Point[] , side : number)
    {

        var result = this.graph.drawLine( line.p1 , line.p2 , 5 ,  0xff3333 , this.speed  );
        result[0].call( () => {

            //var r = (vertical * horizontal * (this.convexHull.length < 5 ? 1.0 : -1.0) > 0 ? this.getPointsAboveLine( line , points ) : this.getPointsBelowLine( line , points ));
            //var maxDistancePoint = this.getMaxDistancePointArray( line.p1 , line.p2 , r );
            var maxDistancePoint = null;
            var maxDistance = -1;
            for(let n = 0 ; n < points.length ; n++)
            {
                var d : number = this.distanceToLine( line , points[n].position );

                if( this.findSide( line , points[n].position ) == side && d > maxDistance)
                {
                    maxDistancePoint = points[n];
                    maxDistance = d;
                }
            }

            if(maxDistancePoint == null)
            {
              
                this.nextStep(  );
                return;
            }

            this.markPointAsSelectedArray( maxDistancePoint , points );

            var leftLine = new Line(maxDistancePoint.position , line.p1   );
            var rightLine = new Line(maxDistancePoint.position , line.p2  );


            this.firstTime = false;


            this.convexHull.push( leftLine );
            this.convexHull.push( rightLine );

            //this.removePointsInsideConvexHullArray(points);

            this.convexHullStack.push( [ leftLine , points , -this.findSide( new Line( maxDistancePoint.position , line.p1 ) , line.p2  ) ] );
            this.convexHullStack.push( [ rightLine , points , -this.findSide( new Line( maxDistancePoint.position , line.p2 ) , line.p1  ) ] );

            this.graph.drawLine( leftLine.p1 , leftLine.p2 , 5 , 0xf5dea3 , this.speed  );
            this.graph.drawLine( rightLine.p1 , rightLine.p2 , 5 , 0xf5dea3 , this.speed  )[0].call( () => {
              if(points.length > 0)
              {

                //result[1].clear();
                //this.findNextLine( leftLine , points.slice() );
                //this.findNextLine( rightLine , points.slice() );
                this.nextStep(  );
                //alert(this.convexHull.length);
              }
            } );





        } );

    }

    private distanceToLine(line : Line , point : Vector2) : number
    {
        return Math.abs(  ( point.y - line.p1.y ) * ( line.p2.x - line.p1.x ) -
                          ( line.p2.y - line.p1.y ) * (  point.x - line.p1.x ) );
    }

    private findSide(line : Line , point : Vector2) : number
    {
        var val : number =  ( point.y - line.p1.y ) * ( line.p2.x - line.p1.x ) -
                        ( line.p2.y - line.p1.y ) * (  point.x - line.p1.x );
        if(val > 0)
          return 1;
        if(val < 0)
          return -1;

        return 0;
    }

    private nextStep()
    {

        if(this.convexHullStack.length > 0)
        {
            var info = this.convexHullStack[0];
            this.convexHullStack.splice(0 , 1);
            this.findNextLine(info[0] , info[1] , info[2] );
        }
    }

    private getPointsAboveLine(line : Line , points : Point[]) : Point[]
    {
        var result = [];

        for(let n = 0 ; n < points.length ; n++)
        {
            var p = points[n].position;
            var v1 = new Vector2( line.p2.x - line.p1.x , line.p2.y - line.p1.y );
            var v2 = new Vector2( line.p2.x - p.x, line.p2.y - p.y );

            var c = v1.x * v2.y - v1.y * v2.x;

            if(c > 0)
            {
                result.push( points[n] );
            }
        }

        return result;
    }

    private pointIsAtRight(line : Line , p : Vector2 ) : boolean
    {
        var v1 = new Vector2( line.p2.x - line.p1.x , line.p2.y - line.p1.y );
        var v2 = new Vector2( line.p2.x - p.x, line.p2.y - p.y );

        var c = v1.x * v2.y - v1.y * v2.x;

        return c > 0;
    }

    private getPointsBelowLine(line : Line , points : Point[]) : Point[]
    {
        var result = [];

        for(let n = 0 ; n < points.length ; n++)
        {
            var p = points[n].position;
            var v1 = new Vector2( line.p2.x - line.p1.x , line.p2.y - line.p1.y );
            var v2 = new Vector2( line.p2.x - p.x, line.p2.y - p.y );

            var c = v1.x * v2.y - v1.y * v2.x;

            if(c < 0 || c == 0)
            {
                result.push( points[n] );
            }
        }

        return result;
    }

    private getPointsAbove(y : number) : Point[]
    {
        var result = [];

        for(let n = 0 ; n < this.pointList.length ; n++)
        {
            if(this.pointList[n].position.y > y)
            {
                result.push( this.pointList[n] );
            }
        }

        return result;
    }

    private getPointsBehind(y : number) : Point[]
    {
        var result = [];

        for(let n = 0 ; n < this.pointList.length ; n++)
        {
            if(this.pointList[n].position.y <= y)
            {
                result.push( this.pointList[n] );
            }
        }

        return result;
    }

    private removePointsInsideConvexHull()
    {

        for(let n = 0 ; n < this.pointList.length ; n++)
        {
            if( Line.isInside( this.convexHull , this.pointList[n].position ) )
            {

                //-this.pointList[n].clear();
                this.removeValueFromArray( this.pointList , this.pointList[n] );
                n--;
            }
        }
    }

    private removePointsInsideConvexHullArray(points : Point[])
    {

        for(let n = 0 ; n < points.length ; n++)
        {
            if( Line.isInside( this.convexHull , points[n].position ) )
            {

                if(points[n] != null)
                  points[n].clear();
                this.removeValueFromArray( points , points[n] );
                n--;
            }
        }
    }

    private getLastSelectedPoints() : Vector2[]
    {
        //return [this.selectedPoints[ this.selectedPoints.length - 1 ] , this.selectedPoints[ this.selectedPoints.length - 2 ]];
        return [this.selectedPoints[ 0 ].position , this.selectedPoints[ 1 ].position];
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

    private markPointAsSelectedArray(point : Point , pointList : Point[])
    {
        if(this.selectedPoints == null)
        {
            this.selectedPoints = [];
        }

        this.selectedPoints.push( point );
        this.removeValueFromArray( pointList , point );
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

    private getMaxDistancePointArray(a : Vector2 , b : Vector2 , points : Point[] ) : Point
    {
        if(points.length == 0)
          return null;

        var closerPoint = points[0];
        var maxDistance = -99999;

        for(let n = 0 ; n < points.length ; n++)
        {
            var distance = points[n].position.getDistance( a ) + points[n].position.getDistance( b );
            if( distance > maxDistance  )
            {
                closerPoint = points[n];
                maxDistance = distance;
            }
        }

        return closerPoint;
    }

    private lineDotProduct(line : Line , point : Vector2)
    {

    }



}
