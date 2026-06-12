import { supabase } from './supabase';
import { curriculum } from '../data/curriculum';
import { wizardTracks } from '../data/wizard';

export async function seedDatabase() {
  const results: string[] = [];

  // 1. Seed curriculum_levels
  for (const level of curriculum) {
    const { error } = await supabase.from('curriculum_levels').upsert(
      { num: level.num, name: level.name, rank: level.rank, description: level.description },
      { onConflict: 'num' }
    );
    if (error) results.push(`Level ${level.num}: ${error.message}`);
  }
  results.push(`Seeded ${curriculum.length} curriculum levels`);

  // 2. Seed missions
  let missionCount = 0;
  for (const level of curriculum) {
    for (const m of level.missions) {
      const { error } = await supabase.from('missions').upsert(
        {
          id: m.id,
          level_num: m.levelNum,
          title: m.title,
          subtitle: m.subtitle,
          category: m.category,
          xp_reward: m.xpReward,
          story: m.story,
          objective: m.objective,
          task_description: m.taskDescription,
          initial_vfs_state: m.initialVfsState ?? null,
          validation_rules: m.validationRules as any,
          hints: m.hints,
          solution_walkthrough: m.solutionWalkthrough,
          real_world_use_case: m.realWorldUseCase,
          common_mistakes: m.commonMistakes,
          debugging_tips: m.debuggingTips,
          active_incident: m.activeIncident ?? null,
        },
        { onConflict: 'id' }
      );
      if (error) results.push(`Mission ${m.id}: ${error.message}`);
      else missionCount++;
    }
  }
  results.push(`Seeded ${missionCount} missions`);

  // 3. Seed wizard_tracks
  for (const track of wizardTracks) {
    const { error } = await supabase.from('wizard_tracks').upsert(
      { id: track.id, title: track.title, description: track.description },
      { onConflict: 'id' }
    );
    if (error) results.push(`Track ${track.id}: ${error.message}`);
  }
  results.push(`Seeded ${wizardTracks.length} wizard tracks`);

  // 4. Seed wizard_modules
  let modCount = 0;
  for (const track of wizardTracks) {
    for (const mod of track.modules) {
      const { error } = await supabase.from('wizard_modules').upsert(
        { id: mod.id, track_id: track.id, title: mod.title, description: mod.description },
        { onConflict: 'id' }
      );
      if (error) results.push(`Module ${mod.id}: ${error.message}`);
      else modCount++;
    }
  }
  results.push(`Seeded ${modCount} wizard modules`);

  // 5. Seed wizard_commands (delete + re-insert for idempotency)
  let cmdCount = 0;
  for (const track of wizardTracks) {
    for (const mod of track.modules) {
      await supabase.from('wizard_commands').delete().eq('module_id', mod.id);
      for (const cmd of mod.commands) {
        const { error } = await supabase.from('wizard_commands').insert(
          {
            module_id: mod.id,
            command: cmd.command,
            description: cmd.description,
            syntax: cmd.syntax,
            syntax_parts: cmd.syntaxParts as any,
            example: cmd.example,
            example_output: cmd.exampleOutput ?? null,
            step_by_step: cmd.stepByStep,
            try_it: cmd.tryIt,
            common_flags: cmd.commonFlags as any,
          },
        );
        if (error) results.push(`Command ${cmd.command}: ${error.message}`);
        else cmdCount++;
      }
    }
  }
  results.push(`Seeded ${cmdCount} wizard commands`);

  return results;
}

export async function checkDataExists(): Promise<{ levels: boolean; tracks: boolean }> {
  const { count: levelCount } = await supabase
    .from('curriculum_levels')
    .select('*', { count: 'exact', head: true });

  const { count: trackCount } = await supabase
    .from('wizard_tracks')
    .select('*', { count: 'exact', head: true });

  return {
    levels: (levelCount ?? 0) > 0,
    tracks: (trackCount ?? 0) > 0,
  };
}
