const socket = io(); // Initialize Socket.IO

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            // Emit latitude and longitude to the server
            socket.emit("send location", { latitude, longitude });
        },
        (error) => {
            console.log(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

// Initialize map using Leaflet
const map = L.map("map").setView([0, 0], 10); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    subdomains: ['a', 'b', 'c']
}).addTo(map);

const markers = {}
const circles = {}

socket.on("receive-location",(data)=>{
    const {id,latitude,longitude}= data
    map.setView([latitude,longitude],16)
    if (markers[id]){
        markers[id].setLatLng([latitude,longitude])
        circles[id].setLatLng([latitude,longitude])
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map)
        circles[id]=L.circle([latitude,longitude], {
            radius: 50, // radius of the circle in meters
            color: 'blue',
            fillColor: 'blue',
            fillOpacity: 0.2
        }).addTo(map)
    }
})
socket.on("user disconnected",(id)=>{
  if(markers[id]){
    map.removeLayer(markers[id])
    delete marker[id]
    map.removeLayer(circles[id])
    delete circles[id]
  }

})
