import api from "./api";
import type { Incident, IncidentStatus } from "@/types/api";

export const getIncidents = async (): Promise<Incident[]> => {
  const res = await api.get("/incidents");
  return res.data;
};

export const assignIncident = async (id: string): Promise<Incident> => {
  const res = await api.post(`/incidents/${id}/assign`);
  return res.data;
};

export const updateIncidentStatus = async (
  id: string,
  status: IncidentStatus
): Promise<Incident> => {
  const res = await api.patch(`/incidents/${id}/status`, { status });
  return res.data;
};

export const addIncidentNote = async (
  id: string,
  text: string
): Promise<Incident> => {
  const res = await api.post(`/incidents/${id}/notes`, { text });
  return res.data;
};
