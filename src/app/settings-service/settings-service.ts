import { Injectable , EventEmitter} from '@angular/core';

@Injectable()
export class SettingsService 
{
    public currentSelectedAlgorithm = '';
    public onRandomClicked : EventEmitter<void> = new EventEmitter();
    public onPlayCliked :  EventEmitter<void> = new EventEmitter();
}