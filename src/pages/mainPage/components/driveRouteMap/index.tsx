// DriveRouteMap.tsx for the drive route map
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api'
import React, { useState, useEffect } from 'react'

const containerStyle = {
  width: '100%',
  height: '500px',
}

const DriveRouteMap = ({
  waypoints,
}: {
  waypoints: { lat: number; lng: number }[]
}) => {
  const [directions, setDirections] = useState(null)

  useEffect(() => {
    if (waypoints.length < 2 || !window.google) return

    const directionsService = new google.maps.DirectionsService()

    const origin = waypoints[0]
    const destination = waypoints[waypoints.length - 1]
    const intermediate = waypoints
      .slice(1, -1)
      .map((coord) => ({ location: coord }))

    directionsService.route(
      {
        origin,
        destination,
        waypoints: intermediate,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result)
        } else {
          console.error('Directions request failed:', status)
        }
      }
    )
  }, [waypoints])

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={waypoints[0] || { lat: 22.3, lng: 114.1 }}
      zoom={12}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  )
}

export default DriveRouteMap
