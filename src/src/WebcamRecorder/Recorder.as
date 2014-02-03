package WebcamRecorder
{
	//import flash.events.KeyboardEvent;
	//import flash.events.Event;
	import flash.display.Stage;
	import flash.events.StatusEvent;
	import flash.external.ExternalInterface;
	import flash.media.Camera;
	import flash.media.Video;
	
	import mx.graphics.ImageSnapshot;
	
	import spark.core.SpriteVisualElement;
	
	public class Recorder extends SpriteVisualElement 		
	{
		private var _video:Video;
		private var _camera:Camera;
		
		public function Recorder()
		{
			super();
			_video = new Video(640,480);
			this.addChild(_video);
			
			
			if (ExternalInterface.available) {
				ExternalInterface.addCallback('startcam',this.startcam);
				ExternalInterface.addCallback('stopcam',this.stopcam);
				ExternalInterface.addCallback('snapshot',this.snapshot);
			}
			this.statechange('ready');
			/*
			// testing by keyboard shortcuts
			var self = this;
			this.addEventListener(Event.ADDED_TO_STAGE,function(addedEvent){
				addedEvent.target.stage.addEventListener(KeyboardEvent.KEY_UP,function(e:KeyboardEvent):void{
					switch(String.fromCharCode( e.charCode)){
						case 'q':
							self.stopcam();
							break;
						case 's':
							self.startcam();
							break;
						case 'x':
							trace(self.snapshot());
							break;
						default:
							trace(e.charCode);
					}
				});
			});
			*/
		}
		private function setCamera() {
			if ( ! this._camera ) {
				this._camera = Camera.getCamera(); //Camera.names[0]);
				this._camera.setMode(640, 480, 15);
				this._camera.setQuality(0, 80);
				this._camera.addEventListener(StatusEvent.STATUS, camera_status);
				
			}
		}
		private function startcam():void{
			this.setCamera();
			this._video.attachCamera(this._camera);
			this.statechange('waiting');
			if ( ! this._camera.muted )
				this.statechange('started');
		}
		private function stopcam():void{
			this._video.attachCamera(null);
			this.statechange('stopped');
		}
		private function snapshot():String{
			var captured : ImageSnapshot = ImageSnapshot.captureImage(this._video);
			return 'data:image/png;base64,' + ImageSnapshot.encodeImageAsBase64(captured);
		}
		private function camera_status(e:StatusEvent):void {
			if (e.code=='Camera.Unmuted') {
				this.statechange('started');
			} else {
				this.statechange('error');
				this.stopcam();
			}
		}
		private function statechange(state:String):void{
			try {
				ExternalInterface.call('statechange',state);
			} catch(err:Error){
			}
		}
	}
}