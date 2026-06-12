import { supabase } from './supabase';
import type { Level, Mission } from '../data/curriculum';
import type { WizardTrack, WizardModule, CommandEntry } from '../data/wizard';

function rowToMission(row: any): Mission {
  return {
    id: row.id,
    levelNum: row.level_num,
    title: row.title,
    subtitle: row.subtitle,
    category: row.category,
    xpReward: row.xp_reward,
    story: row.story,
    objective: row.objective,
    taskDescription: row.task_description,
    initialVfsState: row.initial_vfs_state ?? undefined,
    validationRules: row.validation_rules,
    hints: row.hints ?? [],
    solutionWalkthrough: row.solution_walkthrough,
    realWorldUseCase: row.real_world_use_case,
    commonMistakes: row.common_mistakes,
    debuggingTips: row.debugging_tips,
    activeIncident: row.active_incident ?? undefined,
  };
}

export async function fetchLevels(): Promise<Level[]> {
  const { data, error } = await supabase
    .from('curriculum_levels')
    .select('*')
    .order('num');

  if (error) throw error;
  if (!data || data.length === 0) return [];

  const levels: Level[] = [];
  for (const row of data) {
    const missions = await fetchMissionsForLevel(row.num);
    levels.push({
      num: row.num,
      name: row.name,
      rank: row.rank,
      description: row.description,
      missions,
    });
  }
  return levels;
}

async function fetchMissionsForLevel(levelNum: number): Promise<Mission[]> {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('level_num', levelNum)
    .order('id');

  if (error) throw error;
  return (data ?? []).map(rowToMission);
}

export async function fetchWizardTracks(): Promise<WizardTrack[]> {
  const { data: tracks, error: trackError } = await supabase
    .from('wizard_tracks')
    .select('*')
    .order('id');

  if (trackError) throw trackError;
  if (!tracks || tracks.length === 0) return [];

  const result: WizardTrack[] = [];
  for (const t of tracks) {
    const modules = await fetchModulesForTrack(t.id);
    result.push({
      id: t.id,
      title: t.title,
      description: t.description,
      modules,
    });
  }
  return result;
}

async function fetchModulesForTrack(trackId: string): Promise<WizardModule[]> {
  const { data: mods, error: modError } = await supabase
    .from('wizard_modules')
    .select('*')
    .eq('track_id', trackId)
    .order('id');

  if (modError) throw modError;
  if (!mods || mods.length === 0) return [];

  const result: WizardModule[] = [];
  for (const m of mods) {
    const commands = await fetchCommandsForModule(m.id);
    result.push({
      id: m.id,
      title: m.title,
      description: m.description,
      commands,
    });
  }
  return result;
}

async function fetchCommandsForModule(moduleId: string): Promise<CommandEntry[]> {
  const { data, error } = await supabase
    .from('wizard_commands')
    .select('*')
    .eq('module_id', moduleId)
    .order('id');

  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    command: row.command,
    description: row.description,
    syntax: row.syntax,
    syntaxParts: row.syntax_parts,
    example: row.example,
    exampleOutput: row.example_output ?? undefined,
    stepByStep: row.step_by_step,
    tryIt: row.try_it,
    commonFlags: row.common_flags,
  }));
}
