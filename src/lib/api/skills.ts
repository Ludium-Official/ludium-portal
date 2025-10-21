interface SkillResponse {
  name: string;
}

export interface Skill {
  name: string;
}

const SKILLS_URL =
  "https://raw.githubusercontent.com/Ludium-Official/ludium-skills/refs/heads/main/skills.json";

export async function fetchSkills(): Promise<Skill[]> {
  try {
    const response = await fetch(SKILLS_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch skills: ${response.status}`);
    }

    const skills: SkillResponse[] = await response.json();
    return skills.map((skill) => ({
      name: skill.name,
    }));
  } catch (error) {
    console.error("Error fetching skills:", error);
    throw error;
  }
}
