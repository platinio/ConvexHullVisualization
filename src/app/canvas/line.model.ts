import { Vector2 } from './point.model';

export class Line
{
    constructor(public p1 : Vector2 , public p2 : Vector2)
    {

    }

    public static isInside( polygon : Line[] , p : Vector2 ) : boolean
    {
        if( polygon.length < 3 )
        {
            return false;
        }

        var extreme : Line = new Line( p , new Vector2( 9999 , p.y  ) );

        var count = 0;
        var i = 0;

        while(i < polygon.length)
        {
            if( this.doIntersect( polygon[i] , extreme ) )
            {
                if( this.orientation( new Line( polygon[i].p1 , p ) , polygon[i].p2 ) == 0 )
                {
                    return this.onSegment( polygon[i].p1 , p , polygon[i].p2 );
                }

                count++;
            }

            i++;
        }

        return ( count % 2 == 1 );

    }

    private static doIntersect( p : Line , q : Line) : boolean
    {
        var o1 = this.orientation( p , q.p1 );
        var o2 = this.orientation( p , q.p2 );
        var o3 = this.orientation( q , p.p1 );
        var o4 = this.orientation( q , p.p2 );

        if( o1 != o2 && o3 != o4 )
        {
            return true;
        }

        if( o1 == 0 && this.onSegment( p.p1 , q.p1 , p.p2) )
        {
            return true;
        }

        if( o2 == 0 && this.onSegment( p.p1 , q.p2 , p.p2 ) )
        {
            return true;
        }

        if( o3 == 0 && this.onSegment( q.p1 , p.p1 , q.p2 ) )
        {
            return true;
        }

        if( o4 == 0 && this.onSegment( q.p1 , p.p2 , q.p2 ) )
        {
            return true;
        }

        return false;

    }

    private static orientation( line : Line , v : Vector2) : number
    {
        var val : number =  (line.p2.y - line.p1.y) * ( v.x - line.p2.x ) -
                            (line.p2.x - line.p1.x) * ( v.y - line.p2.y )
        if(val == 0) return 0; //colinear

        return (val > 0) ? 1 : 2; //clock or counter clock wise
    }

    private static onSegment(p : Vector2 , q : Vector2 , r : Vector2) : boolean
    {
        if( q.x <= Math.max( p.x , r.x ) &&
            q.x >= Math.min( p.x , r.x ) &&
            q.y <= Math.max( p.y , r.y ) &&
            q.y >= Math.min( p.y , r.y ))
        {
            return true;
        }

        return false;
    }

}
