import { Point , Vector2 } from '../point.model';
import { Line } from '../line.model';
import { GraphService } from './graph.service';
import { Container , Graphics } from 'pixi.js';
import { ConvexHull } from './convex-hull';

export class QuickHullService extends ConvexHull
{
    
    private selectedPoints: Point[] = null;
    private convexHull: Line[] = [];
    private convexHullStack: any = [];
    public firstTime = true;

    constructor(pointList : Point[] , private container: Container , speed: number)
    {
        super();
        this.speed = speed;
        this.graph = new GraphService(this.container);
        this.pointList = pointList.slice();
        const points = this.pickStartingLine();

        this.markPointAsSelected( points[0] );
        this.markPointAsSelected( points[1] );

        const line = new Line( points[0].position , points[1].position );


        const above = this.getPointsAboveLine( line , this.pointList );
        const below = this.getPointsBelowLine( line , this.pointList );

        this.convexHull.push( line );


        this.convexHullStack.push( [ line , null , above , -1 , true] );
        this.convexHullStack.push( [ line , null , below , 1 , false] );

        this.nextStep(  );

    }

    clearAllLines() {
        
    }


    private findNextLine(line: Line , oldLine: Graphics , points: Point[] , side: number , drawLine: boolean)
    {
        if (drawLine)
        {
            const result = this.graph.drawLine( line.p1 , line.p2 , 5 ,  0xf5dea3 , this.speed  );
            result[0].call( () => {

                this.processQuickHull(line , result[1] , points , side);
            } );
        }
        else
        {
            this.processQuickHull(line , oldLine , points , side);
        }


    }

    private processQuickHull(line : Line , oldLine : Graphics , points : Point[] , side : number )
    {

        let maxDistancePoint = null;
        let maxDistance = -1;
        for (let n = 0 ; n < points.length ; n++)
        {
            const d: number = this.distanceToLine( line , points[n].position );

            if ( this.findSide( line , points[n].position ) == side && d > maxDistance)
            {
                maxDistancePoint = points[n];
                maxDistance = d;
            }
        }

        if (maxDistancePoint == null)
        {

            this.nextStep(  );
            return;
        }

        this.markPointAsSelectedArray( maxDistancePoint , points );

        const leftLine = new Line(maxDistancePoint.position , line.p1   );
        const rightLine = new Line(maxDistancePoint.position , line.p2  );


        this.firstTime = false;


        this.convexHull.push( leftLine );
        this.convexHull.push( rightLine );

        const leftLineResult = this.graph.drawLine( leftLine.p2 , leftLine.p1 , 5 , 0xf5dea3 , this.speed  );
        const rightLineResult = this.graph.drawLine( rightLine.p2 , rightLine.p1 , 5 , 0xf5dea3 , this.speed  );

        const leftLineSide = -this.findSide( new Line( maxDistancePoint.position , line.p1 ) , line.p2  );
        const rightLineSide = -this.findSide( new Line( maxDistancePoint.position , line.p2 ) , line.p1  ) ;

        this.convexHullStack.push(
            [ leftLine , leftLineResult[1] , points , leftLineSide , false]
            );
        this.convexHullStack.push( 
            [ rightLine , rightLineResult[1] , points , rightLineSide , false ]
             );


        rightLineResult[0].call( () => {

            if (oldLine != null)
            {
                oldLine.clear();
            }
            this.nextStep(  );
        } );



    }

    private distanceToLine(line : Line , point : Vector2) : number
    {
        return Math.abs(  ( point.y - line.p1.y ) * ( line.p2.x - line.p1.x ) -
                          ( line.p2.y - line.p1.y ) * (  point.x - line.p1.x ) );
    }

    private findSide(line : Line , point : Vector2) : number
    {
        const val : number =  ( point.y - line.p1.y ) * ( line.p2.x - line.p1.x ) -
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
            const info = this.convexHullStack[0];
            this.convexHullStack.splice(0 , 1);
            this.findNextLine(info[0] , info[1] , info[2] , info[3] , info[4] );
        }
    }

    private getPointsAboveLine(line : Line , points : Point[]) : Point[]
    {
        const result = [];

        for(let n = 0 ; n < points.length ; n++)
        {
            const p = points[n].position;
            const v1 = new Vector2( line.p2.x - line.p1.x , line.p2.y - line.p1.y );
            const v2 = new Vector2( line.p2.x - p.x, line.p2.y - p.y );

            const c = v1.x * v2.y - v1.y * v2.x;

            if(c > 0)
            {
                result.push( points[n] );
            }
        }

        return result;
    }


    private getPointsBelowLine(line : Line , points : Point[]) : Point[]
    {
        const result = [];

        for(let n = 0 ; n < points.length ; n++)
        {
            const p = points[n].position;
            const v1 = new Vector2( line.p2.x - line.p1.x , line.p2.y - line.p1.y );
            const v2 = new Vector2( line.p2.x - p.x, line.p2.y - p.y );

            const c = v1.x * v2.y - v1.y * v2.x;

            if(c < 0 || c == 0)
            {
                result.push( points[n] );
            }
        }

        return result;
    }


    private pickStartingLine() : Point[]
    {
        let leftPoint = null;
        let rightPoint = null;

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



}
