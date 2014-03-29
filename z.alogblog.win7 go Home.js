// win7 go Home.

var EPS_Y = 5;

var dt = LL.getCurrentDesktop();
dt.setPosition(0, Math.floor( dt.getPositionY() ) < EPS_Y ? dt.getCellHeight() : 0 );