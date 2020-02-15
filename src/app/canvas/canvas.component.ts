import { Component , ViewChild , ElementRef , OnInit , NgZone , Injectable , HostListener , Output} from '@angular/core';

import { Application , Graphics } from 'pixi.js';
import { Point , Vector2 } from './point.model';
import { TweenService } from './services/tween.service';
import { GiftWrappingService } from './services/gif-wrapping.service';
import { QuickHullService } from './services/quick-hull.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { SettingsService } from './../settings-service/settings-service';




@Component({

  selector: 'app-canvas',
  templateUrl: './canvas.component.html'

})


@Injectable()
export class CanvasComponent implements OnInit
{
    private app: Application;

    private screenSize = {x: window.innerWidth , y: window.innerHeight };
    private pointList : Point[];
    private giftWrapping : GiftWrappingService = null;
    private quickHull : QuickHullService = null;
    private minRandomPoints : number = 20;
    private maxRandomPoints : number = 40;
    private randomSpawnPointMargin : Vector2 = new Vector2(400 , 200);
    private speed : number = 20;  
    private isRunning = false;

    

  

  constructor(
                private tweenService : TweenService , 
                private elementRef: ElementRef, 
                private ngZone: NgZone , 
                public settingsService : SettingsService) 
    {
        this.settingsService.onPlayCliked.subscribe( () => { this.calculateConvexHull(); });
        this.settingsService.onRandomClicked.subscribe( () => { this.createRandomPoints(); } );
        this.isRunning = false;
    }



  ngOnInit(): void
  {
    //this.trigger.openMenu();
    //this.setupCreatejs();
    this.setupPixijs();
    this.pointList = [];
    this.settingsService.isRunning = false;

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

        this.app.renderer.backgroundColor = 0x212121;

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

    private calculateConvexHull()
    {
        if(this.pointList.length < 3)
        {
            return;
        }

        if(this.isRunning)
        {
            this.clearCanvas();
            return;
        }

        this.settingsService.isRunning = true;
        this.isRunning = true;

        if(this.settingsService.currentSelectedAlgorithm == "gift-wrapping")
        {
            this.calculateGifWrapping();
        }
        else
        {
            this.calculateQuickHull();
        }
    }

  public calculateGifWrapping()
  {
      if(this.giftWrapping != null)
      {
          this.giftWrapping.clearAllLines();
          this.giftWrapping.stop();
      }

      this.giftWrapping = new GiftWrappingService(this.pointList , this.app.stage , this.settingsService);
  }

  public calculateQuickHull()
  {
      if(this.quickHull != null)
      {
          this.quickHull.clearAllLines();
          this.quickHull.stop();
      }

      this.quickHull = new QuickHullService( this.pointList , this.app.stage , this.settingsService );
  }

  public clearCanvas()
  {
      if(this.giftWrapping != null)
      {
          this.giftWrapping.clearAllLines();
            this.giftWrapping.stop();
      }

      if(this.quickHull != null)
      {
          this.quickHull.clearAllLines();
            this.quickHull.stop();
      }


      for(let n = 0 ; n < this.pointList.length ; n++)
      {
          this.pointList[n].clear();
      }

      this.settingsService.isRunning = false;
      this.isRunning = false;
      this.pointList = [];
      this.giftWrapping = null;
      this.quickHull = null;
  }

  public createRandomPoints()
  {
      var pointCount = this.getRandomInt( this.minRandomPoints , this.maxRandomPoints );

      for(let n = 0 ; n < pointCount ; n++)
      {
          var x = this.getRandomInt( this.randomSpawnPointMargin.x , this.screenSize.x - this.randomSpawnPointMargin.x );
          var y = this.getRandomInt( this.randomSpawnPointMargin.y , this.screenSize.y - this.randomSpawnPointMargin.y );
          this.createPoint( x , y );
      }
  }

  private getRandomInt(min, max) : number
  {
      return Math.floor(Math.random() * (max - min)) + min;
  }

  public onSpeedChange(value : number)
  {
      this.speed = value;

      if(this.giftWrapping != null)
      {
          this.giftWrapping.setSpeed( this.speed );
      }

      if(this.quickHull != null)
      {
          this.quickHull.setSpeed( this.speed );
      }
  }

    @HostListener('window:resize', ['$event'])
    onResize(event) 
    {        
        this.app.renderer.resize(window.innerWidth, window.innerHeight);        
    }


}
