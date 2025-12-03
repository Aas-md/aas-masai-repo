import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [38, 38]
});

const poiIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35]
});

// ------------------------------------------------------------
// 🔥 Optimized POI Component (React.memo)
// ------------------------------------------------------------
const POI = React.memo(function POI({ poi }) {
  return (
    <Marker position={poi.position} icon={poiIcon}>
      <Popup>
        <b>{poi.name}</b>
      </Popup>
    </Marker>
  );
});

// ------------------------------------------------------------
// 🔥 APP COMPONENT
// ------------------------------------------------------------
export default function App() {
  const [userLocation, setUserLocation] = useState([28.6139, 77.2090]); // Default Delhi
  const [destination, setDestination] = useState("");
  const [routeCoords, setRouteCoords] = useState([]);
  const [poiList, setPoiList] = useState([]);
  const [weather, setWeather] = useState(null);

  // ---------------------------------------
  // 🔵 Track Real-Time User Location
  // ---------------------------------------
  useEffect(() => {
    navigator.geolocation.watchPosition((pos) => {
      setUserLocation([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  // ---------------------------------------
  // 🔍 Search Destination & Generate Route
  // ---------------------------------------
  const handleSearch = useCallback(async () => {
    if (!destination.trim()) return;

    const geo = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${destination}&format=json`
    );

    if (geo.data.length > 0) {
      const lat = parseFloat(geo.data[0].lat);
      const lon = parseFloat(geo.data[0].lon);

      const route = [
        userLocation,
        [lat, lon]
      ];
      setRouteCoords(route);
    }
  }, [destination, userLocation]);

  // ---------------------------------------
  // 🔵 Search POI Around You (Restaurants)
  // ---------------------------------------
  const searchPOI = useCallback(async () => {
    const url =
      `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=restaurant&` +
      `bounded=1&viewbox=${userLocation[1]-0.01},${userLocation[0]+0.01},${userLocation[1]+0.01},${userLocation[0]-0.01}`;

    const res = await axios.get(url);

    const formattedPOI = res.data.map((d) => ({
      name: d.display_name,
      position: [parseFloat(d.lat), parseFloat(d.lon)]
    }));

    setPoiList(formattedPOI);
  }, [userLocation]);

  // ---------------------------------------
  // 🔵 Geofencing Alert (100m radius)
  // ---------------------------------------
  useEffect(() => {
    if (!routeCoords.length) return;

    const dest = routeCoords[1];
    const distance = Math.sqrt(
      (userLocation[0] - dest[0]) ** 2 +
      (userLocation[1] - dest[1]) ** 2
    );

    if (distance < 0.001) {
      alert("You have reached the destination area!");
    }
  }, [userLocation, routeCoords]);

  // ---------------------------------------
  // 🌦 Fetch Weather (External API Example)
  // ---------------------------------------
  useEffect(() => {
    (async () => {
      const w = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${userLocation[0]}&longitude=${userLocation[1]}&current_weather=true`
      );
      setWeather(w.data.current_weather);
    })();
  }, [userLocation]);

  // ---------------------------------------
  // 🔥 Memoized Map Center
  // ---------------------------------------
  const mapCenter = useMemo(() => userLocation, [userLocation]);

  return (
    <div style={{ padding: 20 }}>
      <h2>React Map Application (Optimized)</h2>

      <p><b>Your Location:</b> {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}</p>
      <p><b>Weather:</b> {weather ? `${weather.temperature}°C` : "Loading..."}</p>

      <input
        style={{ width: "200px", padding: "8px" }}
        placeholder="Search destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <button style={{ marginLeft: 10 }} onClick={handleSearch}>
        Search Route
      </button>

      <button style={{ marginLeft: 10 }} onClick={searchPOI}>
        Search Nearby POI
      </button>

      <div style={{ height: "80vh", marginTop: 20 }}>
        <MapContainer
          center={mapCenter}
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Marker */}
          <Marker position={userLocation} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>

          {/* Route Polyline */}
          {routeCoords.length > 0 && (
            <Polyline positions={routeCoords} color="blue" />
          )}

          {/* POI List */}
          {poiList.map((poi, index) => (
            <POI key={index} poi={poi} />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
