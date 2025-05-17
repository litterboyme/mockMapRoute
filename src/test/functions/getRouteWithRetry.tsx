import { getRoute } from "../../apis";

  //retry logic
  const RETRY_DELAY = 2000
  const MAX_RETRIES = 5

  export const getRouteWithRetry = async (token: string) => {
    let retryCount = 0
    while (retryCount < MAX_RETRIES) {
      try {
        const response = await getRoute(token);
        // const response = await getRoutesuccess()
        // const response = await getRoutefailure()
        // const response = await getRouteStatusInprogress()
        console.log(response)

        // inprogress
        if (response?.data?.status === 'in progress') {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
          retryCount++
          continue
        }

        // failure
        if (response?.data?.status === 'failure') {
          // setIsRouteExist(false)
          return response.data.error
        }

        // success
        if (response?.data?.status === 'success') {
          // setIsRouteExist(true)
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
