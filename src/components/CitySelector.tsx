import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

export interface City {
  id: number;
  name: string;
  country: string;
  created_at: string;
}

interface Props {
  selectedCityId: number | null;
  onCityChange: (cityId: number | null) => void;
  placeholder?: string;
  className?: string;
}

const fetchCities = async (): Promise<City[]> => {
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data as City[];
};

export const CitySelector = ({ 
  selectedCityId, 
  onCityChange, 
  placeholder = "-- Choose a City --",
  className = ""
}: Props) => {
  const { data: cities, isLoading, error } = useQuery<City[], Error>({
    queryKey: ["cities"],
    queryFn: fetchCities,
  });
    

  if (isLoading) {
    return (
      <select disabled className={`opacity-50 ${className}`}>
        <option>Loading cities...</option>
      </select>
    );
  }

  if (error) {
    return (
      <select disabled className={`opacity-50 ${className}`}>
        <option>Error loading cities</option>
      </select>
    );
  }

  return (
    <select
      value={selectedCityId || ""}
      onChange={(e) => {
        const value = e.target.value;
        onCityChange(value ? Number(value) : null);
      }}
      className={className}
    >
      <option value="">{placeholder}</option>
      {cities?.map((city) => (
        <option key={city.id} value={city.id}>
          {city.name}, {city.country}
        </option>
      ))}
    </select>
  );
};