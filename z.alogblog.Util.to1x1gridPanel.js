// Utils.to1x1gridPanel.
// v.1.0

var panelName = 'date';	//prompt( ' Name of  panel to be converted into 1x1 grid size.', 'date');

var dt = LL.getCurrentDesktop();
var statusBar = dt.getItemByLabel('sBar');
var panel = statusBar.getContainer().getItemByLabel( panelName );
if ( panel ) {
	panel.setCell(0,0,1,1);

	var editor = panel.getProperties().edit();
	var box = editor.getBox('i.box');
	box.setSize( 'bl,br,bt,bb', 0 );
	box.setColor( 'c', 'ns', 0x00ffffff );
	editor.commit();

	var container = panel.getContainer();
	container.getProperties().edit()
		.setBoolean( 'gridPL', true )
		.setString( 'gridPColumnMode', 'NUM' )
		.setInteger( 'gridPColumnNum', 1 )
		.setInteger( 'gridPRowNum', 1 )
		.setInteger( 'gridLColumnNum', 1 )
		.setInteger( 'gridLRowNum', 1 )		
		.setBoolean( 's.labelVisibility', false )
		.setBoolean( 's.iconVisibility', false )
		.setBoolean( 'pinchZoomEnable', false )
		.setBoolean( 'fitDesktopToItems', true )
		.setString( 'scrollingDirection' , 'NONE' )
		.commit();

	var items = container.getItems();
	for ( i=0; i<items.getLength(); i++ ) {
		var it = items.getAt(i);
		it.setCell(0,0,1,1);
		if ( it.getType() == 'Folder' ) {
			it.setLabel('folder1x1', true);

			it.getProperties().edit()
				.setBoolean( 'f.titleVisibility', false )
				.commit();
		}
		else {
			// Normally, Shortcut or DynamicText.
			it.getProperties().edit()
				.setFloat( 's.labelFontSize', 16)
				.setBoolean( 'i.enabled', false )
				.commit();
		}
	}

	panel.getContainer().setPosition( 0, 0);

	panel.setCell(0,0,1,1);

	statusBar.getContainer().setPosition(0, 0);

}
else {
	alert( "No panel in current desktop's screen : " + panelName );
}