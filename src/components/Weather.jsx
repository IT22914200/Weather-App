import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import humidity_icon from '../assets/humidity.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'

const Weather = () => {
  const inputRef = useRef()
  const [weatherData, setWeatherData] = useState(null)

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": cloud_icon,
    "04n": cloud_icon,
    "09d": drizzle_icon,
    "09n": drizzle_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "11d": rain_icon,
    "11n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  }

  const search = async (city) => {
    if (city === "") {
      alert("Please enter a city name")
      return
    }
    
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`
      const response = await fetch(url)
      
      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)
        setWeatherData(null)
        return
      }

      const data = await response.json()
      console.log(data)
      
      const icon = allIcons[data.weather[0].icon] || clear_icon
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temp: Math.floor(data.main.temp),
        location: data.name,
        icon: icon
      })
    } catch (error) {
      console.error("Error fetching weather data:", error)
      setWeatherData(null)
      alert("Failed to fetch weather data. Please try again.")
    }
  }

  useEffect(() => {
    search("London")
  }, [])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      search(inputRef.current.value)
    }
  }

  return (
    <div className='weather'>
      <div className="search-bar">
        <input 
          ref={inputRef} 
          type="text" 
          placeholder='Search' 
          onKeyPress={handleKeyPress}
        />
        <img 
          src={search_icon} 
          alt="search" 
          onClick={() => search(inputRef.current.value)} 
          style={{ cursor: 'pointer' }}
        />
      </div>

      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="weather-icon" className='weather-icon' />
          <p className='temp'>{weatherData.temp}°c</p>
          <p className='location'>{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="humidity" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="wind-speed" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="loading">Loading weather data...</div>
      )}
    </div>
  )
}

export default Weather;