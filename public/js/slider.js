function slide() {
  var slider = document.getElementById("searchTerm");
  document.getElementById("demo").innerHTML = slider.value;
}

window.addEventListener('load', (event) => {
    document.getElementById("demo").innerHTML = 50;
});
