import { Component , ViewChild , ElementRef , OnInit , NgZone , Injectable} from '@angular/core';
import { Application , Graphics } from 'pixi.js';
import { Point } from './point.model';
import { TweenService } from './services/tween.service';



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
/*
        createjs.Ticker.setFPS(60);

        createjs.Ticker.addEventListener("tick", this.stage);*/

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

        this.app.renderer.backgroundColor = 0x061639;

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
      console.log(e);
  }

  createPoint(x : number , y : number)
  {
    /*
      var point = new Graphics();
      point.beginFill(0xFFFF00);
      point.drawEllipse(0, 0, 10, 10);
      point.endFill();
      point.x = x;
      point.y = y;
      this.app.stage.addChild(point);*/

      this.pointList.push( new Point( this.tweenService , this.app.stage , x , y ) );
  }


}
