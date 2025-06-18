function isInsideGeofence(latitude, longitude, geofence) {
  const { centerLat, centerLng, radiusMeters } = geofence;

  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000; // Earth radius in meters

  const dLat = toRad(latitude - centerLat);
  const dLon = toRad(longitude - centerLng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(centerLat)) *
      Math.cos(toRad(latitude)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance <= radiusMeters;
}

module.exports = { isInsideGeofence };
