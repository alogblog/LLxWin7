// Change Tap action.
// v.1.0


if ( 'avatar' == LL.getEvent().getItem().getLabel() ) {
	alert("Change its icon with your photo, then the round frame will be shown automatically.");
	
}
alert("Long Tap → Customize item → More → '+' → Tap gesture, and choose your own action.");

LL.getEvent().getItem().launch();