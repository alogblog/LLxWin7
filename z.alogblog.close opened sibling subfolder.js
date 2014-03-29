// close opened sibling subfolder.

var item = LL.getEvent().getItem();
var id = item.getId();
var type= item.getType();

if ( type == 'Folder' ) {
	var items = item.getParent().getItems();
	for ( i=0; i<items.getLength(); i++ ) {
		var tmp = items.getAt(i);
		if ( tmp.getType() == 'Folder' ) {
			if ( id != tmp.getId() && tmp.isOpen() ) {
				tmp.close();
				break;
			}
		}
	}
}

if ( type != 'Panel' )
	item.launch();

