// Util.showCaches.
// v.1.0

alert(LL.getCurrentDesktop().getItemByLabel('sBar').getTag());

var output = '';
for (var property in self.alogblog) {
  output += property + ': ' + self.alogblog[property]+';\n';
}
alert(output);