// close opend folders(startButton).
// v.1.0

var startButton = LL.getEvent().getItem();

var items = startButton.getContainer().getItems();
for ( i=0; i<items.getLength(); i++ ) {
	var tmp = items.getAt(i);
	if ( tmp.getType() == 'Folder'  && tmp.isOpen() ) {
		tmp.close();
		break;
	}
}
startButton.launch();