// Desktop 'Windows7' arrangement on LL app load
// v.1.1

setTimeout( function() {
	var dt;

	try {
		dt = LL.getCurrentDesktop();
	}
	catch(e) {
		// In the app drawer.
		return;
	}
	
	if ( dt.getName() !== 'Windows7' ) {
		return;
	}
	
	Android.makeNewToast("On arranging desktop 'Windows7' at LL load", false).show();
	
	try {
		if ( dt.getHeight() > dt.getWidth()  ) {
			LL.runScript( 'z.alogblog.to portrait', null );
		}
		else {
			LL.runScript( 'z.alogblog.to landscape', null );
		}
	}
	catch(e) {}
}, 1000);