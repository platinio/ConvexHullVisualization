import { Point , Vector2 } from '../point.model';
import { GraphService } from './graph.service';
import { Container , Graphics } from 'pixi.js';

export abstract class ConvexHull
{
    protected graph : GraphService; //helper for drawing
    protected pointList : Point[] = [];
    protected stopped : boolean = false;

    abstract clearAllLines();
    
    public stop()
    {
        this.stopped = true;
    }
}
