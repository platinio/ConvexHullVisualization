import { Component , ViewChild , ElementRef , OnInit , NgZone , Injectable} from '@angular/core';
import { Application , Graphics } from 'pixi.js';
import { Point , Vector2 } from './point.model';
import { TweenService } from './services/tween.service';
import { GiftWrappingService } from './services/gif-wrapping.service';



@Component({

  selector: 'app-canvas',
  templateUrl: './canvas.component.html'

})


@Injectable()
export class CanvasComponent implements OnInit
{
  private app: Application;

  private screenSize = {x: 2048 , y: 1024};
  private pointList : Point[];

  //ellipse : Graphics;
  //coords = { x: 0, y: 0 };


  constructor(private tweenService : TweenService , private elementRef: ElementRef, private ngZone: NgZone) {}



  ngOnInit(): void
  {

    //this.setupCreatejs();
    this.setupPixijs();
    this.pointList = [];

  }


  private setupPixijs()
  {
      this.ngZone.runOutsideAngular(() => {

        this.app = new Application({

          width: this.screenSize.x,         // default: 800
          height: this.screenSize.y,        // default: 600
          antialias: true,    // default: false
          transparent: false, // default: false
          resolution: 1       // default: 1

        });

        this.app.renderer.backgroundColor = 0x02a8a8;

      });

      this.elementRef.nativeElement.appendChild(this.app.view);
      this.app.ticker.add(delta => this.gameLoop(delta));

      this.app.stage.hitArea = new PIXI.Rectangle(0, 0, this.screenSize.x, this.screenSize.y);
      this.app.stage.interactive = true;
      this.app.stage.buttonMode = true;
      this.app.stage.on("mousedown" , (event) => { this.handleClick(event); });

  }

  private gameLoop(delta : number)
  {

  }

  handleClick(e)
  {

      var point = e.data.getLocalPosition(this.app.stage)

      this.createPoint(point.x , point.y);
      //this.createPoint(x , y);

  }

  createPoint(x : number , y : number)
  {
      this.pointList.push( new Point( this.tweenService , this.app.stage , new Vector2(x , y) ) );
  }

  calculateGifWrapping()
  {
      var gf = new GiftWrappingService(this.pointList , this.app.stage);
  }


}
