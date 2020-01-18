import { Point , Vector2 } from '../point.model';
import { GraphService } from './graph.service';
import { Container , Graphics } from 'pixi.js';

export abstract class ConvexHull
{
    protected graph : GraphService; //helper for drawing
    protected pointList : Point[] = [];
    protected stopped : boolean = false;
    protected speed : number = 1;

    abstract clearAllLines();

    public stop()
    {
        this.stopped = true;
    }

    public setSpeed(speed : number)
    {
        this.speed = speed;
    }
}
