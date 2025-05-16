import React, { useRef, useEffect } from 'react'
import { LoadScript } from '@react-google-maps/api'
import {
  EnvironmentOutlined,
  AimOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons'
import { Input } from 'antd'

const AddressInput = ({
  onPlaceSelected,
}: {
  onPlaceSelected: (
    location: { lat: number; lng: number },
    place: string
  ) => void
}) => {
  const inputRef = useRef(null)

  useEffect(() => {
    if (!window.google || !inputRef.current) return
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['address'],
      }
    )

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (place.geometry?.location) {
        const location = {
          lat: place.geometry.location?.lat(),
          lng: place.geometry.location?.lng(),
        }
        onPlaceSelected(location, place.formatted_address ?? '')
      }
    })
  }, [])

  return (
    <div className="flex  items-center border border-blue-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-400">
      <span className="text-blue-500 mr-2">
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="aim"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <defs>
            <style></style>
          </defs>
          <path d="M952 474H829.8C812.5 327.6 696.4 211.5 550 194.2V72c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v122.2C327.6 211.5 211.5 327.6 194.2 474H72c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h122.2C211.5 696.4 327.6 812.5 474 829.8V952c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V829.8C696.4 812.5 812.5 696.4 829.8 550H952c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zM512 756c-134.8 0-244-109.2-244-244s109.2-244 244-244 244 109.2 244 244-109.2 244-244 244z"></path>
          <path d="M512 392c-32.1 0-62.1 12.4-84.8 35.2-22.7 22.7-35.2 52.7-35.2 84.8s12.5 62.1 35.2 84.8C449.9 619.4 480 632 512 632s62.1-12.5 84.8-35.2C619.4 574.1 632 544 632 512s-12.5-62.1-35.2-84.8A118.57 118.57 0 00512 392z"></path>
        </svg>
      </span>
      <input
        ref={inputRef}
        placeholder="please input destination"
        className="w-full border-none focus:outline-none placeholder:text-gray-400 text-sm"
      />
    </div>
  )
}

const AddressInputAutoComplete = ({
  setPlace,
}: {
  setPlace: (place: string) => void
}) => {
  const handlePlace = (
    location: { lat: number; lng: number },
    place: string
  ) => {
    console.log('Selected location:', location)
    console.log('Full place info:', place)
    // 可将坐标传入地图或路径点等
    setPlace(place)
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <AddressInput onPlaceSelected={handlePlace} />
    </div>
  )
}

export default AddressInputAutoComplete
