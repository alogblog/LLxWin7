// desktop swipe down.
// v.1.1

// Constants.
var DOWN = 0;
var WIN7_DESKTOP = 'w7dt';
var MOVE_SBAR_ONLY = 'mSbarO';
var START_BUTTON = 'sBtn';
var STATUS_BAR = 'sBar';
var STATUS_BAR_STATE = 'sBarState';
var FOLDER_IN_PANEL1x1 = 'folder1x1';
var PKG = 'alogblog';

// LL properties.
var FOLDER_TYPE = 'Folder';
var PANEL_TYPE = 'Panel';

var dt, statusBar, startButton;
var i, it, items, panelFolder, cache;

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
if ( cache[STATUS_BAR] ) {
	statusBar = cache[STATUS_BAR];
}
else {
	statusBar = dt.getItemByLabel(STATUS_BAR);
	cache[STATUS_BAR] = statusBar;
}
if ( cache[START_BUTTON] ) {
	startButton = cache[START_BUTTON];
}
else {
	try {
		startButton = statusBar.getContainer().getItemByLabel(START_BUTTON);
	} catch(e) {
		Android.makeNewToast("Not found 'START button'", false).show();
		return;
	}
	cache[START_BUTTON] = startButton;
}
	

	
cache[STATUS_BAR_STATE] = DOWN;
dt.setPosition(0, 0, 1, true);

// close START folder and its subfolder
if ( startButton.isOpen() ) {
	items = startButton.getContainer().getItems();
	for( i=0; i < items.getLength(); i++ ) {
		it = items.getAt(i);
		if ( it.getType() == FOLDER_TYPE && it.isOpen() ) {
			it.close();
			break;
		}
	}
	startButton.close();
}

// close 1x1 sized 'date'.
items = statusBar.getContainer().getItems();
for ( i=0; i<items.getLength(); i++ ) {
	it = items.getAt(i);
	if ( it.getType() == PANEL_TYPE ) {
		panelFolder = it.getContainer().getItemByLabel(FOLDER_IN_PANEL1x1);
		if ( panelFolder && panelFolder.isOpen() ) {
			panelFolder.close();
		}
		break; // Assume only one 1x1 panel.
	}
}

cache[MOVE_SBAR_ONLY] = false;
