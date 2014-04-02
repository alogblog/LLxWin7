// win7 go Home.
// v.1.0

// Constants.
var EPS_Y = 5;
var DOWN = 0;
var UP = 1;
var WIN7_DESKTOP = 'w7dt';
var PKG = 'alogblog';
var STATUS_BAR_STATE = 'sBarState';

// Variables.
var cache, dt, animationFlag;

if ( self[PKG] == null ) {
	self[PKG] = new Object();
}
cache = self[PKG];
if ( cache[WIN7_DESKTOP] ) {
	dt = cache[WIN7_DESKTOP];
}
else {
	dt = LL.getCurrentDesktop();
	cache[WIN7_DESKTOP] = dt;
}

/*
LL.runScript('z.alogblog.close opened folders(desktop swipe)', null );
// It's important. If animation is enabled, 'position changed' event handler is called.
animationFlag = false;
dt.setPosition(0, Math.floor( dt.getPositionY() ) < EPS_Y ? dt.getCellHeight() : 0 , 1, animationFlag);
*/

if ( cache[STATUS_BAR_STATE] == DOWN ) {
	LL.runScript('z.alogblog.swipe up', null);
}
else {
	LL.runScript('z.alogblog.swipe down', null);
}