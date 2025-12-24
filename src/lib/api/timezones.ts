interface TimezoneResponse {
  label: string;
  value: string;
}

export interface Timezone {
  label: string;
  value: string;
}

const TIMEZONES_URL =
  'https://raw.githubusercontent.com/Ludium-Official/ludium-skills/refs/heads/main/timezones.json';

export async function fetchTimezones(): Promise<Timezone[]> {
  try {
    const response = await fetch(TIMEZONES_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch timezones: ${response.status}`);
    }

    const timezones: TimezoneResponse[] = await response.json();
    return timezones.map((timezone) => ({
      label: timezone.label,
      value: timezone.value,
    }));
  } catch (error) {
    console.error('Error fetching timezones:', error);
    throw error;
  }
}
