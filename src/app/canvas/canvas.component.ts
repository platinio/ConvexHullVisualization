import { Component , ViewChild , ElementRef , OnInit , NgZone} from '@angular/core';
import { Application , Graphics } from 'pixi.js';
import { Tween } from '../Tween/tween';
import { TweenManager } from '../Tween/tween-manager';

@Component({

  selector: 'app-canvas',
  templateUrl: './canvas.component.html'

})


export class CanvasComponent implements OnInit
{
  public app: Application;

  ellipse : Graphics;

  constructor(private elementRef: ElementRef, private ngZone: NgZone) {}



  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {



      this.app = new Application({

        width: 256,         // default: 800
        height: 256,        // default: 600
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
    this.ellipse.x = 180;
    this.ellipse.y = 130;
    this.app.stage.addChild(this.ellipse);

    //TweenManager.scaleTween( 5 , (x : number , y : number) => {  } );

      this.app.ticker.add(delta => this.gameLoop(delta));
      this.app.ticker.add(delta => TweenManager.update(delta));


  }

  gameLoop(delta : number)
  {
    this.ellipse.rotation += 20 * delta;
  }

}
