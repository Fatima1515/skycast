"use client";

import { useState } from "react";

export default function Page() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [error, setError] = useState("");

  const API_KEY = "3266294a54069c69430c2e44b5fd1b2f";

  async function getWeather() {
    if (!city) return;

    try {
      setError("");
      setWeather(null);
      setForecast([]);

      // GET CURRENT WEATHER
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) {
        setError("City not found");
        return;
      }

      const data = await res.json();
      setWeather(data);

      // GET 5-DAY FORECAST
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      const forecastData = await forecastRes.json();

      const daily = forecastData.list.filter((item: any) =>
        item.dt_txt.includes("12:00:00")
      );

      setForecast(daily);
    } catch {
      setError("Something went wrong.");
    }
  }

  return (
    <div
      className="min-h-screen p-8 flex flex-col items-center"
      style={{
        background: "linear-gradient(to bottom right, #fbc2eb, #a6c1ee)",
      }}
    >
      {/* HEADER */}
      <h1 className="text-5xl font-bold mb-10 flex items-center gap-3 text-gray-900 drop-shadow-md">
        🌤️ SkyCast
      </h1>

      {/* SEARCH BAR */}
      <div className="flex gap-3 w-full max-w-md mb-8">
        <input
          className="w-full rounded-2xl px-5 py-3 text-lg shadow-lg border border-white/40 bg-white/50 backdrop-blur-xl focus:outline-none"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          onClick={getWeather}
          className="px-6 py-3 rounded-2xl text-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-red-700 text-lg font-semibold mb-4">{error}</p>
      )}

      {/* CURRENT WEATHER CARD */}
      {weather && (
        <div
          className="w-full max-w-md p-8 rounded-3xl shadow-2xl mb-12 text-white"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(255,255,255,0.35), rgba(255,255,255,0.15))",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.4)",
          }}
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            {weather.name}, {weather.sys.country}
          </h2>

          {/* EVERYTHING ALIGNED PERFECTLY IN ONE COLUMN */}
          <div className="flex flex-col items-start gap-3 text-gray-900">
            {/* description */}
            <p className="text-xl capitalize">{weather.weather[0].description}</p>

            {/* temperature */}
            <p className="text-6xl font-extrabold">{Math.round(weather.main.temp)}°C</p>

            {/* humidity */}
            <div className="flex items-center gap-2 text-blue-700 text-xl">
              💧 <span className="font-semibold">{weather.main.humidity}%</span>
            </div>

            {/* wind */}
            <div className="flex items-center gap-2 text-purple-700 text-xl">
              🌬 <span className="font-semibold">{weather.wind.speed} m/s</span>
            </div>
          </div>
        </div>
      )}

      {/* 5-DAY FORECAST */}
      {forecast.length > 0 && (
        <div className="w-full max-w-4xl">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 text-center drop-shadow-md">
            5-Day Forecast
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {forecast.map((day: any, i: number) => (
              <div
                key={i}
                className="p-5 rounded-3xl text-center shadow-xl hover:scale-105 transition cursor-pointer"
                style={{
                  background:
                    "linear-gradient(to bottom right, rgba(255,255,255,0.45), rgba(255,255,255,0.25))",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                }}
              >
                <p className="font-semibold text-gray-800 text-lg">
                  {new Date(day.dt_txt).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>

                <p className="text-5xl my-3">
                  {day.weather[0].main === "Clouds" && "☁️"}
                  {day.weather[0].main === "Clear" && "☀️"}
                  {day.weather[0].main === "Rain" && "🌧️"}
                  {day.weather[0].main === "Snow" && "❄️"}
                  {day.weather[0].main === "Fog" && "🌫️"}
                </p>

                <p className="capitalize text-gray-700 text-sm mb-3">
                  {day.weather[0].description}
                </p>

                <p className="text-3xl font-bold text-gray-900">
                  {Math.round(day.main.temp)}°C
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
