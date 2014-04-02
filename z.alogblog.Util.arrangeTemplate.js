// Util.arrangeTemplate.
// v.1.0

////////////////////////////////////////////////////////////////
// - In both landscape and portrait mode, this script must be run.
// - In grid(0,0) topleft cell, an item should be present.(for position changed event)
////////////////////////////////////////////////////////////////

////////////////////
// Define CONSTANTS.
////////////////////

// Desktop Grid. ( 10x6 or 6x10 )
var LONG = 10;
var SHORT = 6;
var EPS_Y = 5;

var RIGHT = 0;
var LEFT = 1;
var MODE_LAND = 0;
var MODE_PORT = 1;
var PH = 'Ph';
var PX = 'Px';
var PY = 'Py';
var PX2 = 'Px2';
var PY2 = 'Py2';
var LH = 'Lh';
var LX = 'Lx';
var LY = 'Ly';
var LX2 = 'Lx2';
var LY2 = 'Ly2';

var WIN7_DESKTOP = 'w7dt';
var START_BUTTON = 'sBtn';
var STATUS_BAR = 'sBar';
var SSTATUS_BAR = 'ssBar';	// 8x1 or 4x1 sub panel in statusbar.
var PANEL1x1 = 'date';
var FOLDER_IN_PANEL1x1 = 'folder1x1';
var PKG = 'alogblog';

// LL properties.
var START_POPUP_DEFAULT_POS = RIGHT;
var SLIDE_FROM_LEFT = "SLIDE_FROM_LEFT";
var SLIDE_FROM_RIGHT = "SLIDE_FROM_RIGHT";
var F_ANIMATIONIN = "f.animationIn";
var F_ANIMATIONOUT = "f.animationOut";
var DUAL_POSITION = 'allowDualPosition';
var F_WX = "f.wX";
var F_WY = "f.wY";
var F_WW = "f.wW";
var F_WH = "f.wH";
var F_WAH = "f.wAH";
var FOLDER_TYPE = 'Folder';
var PANEL_TYPE = 'Panel';

// Local variables.
var dt, statusBar, startButton, datePanel, dtHeight, dtWidth;
var statusBarHeight, startPopupWidth, startPopupHeight, startPopupPos;
var statusBarContainer, startButtonPopupYfromTop, mode, colNum;
var dirIn, dirOut, fwAH, gridLColumnNum, gridPColumnNum;
var subFolderXfromLeft, items, i, it, folder1x1, tag;
var folder1x1XfromLeft, folder1x1YfromTop, fc, box, editor;

function initialize() {

	gridLColumnNum = LONG;
	gridPColumnNum = SHORT;

	dt = LL.getCurrentDesktop();
	statusBar = dt.getItemByLabel(STATUS_BAR);
	statusBarContainer = statusBar.getContainer();
	startButton = statusBarContainer.getItemByLabel(START_BUTTON);
	datePanel = statusBarContainer.getItemByLabel(PANEL1x1);

	dtHeight = dt.getHeight();
	dtWidth = dt.getWidth();
	statusBarHeight = dt.getCellHeight();

	statusBarContainer.getProperties().edit().setBoolean( DUAL_POSITION, true ).commit();
	
	// Uninitialed folder object problem hack.(open folders beforehand).
	//dt.setPosition(0, Math.floor( dt.getPositionY() ) < EPS_Y ? dt.getCellHeight() : 0 );
	dt.setPosition(0, dt.getCellHeight() );
	datePanel.getContainer().getItemByLabel(FOLDER_IN_PANEL1x1).open();
}

function getInputFromUser() {

	startPopupWidth = startButton.getProperties().getInteger(F_WW);
	startPopupHeight = startButton.getProperties().getInteger(F_WH);

	startPopupWidth = prompt("Width of 'START' popup window", startPopupWidth );
	startPopupHeight = prompt("Height of 'START' popup window", startPopupHeight);
	startPopupPos = confirm("'START' button to RIGHT side(Cancel means 'LEFT')?") ? START_POPUP_DEFAULT_POS : LEFT;

	// Calc some values.
	startButtonPopupYfromTop = Math.round(dtHeight - startPopupHeight - statusBarHeight);
	subFolderXfromLeft = ( startPopupPos == RIGHT ? dtWidth - startPopupWidth  : 0 );

	mode = ( dtHeight > dtWidth ? MODE_PORT : MODE_LAND );	
	colNum = ( mode == MODE_PORT ? gridPColumnNum : gridLColumnNum );
}

function arrangeStartButtonAndDatePanel() {

	if( startPopupPos == RIGHT ) {
		startButton.setCell( colNum-1, 0, colNum, 1 );
		datePanel.setCell( 0, 0, 1, 1 );
		
		dirIn = SLIDE_FROM_RIGHT;
		dirOut = SLIDE_FROM_LEFT;
		fwAH = 'RIGHT';
	}
	else {
		// Locate START/Date button ITSELF.
		startButton.setCell( 0, 0, 1, 1 );
		datePanel.setCell( colNum-1, 0, colNum, 1 );
/*
var dc = datePanel.getCell();
var sc = startButton.getCell();
alert( dc + "/" + sc + '/' + colNum);
datePanel.setCell( 1, 0, 2, 1 );
startButton.setCell( 2, 0, 3, 1 );
*/
		dirIn = SLIDE_FROM_LEFT;
		dirOut = SLIDE_FROM_RIGHT;
		fwAH = 'CUSTOM'
	}

	// arrange Start button's FOLDER position&size
	startButton.getProperties().edit()
		.setString(F_WAH, fwAH)
		.setInteger(F_WX, 0)
		.setInteger(F_WY, startButtonPopupYfromTop)
		.setInteger(F_WW, startPopupWidth)
		.setInteger(F_WH, startPopupHeight)
		.setString(F_ANIMATIONIN, dirIn)
		.setString(F_ANIMATIONOUT, dirOut)
		.commit();
}

function arrangeStartSubFolders() {

	items = startButton.getContainer().getItems();
	for (i=0; i< items.getLength(); i++) {
		it = items.getAt(i);
		if ( it.getType() == FOLDER_TYPE ) {
			it.getProperties().edit()
				.setInteger(F_WX, subFolderXfromLeft)
				.setInteger(F_WY, startButtonPopupYfromTop)
				.setInteger(F_WW, Math.round(startPopupWidth*2/3))
				.setInteger(F_WH, startPopupHeight)
				.setString(F_ANIMATIONIN, dirIn)
				.setString(F_ANIMATIONOUT, dirOut)
				.commit();
		}
	}
}

function arrangeFolderIn1x1Panel() {

	// Assume many 1x1 panels in statusBar.
	items = statusBarContainer.getItems();
	for ( i=0; i<items.getLength(); i++ ) {
		it = items.getAt(i);
		if ( it.getType() == PANEL_TYPE && it.getLabel() != SSTATUS_BAR ) {
			folder1x1 = it.getContainer().getItemByLabel(FOLDER_IN_PANEL1x1);
			if ( folder1x1 ) {
				folder1x1.open();	// Uninitialized problem hack.
				fc = folder1x1.getContainer();
				folder1x1XfromLeft = Math.round( startPopupPos == RIGHT ? 0: dtWidth - fc.getWidth() );
				folder1x1YfromTop  = Math.round( dtHeight - statusBarHeight - fc.getHeight() );
				editor = folder1x1.getProperties().edit();
				box = editor.getBox('f.box');
				box.setSize('pl,pt,pr,pb', 0);
				box.setSize('ml,mt,mr,mb', 0);
				editor.commit();

				folder1x1.getProperties().edit()
					.setInteger(F_WX, folder1x1XfromLeft)
					.setInteger(F_WY, folder1x1YfromTop)
					.setString(F_ANIMATIONIN, dirOut)
					.setString(F_ANIMATIONOUT, dirIn)
					.commit();
				fc.getProperties().edit()
					.setBoolean('useDesktopSize', false)	// Later, confirm this method
					.setInteger('gridPColumnNum', 4)
					.setInteger('gridPRowNum', 3)
					.commit();
			}
		}
	}
}

// Save vars to statusBar for using in rotation events.
function saveDataToItem() {

	try {
		tag = JSON.parse(statusBar.getTag());
		if ( tag == null ) throw '';
	} catch(e) {
		tag = new Object();
	}

	if ( self[PKG] == null ) {
		self[PKG] = new Object();
	}

	if ( mode == MODE_PORT ) {
		tag[PH] = self[PKG][PH] = statusBarHeight;
		tag[PX] = self[PKG][PX] = subFolderXfromLeft;
		tag[PY] = self[PKG][PY] = startButtonPopupYfromTop;
		tag[PX2] = self[PKG][PX2] = folder1x1XfromLeft;
		tag[PY2] = self[PKG][PY2] = folder1x1YfromTop;
	}
	else {
		tag[LH] = self[PKG][LH] = statusBarHeight;
		tag[LX] = self[PKG][LX] = subFolderXfromLeft;
		tag[LY] = self[PKG][LY] = startButtonPopupYfromTop;
		tag[LX2] = self[PKG][LX2] = folder1x1XfromLeft;
		tag[LY2] = self[PKG][LY2] = folder1x1YfromTop;
	}
	statusBar.setTag( JSON.stringify(tag) );
	
	dt.setPosition(0, 0, 1, true);	
	datePanel.getContainer().getItemByLabel(FOLDER_IN_PANEL1x1).close();	
}

function main() {

	initialize();
	getInputFromUser();
	arrangeStartButtonAndDatePanel();
	arrangeStartSubFolders();
	arrangeFolderIn1x1Panel();
	saveDataToItem();
}

main();