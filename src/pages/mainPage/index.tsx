// The code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react'
import { Input, Button, Modal, message } from 'antd'
import {
  EnvironmentOutlined,
  AimOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons'
import {
  postRouteSuccess,
  getRoute,
  getRouteStatusInprogress,
  getRoutesuccess,
  getRoute500,
  getRoutefailure,
} from '../../apis'
import MapComponent from './components/mapComponents'

const App: React.FC = () => {
  const [origin, setOrigin] = useState<string>('')
  const [destination, setDestination] = useState<string>('')
  const [pathCoords, setPathCoords] = useState<
    Array<{ lat: number; lng: number }>
  >([])
  const [estimatedDistance, setEstimatedDistance] = useState<number>(0)
  const [estimatedTime, setEstimatedTime] = useState<number>(0)
  const [isRouteExist, setIsRouteExist] = useState<boolean>(true)
  const RETRY_DELAY = 2000
  const MAX_RETRIES = 10
  const [messageApi, contextHolder] = message.useMessage()

  const handleReset = () => {
    setOrigin('')
    setDestination('')
  }

  //retry logic
  const getRouteWithRetry = async (token: string) => {
    let retryCount = 0
    while (retryCount < MAX_RETRIES) {
      try {
        // const response = await getRoute(token);
        const response = await getRoutesuccess()
        // const response = await getRoutefailure()
        console.log(response)

        // inprogress
        if (response?.data?.status === 'in progress') {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
          retryCount++
          continue
        }

        // failure
        if (response?.data?.status === 'failure') {
          setIsRouteExist(false)
          return response.data.error
        }

        // success
        if (response?.data?.status === 'success') {
          setIsRouteExist(true)
          return response.data
        }

        // error
        if (response?.status === 500) {
          throw response
        }
      } catch (error: any) {
        console.log('error！！', error.response.data)
      }
    }

    throw new Error('Maximum retry attempts reached')
  }

  //handle confirm button
  const getRoute = () => {
    if (!origin || !destination) {
      messageApi.error('Please input start location and destination')
      return
    }
    
    postRouteSuccess({ origin, destination }).then((res) => {
      console.log(res.data.token)
      getRouteWithRetry(res.data.token).then((res) => {
        console.log(res, 'res')
        setEstimatedDistance(res?.total_distance)
        setEstimatedTime(res?.total_time)
        const pathCoords = res?.path?.map(([lat, lng]: string[]) => ({
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        }))
        setPathCoords(pathCoords)
      })
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[700px]">
            {/* leftside */}
            <div className="w-full md:w-[40%] p-8 border-r border-gray-200">
              <h1 className="text-2xl font-bold text-gray-800 mb-8">
                route management
              </h1>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">
                  start location
                </label>
                <div className="relative">
                  <Input
                    className="h-11 pl-10 pr-4 rounded-lg border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 !rounded-button"
                    placeholder="please input start location"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    prefix={
                      <EnvironmentOutlined className="text-blue-500 absolute left-3 top-3.5" />
                    }
                    bordered
                  />
                </div>
              </div>
              <div className="mb-10">
                <label className="block text-gray-700 mb-2">destination</label>
                <div className="relative">
                  <Input
                    className="h-11 pl-10 pr-4 rounded-lg border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 !rounded-button"
                    placeholder="please input destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    prefix={
                      <AimOutlined className="text-blue-500 absolute left-3 top-3.5" />
                    }
                    bordered
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                {contextHolder}
                <Button
                  type="primary"
                  className="h-10 w-28 bg-blue-500 hover:bg-blue-600 text-white font-medium cursor-pointer whitespace-nowrap !rounded-button"
                  onClick={() => getRoute()}
                >
                  confirm
                </Button>
                <Button
                  className="h-10 w-28 border-blue-500 text-blue-500 hover:bg-blue-50 font-medium cursor-pointer whitespace-nowrap !rounded-button"
                  onClick={handleReset}
                >
                  reset
                </Button>
              </div>
              {isRouteExist ? (
                <div className="mt-10 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    route information
                  </h3>
                  <p className="text-gray-600 mb-1">
                    estimated distance:{' '}
                    <p className="font-medium">{estimatedDistance} km</p>
                  </p>
                  <p className="text-gray-600">estimated time:</p>
                  <p className="font-medium">{estimatedTime} minutes</p>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-1">
                    Location not accessible by car
                  </p>
                </div>
              )}
            </div>
            {/*rightside map area */}
            <div className="w-[600px] h-[600px] relative">
              <div className="h-full p-2">
                <div className="relative h-full rounded-lg overflow-hidden shadow-md">
                  <div className="w-full h-full object-cover">
                    <MapComponent pathCoords={pathCoords ?? []} />
                  </div>

                  {/* map control buttons */}
                  <div className="absolute right-4 bottom-4 flex flex-col bg-white rounded-lg shadow-md">
                    <button className="p-2 hover:bg-gray-100 border-b border-gray-200 cursor-pointer">
                      <PlusOutlined className="text-gray-700" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 cursor-pointer">
                      <MinusOutlined className="text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-500 text-sm">
          © 2025 route management system | current date: 2025-05-16
        </div>
      </div>
    </div>
  )
}
export default App
