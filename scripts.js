function dropmenu() {
	document.getElementById("Dropdownid").classList.toggle("show")
}
window.onclick = function(event) {
	if (!event.target.matches('.dropbtn')) {
		var dropdowns = document.getElementsByClassName("drop-content");
		var i;
		for (i=0; i < dropdowns.lenght; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}