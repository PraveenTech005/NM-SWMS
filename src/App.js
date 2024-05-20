import React, { useState, useEffect } from "react";
import axios from "axios";
import lazy from "./load.png"

function App() {
  // Object mapping places to their respective URLs
  const places = {
    Chennai: "https://maps.app.goo.gl/cgvyz4iR5K7CDJbJA",
    Coimbatore: "https://maps.app.goo.gl/PyNCFxjp35zXvAH79",
    Madurai: "https://maps.app.goo.gl/hJvV5creLJoRBGAV9",
  };

  // Extracting the place names and URLs into separate arrays
  let place = Object.keys(places);
  let location = Object.values(places);

  // State to hold sensor data
  const [sensors, setSensors] = useState({
    uss1: "No Data",
    uss2: "No Data",
    uss3: "No Data",
  });

  // State to hold the background color class for each sensor
  const [state, setState] = useState({
    uss1: "bg-slate-500",
    uss2: "bg-slate-500",
    uss3: "bg-slate-500",
  });

  // Effect to fetch sensor data from the server every 5 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.thingspeak.com/channels/2555475/feeds/last.json"
        );
        setSensors({
          uss1: response.data.field1,
          uss2: response.data.field2,
          uss3: response.data.field3,
        }); // Update sensor data state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch data at regular intervals
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Function to determine the sensor state text based on sensor data
  const sensorState = (data) => {
    if (data >= 300) return "Full";
    else if (data < 300 && data >= 150) return "Average";
    else if (data < 150 && data >= 0) return "Low";
    else return "Not Initialized";
  }

  // Effect to update the background color class based on sensor data
  useEffect(() => {
    const updateState = () => {
      const newState = { ...state };
      Object.keys(sensors).forEach((key) => {
        if (sensors[key] >= 300) {
          if (state[key] !== "bg-red-500") {
            newState[key] = "bg-red-500";
          }
        } else if (sensors[key] < 300 && sensors[key] >= 150) {
          if (state[key] !== "bg-yellow-500") {
            newState[key] = "bg-yellow-500";
          }
        } else if (sensors[key] < 150 && sensors[key] >= 0) {
          if (state[key] !== "bg-green-500") {
            newState[key] = "bg-green-500";
          }
        } else {
          if (state[key] !== "bg-slate-500") {
            newState[key] = "bg-slate-500";
          }
        }
      });
      setState((prev) => newState); // Update state with new background colors
    };

    updateState(); // Call the updateState function immediately
  }, [sensors, state]); // Run the effect whenever sensors state changes

  return (
    <div className="absolute w-full h-full bg-gray-800 text-white">
      <h1 className="w-full h-32 flex justify-center items-center text-2xl font-bold font-mono border-b-2 border-b-red-500 text-center">
        Smart Waste Management System Monitor
      </h1>
      <div className="h-2/3 flex flex-col justify-center items-center gap-10 mt-5 md:flex-row">
        {Object.keys(sensors).map((key, index) => (
          <div
            key={key}
            className={`w-80 h-1/4 flex justify-center items-center text-xl font-bold font-mono md:w-1/4  rounded-lg shadow-lg ${state[key]} `}
          >
            <div className="h-full w-2/12 flex justify-center items-center border-r-2 border-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </div>
            {sensorState(sensors[key]) !== "Not Initialized" ?(<div className="h-full w-8/12 text-sm flex flex-col justify-center gap-2">
              <div className="text-center">{`Bin ${index + 1}`}</div>
              <div className="flex gap-3 ml-2">
                {/* Display place name with a link to the location */}
                Location : {place[index]}
              </div>
              {/* Display the sensor state text */}
              <div className="ml-2">{`Waste Level : ${sensorState(sensors[key])}`}</div>
            </div>):(<div className="w-8/12 flex justify-center"><img loading="lazy" src={lazy} alt="loader" className="animate-spin"></img></div>)}
            <div className="h-full w-2/12">
              <a href={location[index]} className="flex justify-center items-center gap-3 w-full h-full border-l-2 border-gray-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-10 h-10"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                  </a>
            </div>
        </div>
        ))}
      </div>
    </div>
  );
}

export default App;
