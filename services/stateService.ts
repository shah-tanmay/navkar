import { STATE_URL } from "../constants/endpoint";
import api, { apiRequest } from "../lib/axios";
import { CityOption, StateOption } from "../types/api";
import _ from "lodash";

export const getStates = async (): Promise<StateOption[]> => {
  const response = await apiRequest(() => api.get(STATE_URL));
  const states: { id: string; name: string; country: string }[] =
    response?.data.states;
  return _.map(states, (state) => {
    return {
      label: state.name,
      value: state.id,
    };
  });
};

export const getCityByStateId = async (
  stateId: number
): Promise<CityOption[]> => {
  const response = await apiRequest(() => api.get(`${STATE_URL}/${stateId}`));
  const cities: { id: string; name: string; state_id: string }[] =
    response?.data.cities;
  return _.map(cities, (city) => {
    return {
      label: city.name,
      value: city.id,
    };
  });
};
