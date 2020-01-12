import { Point , Vector2 } from '../point.model';
import { GraphService } from './graph.service';
import { Container } from 'pixi.js';

export class GiftWrappingService
{

    private graph : GraphService;
    private selectedPoints : Point[];
    private tempPointList : Point[];
    private currentMinAnglePoint : Point = null;
    private currentMinAngle : number = 361;

    constructor(private pointList : Point[] , private container : Container)
    {


        var startingPointIndex = this.getStartingPointIndex();
        var startingPoint = this.pointList[ startingPointIndex ];
        this.selectedPoints = [];
        this.selectedPoints.push( startingPoint );
        this.removeElementFromIndex( pointList , startingPointIndex );

        this.graph = new GraphService(this.container);
        this.tempPointList = this.pointList.slice();
        this.currentMinAnglePoint = null;
        this.findNextPoint();
        /*
        this.graph.drawLine( startingPoint.position , this.pickRandomPoint().position , 5 , 0xf5dea3 ).call( () =>
        {

        } );*/
    }

    private findNextPoint()
    {
        var selectedPoint = this.selectedPoints[ this.selectedPoints.length - 1 ];
        var randomSelectedIndex = this.pickRandomIndex(this.tempPointList);
        var randomSelected = this.tempPointList[ randomSelectedIndex ];

        this.removeElementFromIndex( this.tempPointList , randomSelectedIndex );



        this.graph.drawLine( selectedPoint.position , randomSelected.position , 5 , 0xf5dea3 ).call( () =>
        {
            var dir = this.getDirection( selectedPoint.position , randomSelected.position );
            var axis = new Vector2(1 , 0);

            if(this.selectedPoints.length > 1)
            {

                axis = this.getDirection( this.selectedPoints[ this.selectedPoints.length - 2 ].position , this.selectedPoints[ this.selectedPoints.length - 1 ].position );
                axis = new Vector2( axis.y , axis.x * -1 );
                //axis.x = axis.x * -1;
                //axis.y = axis.y * -1;

            }

            var angle = this.calculateAngle( dir , axis );
            //angle = Math.abs(angle);
            console.log("angle " + angle);


            if( angle < this.currentMinAngle || this.currentMinAnglePoint == null)
            {
              //console.log( "update min angle " + this.currentMinAngle + " new " +  angle);

              //if(this.currentMinAnglePoint == null)
              //    console.log("current point was null");

              this.currentMinAnglePoint = randomSelected;
              this.currentMinAngle = angle;
            }

            this.graph.clearLastGraphic();

            if(this.tempPointList.length > 0)
            {

                this.findNextPoint();
            }
            else
            {

                this.graph.drawLine( selectedPoint.position , this.currentMinAnglePoint.position , 5 , 0xf5dea3 ).call( () => {

                  if(this.tempPointList.length > 0)
                  {
                      //this.currentMinAnglePoint = null;
                      this.currentMinAngle = 361;

                      if(this.selectedPoints[ this.selectedPoints.length - 1 ] != this.selectedPoints[ 0 ])
                          this.findNextPoint();
                  }


                } );

                if(this.selectedPoints.length == 1)
                {
                    this.pointList.push( this.selectedPoints[0] );
                }

                this.selectedPoints.push( this.currentMinAnglePoint );
                //this.removeElementFromIndex( this.pointList , this.currentMinAnglePointIndex );
                this.removeElementFromValue(this.pointList , this.currentMinAnglePoint);
                this.tempPointList = this.pointList.slice();
                this.currentMinAngle = 361;


            }



        } );
    }


    private removeElementFromValue(array : any , element : any)
    {
        for(let n = 0 ; n < array.length ; n++)
        {
            if(array[n] == element)
            {
                array.splice(n , 1);
                return;
            }
        }
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
