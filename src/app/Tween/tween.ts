
//type declarations
type numberAction = (value : number) => void;

export class Tween
{
  public currentDuration : number;
  public duration : number;
  public onValueUpdate : numberAction;

  constructor()
  {
      this.currentDuration = 0;
  }

  update( delta : number )
  {
      this.currentDuration += delta;
  }

  setOnValueUpdate(action : numberAction)
  {
      this.onValueUpdate = action;
  }


}
