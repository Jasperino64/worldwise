import { createContext, useEffect, useContext, useReducer } from "react";

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    case "city/loaded":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "loading":
      return { ...state, isLoading: true };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
};

function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [currentCity, setCurrentCity] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, isLoading, currentCity } = state;

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        console.error("Error fetching cities:", error);
        dispatch({ type: "rejected", payload: error.message });
      }
    }

    fetchCities();
  }, [dispatch]);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;
    try {
      dispatch({ type: "loading" });
      console.log(`${BASE_URL}/cities/${id}`);
      const response = await fetch(`${BASE_URL}/cities/${id}`);

      const data = await response.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (error) {
      console.error("Error fetching city:", error);
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const response = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });
      const data = await response.json();
      dispatch({ type: "city/created", payload: data });
    } catch (error) {
      alert("Error creating city:", error.message);
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      alert("Error deleting city:", error);
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
}

export { CitiesProvider, useCities };
