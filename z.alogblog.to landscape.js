'use strict';

// to LANDSCPE.

// Constants.
var LONG = 10;	// amount of cell in height.
var UP = 1;
var RIGHT = 0;
var LEFT = 1;
var WIN7_DESKTOP = 'w7dt';
var START_BUTTON = 'sBtn';
var STATUS_BAR = 'sBar';
var SSTATUS_BAR = 'ssBar';
var STATUS_BAR_STATE = 'sBarState';
var MOVE_SBAR_ONLY = 'mSbarO';
var PANEL1x1 = 'date';
var FOLDER_IN_PANEL1x1 = 'folder1x1';
var PKG = 'alogblog';
var EXIT_SCRIPT = -1;

// LL properties.
var LH = 'Lh';
var LX = 'Lx';
var LY = 'Ly';
var LX2 = 'Lx2';
var LY2 = 'Ly2';
var F_WX = 'f.wX';
var F_WY = 'f.wY';
var F_WW = "f.wW";
var F_WH = "f.wH";
var FOLDER_TYPE = 'Folder';

// local variables.
var dt, startButton, tag, statusBar, sStatusBarContainer;
var statusBarHeight, subFolderXfromLeft, startButtonPopupYfromTop;
var folder, folder1x1XfromLeft, folder1x1YfromTop;
var i, it, items, cache;

function getObjects() {

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
	
	if ( cache[SSTATUS_BAR] ) {
		sStatusBarContainer = cache[SSTATUS_BAR];
	}
	else {
		sStatusBarContainer = statusBar.getContainer().getItemByLabel(SSTATUS_BAR).getContainer();
		cache[SSTATUS_BAR] = sStatusBarContainer;
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

	if ( cache[FOLDER_IN_PANEL1x1] ) {
		folder = cache[FOLDER_IN_PANEL1x1];
	}
	else {
		try {
			folder = statusBar.getContainer().getItemByLabel(PANEL1x1).getContainer().getItemByLabel(FOLDER_IN_PANEL1x1);
		} catch(e) {
			Android.makeNewToast("Not found 1x1 sized panel or folder in it", false).show();
			return;
		}
		cache[FOLDER_IN_PANEL1x1] = folder;
	}
}

function getValues() {

	if ( cache[LH] ) {
		statusBarHeight = cache[LH];
		subFolderXfromLeft = cache[LX];
		startButtonPopupYfromTop = cache[LY];
		folder1x1XfromLeft = cache[LX2];
		folder1x1YfromTop = cache[LY2];
	}
	else {
		tag = statusBar.getTag();
		if ( tag == '' ) {
			var dtHeight, dtWidth, startPopupPos, startPopupWidth, startPopupHeight, fc;
			
			dtWidth = dt.getHeight();	// in rotation event, dt's size was of previous mode.
			dtHeight = dt.getWidth();
			startPopupPos = startButton.getCell().getLeft() == 0 ? LEFT : RIGHT;
			startPopupWidth = startButton.getProperties().getInteger(F_WW);
			startPopupHeight = startButton.getProperties().getInteger(F_WH);
			fc = statusBar.getContainer().getItemByLabel(PANEL1x1).getContainer().getItemByLabel(FOLDER_IN_PANEL1x1).getContainer();
			//alert(dtHeight + '/' + dtWidth + '/' + startPopupPos + '/' + startPopupWidth + '/' + startPopupHeight + '/' + fc);
			
			//statusBarHeight = dt.getCellHeight(); // it can't be used, cell height is of previous desktop mode.
			statusBarHeight = dtHeight / LONG;
			subFolderXfromLeft = ( startPopupPos == RIGHT ? dtWidth - startPopupWidth  : 0 );
			startButtonPopupYfromTop = Math.round(dtHeight - startPopupHeight - statusBarHeight);
			// Uninitialized problem hack.
			try {
				folder1x1XfromLeft = Math.round( startPopupPos == RIGHT ? 0: dtWidth - fc.getWidth() );
				folder1x1YfromTop  = Math.round( dtHeight - statusBarHeight - fc.getHeight() );
			}
			catch(e) {
				return EXIT_SCRIPT;			
			}			
		}
		else {
			tag = JSON.parse( tag );
			if ( tag[LH] == undefined ) {
				Android.makeNewToast("Please run 'Util.arrangeTemplate' script in landscape.", false).show();
				return EXIT_SCRIPT;			
			}			
			statusBarHeight = parseFloat(tag[LH]);
			subFolderXfromLeft = parseInt(tag[LX]);
			startButtonPopupYfromTop = parseInt(tag[LY]);	
			folder1x1XfromLeft = parseInt(tag[LX2]);
			folder1x1YfromTop = parseInt(tag[LY2]);
		}

		cache[LH] = statusBarHeight;
		cache[LX] = subFolderXfromLeft;
		cache[LY] = startButtonPopupYfromTop;
		cache[LX2] = folder1x1XfromLeft;
		cache[LY2] = folder1x1YfromTop;
	}
}

function main() {

	getObjects();
	if ( EXIT_SCRIPT == getValues() ) {
		return;
	}

	// 1. arrange START popup folder's Y.
	startButton.getProperties().edit().setInteger(F_WY, startButtonPopupYfromTop).commit();

	// 1.5. arrange X/Y of folder in 1x1 DATE panel.
	folder.getProperties().edit()
		.setInteger(F_WX, folder1x1XfromLeft)
		.setInteger(F_WY, folder1x1YfromTop)
		.commit();

	// 2. arange START popup's sub-folder's X/Y.
	items = startButton.getContainer().getItems();
	for (i=0; i< items.getLength(); i++) {
		it = items.getAt(i);
		if( it.getType() == FOLDER_TYPE ) {
			it.getProperties().edit()
				.setInteger(F_WX, subFolderXfromLeft)
				.setInteger(F_WY, startButtonPopupYfromTop)
				.commit();
		}
	}	

	// 3. if sBar is UP, move status bar upward.
	if ( cache[STATUS_BAR_STATE] == UP ) {
		// Don't open START folder. Just move up status bar.
		cache[MOVE_SBAR_ONLY] = true;
		// move up the desktop.
		dt.setPosition(0, statusBarHeight);
	}	

	// 4.
	sStatusBarContainer.setPosition(0, 0);
}

main();