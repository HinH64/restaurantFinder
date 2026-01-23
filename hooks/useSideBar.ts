import { useState, useEffect, useMemo } from 'react';
import sideBarData from '../data/sideBar.json';

export interface LocationItem {
  id: string;
  zh: string;
  en: string;
  ja: string;
}

export interface Country extends LocationItem {}

export interface City extends LocationItem {
  countryId: string;
}

export interface District extends LocationItem {
  cityId: string;
}

export interface Cuisine extends LocationItem {}

export interface SideBarData {
  countries: Country[];
  cities: City[];
  districts: District[];
  cuisines: Cuisine[];
}

export interface UseSideBarReturn {
  countries: Country[];
  getCitiesByCountry: (countryZh: string) => City[];
  getDistrictsByCity: (cityZh: string) => District[];
  getAllDistricts: () => District[];
  cuisines: Cuisine[];
  isLoading: boolean;
  // Helper functions for lookups
  findCountryByName: (name: string) => Country | undefined;
  findCityByName: (name: string) => City | undefined;
  findDistrictByName: (name: string) => District | undefined;
}

export function useSideBar(): UseSideBarReturn {
  const [data, setData] = useState<SideBarData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Currently loading from JSON import
    // In the future, this can be replaced with an API call:
    // fetch('/api/locations').then(res => res.json()).then(setData)
    setData(sideBarData as SideBarData);
    setIsLoading(false);
  }, []);

  const countries = useMemo(() => data?.countries || [], [data]);
  const cuisines = useMemo(() => data?.cuisines || [], [data]);

  const getCitiesByCountry = useMemo(() => {
    return (countryName: string): City[] => {
      if (!data) return [];
      const country = data.countries.find(c => c.zh === countryName || c.en === countryName || c.ja === countryName);
      if (!country) return [];
      return data.cities.filter(city => city.countryId === country.id);
    };
  }, [data]);

  const getDistrictsByCity = useMemo(() => {
    return (cityName: string): District[] => {
      if (!data) return [];
      const city = data.cities.find(c => c.zh === cityName || c.en === cityName || c.ja === cityName);
      if (!city) return [];
      return data.districts.filter(district => district.cityId === city.id);
    };
  }, [data]);

  const getAllDistricts = useMemo(() => {
    return (): District[] => {
      return data?.districts || [];
    };
  }, [data]);

  const findCountryByName = useMemo(() => {
    return (name: string): Country | undefined => {
      return data?.countries.find(c => c.zh === name || c.en === name || c.ja === name);
    };
  }, [data]);

  const findCityByName = useMemo(() => {
    return (name: string): City | undefined => {
      return data?.cities.find(c => c.zh === name || c.en === name || c.ja === name);
    };
  }, [data]);

  const findDistrictByName = useMemo(() => {
    return (name: string): District | undefined => {
      return data?.districts.find(d => d.zh === name || d.en === name || d.ja === name);
    };
  }, [data]);

  return {
    countries,
    getCitiesByCountry,
    getDistrictsByCity,
    getAllDistricts,
    cuisines,
    isLoading,
    findCountryByName,
    findCityByName,
    findDistrictByName
  };
}
