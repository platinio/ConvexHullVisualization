import { Point } from '../point.model';
import { GraphService } from './graph.service';
import { Container } from 'pixi.js';

export class GiftWrappingService
{
    constructor(private pointList : Point[] , private container : Container)
    {
        var graph = new GraphService(this.container);
        graph.drawLine( pointList[0].position , pointList[1].position );
    }
}
