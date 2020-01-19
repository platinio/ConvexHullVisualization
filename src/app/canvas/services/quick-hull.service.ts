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
    private sideForProcess : Line[] = [];

    constructor(pointList : Point[] , private container : Container , speed : number)
    {
        super();
        this.speed = speed;
        this.graph = new GraphService(this.container);
        this.pointList = pointList.slice();
        var points = this.pickStartingLine();

        this.markPointAsSelected( points[0] );
        this.markPointAsSelected( points[1] );

        var lowerPoint = points[0].position.y < points[1].position.y ? points[0] : points[1];



        var upperPart = this.getPointsAboveLine( new Line( points[0].position , points[1].position ) );
        var lowerPart = this.getPointsBehindLine( new Line( points[0].position , points[1].position ) );

        this.convexHull.push( new Line( points[0].position , points[1].position ) );
        this.findNextLine( new Line( points[0].position , points[1].position )  , upperPart );
        this.findNextLine( new Line( points[0].position , points[1].position )  , lowerPart );

        //this.sideForProcess.push( new Line( points[0].position , points[1].position ) );

    }

    public clearAllLines()
    {

    }

    private findNextLine(line : Line , points : Point[])
    {
      /*
        var lastSelectedPoints = this.getLastSelectedPoints();

        var result = this.graph.drawLine( lastSelectedPoints[0].position , lastSelectedPoints[1].position , 5 , 0xf5dea3 , this.speed  );
        result[0].call( () =>
        {


            var midPoint = this.calculateMidPoint( lastSelectedPoints[0].position , lastSelectedPoints[1].position );
            var maxDistancePoint = this.getMaxDistancePoint( midPoint );

            //alert(maxDistancePoint.position.y);

            this.markPointAsSelected( maxDistancePoint );

            var leftLine = new Line( lastSelectedPoints[0].position , maxDistancePoint.position );
            var rightLine = new Line( lastSelectedPoints[1].position , maxDistancePoint.position );

            this.convexHull.push( leftLine );
            this.convexHull.push( rightLine );

            this.graph.drawLine( lastSelectedPoints[0].position , maxDistancePoint.position , 5 , 0xf5dea3 , this.speed  );
            this.graph.drawLine( lastSelectedPoints[1].position , maxDistancePoint.position , 5 , 0xf5dea3 , this.speed  )[0].call( () => {
              this.removePointsInsideConvexHull();
              this.findNextLine();
            } );


        } );*/

        var result = this.graph.drawLine( line.p1 , line.p2 , 5 , 0xf5dea3 , this.speed  );
        result[0].call( () => {

            var midPoint = this.calculateMidPoint( line.p1 , line.p2 );
            var maxDistancePoint = this.getMaxDistancePointArray( midPoint , points );

            this.markPointAsSelectedArray( maxDistancePoint , points );

            var leftLine = new Line( line.p1  , maxDistancePoint.position );
            var rightLine = new Line( line.p2 , maxDistancePoint.position );

            this.sideForProcess.push( leftLine );
            this.sideForProcess.push( rightLine );

              this.removePointsInsideConvexHullArray(points);

            this.convexHull.push( leftLine );
            this.convexHull.push( rightLine );

            this.graph.drawLine( leftLine.p1 , leftLine.p2 , 5 , 0xf5dea3 , this.speed  );
            this.graph.drawLine( rightLine.p1 , rightLine.p2 , 5 , 0xf5dea3 , this.speed  )[0].call( () => {
              if(points.length > 0)
              {
                //result[1].clear();
                //this.findNextLine( leftLine , points.slice() );
                //this.findNextLine( rightLine , points.slice() );
                this.nextStep( points );
              }
            } );





        } );

    }

    private nextStep(points : Point[])
    {
        if(this.sideForProcess.length > 0)
        {
            var line = this.sideForProcess[0];
            this.removeValueFromArray(this.sideForProcess , line);
            this.findNextLine(line , points);
        }
    }

    private getPointsAboveLine(line : Line) : Point[]
    {
      var result = [];

      for(let n = 0 ; n < this.pointList.length ; n++)
      {
          var p = this.pointList[n].position;
          var v1 = new Vector2( line.p2.x - line.p1.x , line.p2.y - line.p1.y );
          var v2 = new Vector2( p.x - line.p1.x , p.y - line.p2.y );

          var c = v1.x * v2.y - v1.y * v2.x;

          if(c > 0)
          {
              result.push( this.pointList[n] );
          }
      }

      return result;
    }

    private getPointsBehindLine(line : Line) : Point[]
    {
      var result = [];

      for(let n = 0 ; n < this.pointList.length ; n++)
      {
          var p = this.pointList[n].position;
          var v1 = new Vector2( line.p2.x - line.p1.x , line.p2.y - line.p1.y );
          var v2 = new Vector2( p.x - line.p1.x , p.y - line.p2.y );

          var c = v1.x * v2.y - v1.y * v2.x;

          if(c < 0)
          {
              result.push( this.pointList[n] );
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
                /*
                if(points[n] != null)
                  points[n].clear();*/
                this.removeValueFromArray( points , points[n] );
                n--;
            }
        }
    }

    private getLastSelectedPoints() : Point[]
    {
        //return [this.selectedPoints[ this.selectedPoints.length - 1 ] , this.selectedPoints[ this.selectedPoints.length - 2 ]];
        return [this.selectedPoints[ 0 ] , this.selectedPoints[ 1 ]];
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

    private getMaxDistancePointArray(p : Vector2 , points : Point[] ) : Point
    {


        var closerPoint = points[0];
        var maxDistance = -99999;

        for(let n = 0 ; n < points.length ; n++)
        {
            var distance = points[n].position.getDistance( p );
            if( distance > maxDistance )
            {
                closerPoint = points[n];
                maxDistance = distance;
            }
        }

        return closerPoint;
    }



}
