import { Component , ViewChild , ElementRef , OnInit , NgZone} from '@angular/core';
import { Application , Graphics } from 'pixi.js';

//declare var TWEEN : any;

declare var createjs: any;

@Component({

  selector: 'app-canvas',
  templateUrl: './canvas.component.html'

})



export class CanvasComponent implements OnInit
{
  public app: Application;

  ellipse : Graphics;
  coords = { x: 0, y: 0 };
  stage: any;

  constructor(private elementRef: ElementRef, private ngZone: NgZone) {}



  ngOnInit(): void {
    this.stage = new createjs.Stage("demoCanvas");
    this.ngZone.runOutsideAngular(() => {



      this.app = new Application({

        width: 2048,         // default: 800
        height: 1024,        // default: 600
        antialias: true,    // default: false
        transparent: false, // default: false
        resolution: 1       // default: 1

      });

      this.app.renderer.backgroundColor = 0x061639;

    });

    this.elementRef.nativeElement.appendChild(this.app.view);

    //var ellipse = new Graphics();
    this.ellipse = new Graphics();
    this.ellipse.beginFill(0xFFFF00);
    this.ellipse.drawEllipse(0, 0, 50, 20);
    this.ellipse.endFill();
    this.ellipse.x = 500;
    this.ellipse.y = 500;
    this.app.stage.addChild(this.ellipse);

    //TweenManager.scaleTween( 5 , (x : number , y : number) => {  } );

      this.app.ticker.add(delta => this.gameLoop(delta));
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

        createjs.Tween.get(this.ellipse.scale)
        .to({ x: 400 }, 1000, createjs.Ease.getPowInOut(4));

        createjs.Ticker.setFPS(60);

        createjs.Ticker.addEventListener("tick", this.stage);

  }

  gameLoop(delta : number)
  {
    this.ellipse.rotation += 20 * delta;
    //this.ellipse.x += 1;
    //TWEEN.update(delta);
    //alert(this.coords.x);


  }

}
