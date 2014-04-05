// desktop swipe up.
// v.1.1

// Can be customizable.
var __AUTO_OPEN__ = true;

// Constants.
var UP = 1;
var WIN7_DESKTOP = 'w7dt';
var MOVE_SBAR_ONLY = 'mSbarO';
var START_BUTTON = 'sBtn';
var STATUS_BAR = 'sBar';
var STATUS_BAR_STATE = 'sBarState';
var PKG = 'alogblog';


var dt, cache, startButton;

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
if ( cache[START_BUTTON] ) {
	startButton = cache[START_BUTTON];
}
else {
	try {
		startButton = dt.getItemByLabel(STATUS_BAR).getContainer().getItemByLabel(START_BUTTON);
	} catch(e) {
		Android.makeNewToast("Not found 'START button'", false).show();
		return;
	}
	cache[START_BUTTON] = startButton;
}

cache[STATUS_BAR_STATE] = UP;
dt.setPosition(0, dt.getCellHeight(), 1, true);
if ( __AUTO_OPEN__ && cache[MOVE_SBAR_ONLY] !== true ) {
	startButton.open();
	cache[MOVE_SBAR_ONLY] = false;
}