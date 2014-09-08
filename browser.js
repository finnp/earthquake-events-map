var L = require('leaflet')

L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/'

var map = L.map('map')
map.setView([0, 0], 3)


var attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
 
var tiles = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
 
L.tileLayer(tiles, {
  maxZoom: 18,
  attribution: attribution
}).addTo(map)

var source = new EventSource('http://usgs-earthquakes.herokuapp.com/api/changes?data=true&style=sse&tail=1&live=true')

var earthquakekeys = []

source.addEventListener('data', function (messsage) {
  var data = JSON.parse(messsage.data).value
  if(data.coordinates && earthquakekeys.indexOf(data.key) < 0) {
    earthquakekeys.push(data.key)
    console.log('Add marker', data.coordinates)
    var marker = L.marker(data.coordinates.reverse().slice(1))
    var popover = ''
    popover += data.place + '<br>'
    popover += '<a href="' + data.url + '">More</a>'
    marker.addTo(map).bindPopup(popover)
  }
})