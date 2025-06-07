import { CitySelector } from "./CitySelector";

interface Props {
  selectedCityId: number | null;
  onCityChange: (cityId: number | null) => void;
}

export const CityFilter = ({ selectedCityId, onCityChange }: Props) => {
  return (
    <div className="mb-6 max-w-md mx-auto">
      <div className="bg-gray-800/50 border border-white/10 rounded-lg p-4">
        <label htmlFor="city-filter" className="block mb-2 font-medium text-gray-300">
          Filter by City
        </label>
        <CitySelector
          selectedCityId={selectedCityId}
          onCityChange={onCityChange}
          placeholder="-- All Cities --"
          className="w-full border border-white/10 bg-transparent p-2 rounded text-white"
        />
        {selectedCityId && (
          <button
            onClick={() => onCityChange(null)}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Clear filter
          </button>
        )}
      </div>
    </div>
  );
};