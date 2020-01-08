import { Component , ViewChild , ElementRef , OnInit , NgZone} from '@angular/core';
import { Application , Graphics } from 'pixi.js';
import { Point } from './point.model';

//declare var TWEEN : any;

declare var createjs: any;

@Component({

  selector: 'app-canvas',
  templateUrl: './canvas.component.html'

})



export class CanvasComponent implements OnInit
{
  private app: Application;
  private stage: any;
  private screenSize = {x: 2048 , y: 1024};
  private pointList : Point[];

  //ellipse : Graphics;
  //coords = { x: 0, y: 0 };


  constructor(private elementRef: ElementRef, private ngZone: NgZone) {}



  ngOnInit(): void
  {

    this.setupCreatejs();
    this.setupPixijs();
    this.pointList = [];

    /*
    //var ellipse = new Graphics();
    this.ellipse = new Graphics();
    this.ellipse.beginFill(0xFFFF00);
    this.ellipse.drawEllipse(0, 0, 50, 20);
    this.ellipse.endFill();
    this.ellipse.x = 500;
    this.ellipse.y = 500;
    this.app.stage.addChild(this.ellipse);

    //TweenManager.scaleTween( 5 , (x : number , y : number) => {  } );*/

      //this.app.ticker.add(delta => this.gameLoop(delta));
      //this.app.ticker.add(delta => TweenManager.update(delta));

      //const
      /*
      const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
        .to({ x: 300, y: 200 }, 1000) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(() => { // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
            //box.style.setProperty('transform', `translate(${coords.x}px, ${coords.y}px)`);

            this.ellipse.x = coords.x;
            alert("hi");
        })
        .start();*/
        /*
        const tween = new TWEEN.Tween(coords).to({ x: 300, y: 200 }, 1000).easing(TWEEN.Easing.Quadratic.Out).onUpdate(() => {

          alert("hi");

        })
        .start();*/
        /*
        createjs.Tween.get(this.ellipse.scale)
        .to({ x: 400 }, 1000, createjs.Ease.getPowInOut(4));

        createjs.Ticker.setFPS(60);

        createjs.Ticker.addEventListener("tick", this.stage);*/

        createjs.Ticker.setFPS(60);

        createjs.Ticker.addEventListener("tick", this.stage);

  }

  private setupCreatejs()
  {
      this.stage = new createjs.Stage("tweens");
      createjs.Ticker.setFPS(60);
      createjs.Ticker.addEventListener("tick", this.stage);
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

      this.pointList.push( new Point( this.app.stage , x , y ) );
  }


}
