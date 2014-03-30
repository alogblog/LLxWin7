'use strict';

// close opened folders(desktop swipe).

// Can be customizable.
var __AUTO_OPEN__ = true;
var __DELAY__ = 100;	// Time to scroll up/dwon fully, in order to decide scroll direction.

/*
getCurrentDesktop
getHeight
getItemByLabel
getContainer
getPositionY
translateIntoScreenCoordY
getLength
getAt
getType
isOpen
getItems
close
open
setTimeout
*/

// Constants.
var DOWN = 0;
var UP = 1;
var WIN7_DESKTOP = 'w7dt';
var MOVE_SBAR_ONLY = 'mSbarO';
var START_BUTTON = 'sBtn';
var STATUS_BAR = 'sBar';
var STATUS_BAR_STATE = 'sBarState';
var STATUS_BAR_NEXT_STATE = 'sBarNextState';
var FOLDER_IN_PANEL1x1 = 'folder1x1';
var PKG = 'alogblog';

// LL properties.
var FOLDER_TYPE = 'Folder';
var PANEL_TYPE = 'Panel';

setTimeout( function() {
	var dt, desktop_height, statusBar, startButton, statusBarContainer;
	var i, j, it, it2, it3, items, panelFolder, cache;
	
	if ( self[PKG] == null ) {
		self[PKG] = new Object();
	}
	cache = self[PKG];

	if ( cache[WIN7_DESKTOP] ) {
		dt = cache[WIN7_DESKTOP];
		statusBar = cache[STATUS_BAR];
		startButton = cache[START_BUTTON];
	}
	else {
		dt = LL.getCurrentDesktop();
		statusBar = dt.getItemByLabel(STATUS_BAR);
		try {
			startButton = statusBar.getContainer().getItemByLabel(START_BUTTON);
		} catch(e) {
			Android.makeNewToast("Not found 'START button'", true).show();
			return;
		}
		
		cache[WIN7_DESKTOP] = dt;
		cache[STATUS_BAR] = statusBar;
		cache[START_BUTTON] = startButton;
	}

	desktop_height = dt.getHeight();
	statusBarContainer = statusBar.getContainer();

	cache[STATUS_BAR_STATE] = 
		( dt.translateIntoScreenCoordY(statusBar.getPositionY()) == desktop_height ? DOWN : UP );
	if ( cache[STATUS_BAR_STATE] == DOWN ) {
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
		items = statusBarContainer.getItems();
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
	}
	else {
		if ( __AUTO_OPEN__ && cache[MOVE_SBAR_ONLY] !== true ) {
			startButton.open();
			cache[MOVE_SBAR_ONLY] = false;
		}
	}
}, __DELAY__);