"use client";

import { useState } from "react";
import Link from "next/link";

type Exercise = { id: string; name: string; muscle: string; equipment: string; difficulty: string };

const MUSCLE_GROUPS = ["All", "Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Glutes", "Calves", "Full Body"];
const EQUIPMENT = ["All", "Barbell", "Dumbbell", "Cable", "Machine", "Bodyweight", "Kettlebell", "Band", "Smith Machine"];

const EXERCISES: Exercise[] = [
  { id: "e1", name: "Barbell Bench Press", muscle: "Chest", equipment: "Barbell", difficulty: "Intermediate" },
  { id: "e2", name: "Incline Dumbbell Press", muscle: "Chest", equipment: "Dumbbell", difficulty: "Intermediate" },
  { id: "e3", name: "Cable Flyes", muscle: "Chest", equipment: "Cable", difficulty: "Beginner" },
  { id: "e4", name: "Push-ups", muscle: "Chest", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "e5", name: "Chest Dips", muscle: "Chest", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: "e6", name: "Barbell Back Squat", muscle: "Legs", equipment: "Barbell", difficulty: "Intermediate" },
  { id: "e7", name: "Leg Press", muscle: "Legs", equipment: "Machine", difficulty: "Beginner" },
  { id: "e8", name: "Romanian Deadlift", muscle: "Legs", equipment: "Barbell", difficulty: "Intermediate" },
  { id: "e9", name: "Bulgarian Split Squat", muscle: "Legs", equipment: "Dumbbell", difficulty: "Advanced" },
  { id: "e10", name: "Leg Curls", muscle: "Legs", equipment: "Machine", difficulty: "Beginner" },
  { id: "e11", name: "Walking Lunges", muscle: "Legs", equipment: "Dumbbell", difficulty: "Beginner" },
  { id: "e12", name: "Deadlift", muscle: "Back", equipment: "Barbell", difficulty: "Advanced" },
  { id: "e13", name: "Barbell Row", muscle: "Back", equipment: "Barbell", difficulty: "Intermediate" },
  { id: "e14", name: "Lat Pulldown", muscle: "Back", equipment: "Cable", difficulty: "Beginner" },
  { id: "e15", name: "Pull-ups", muscle: "Back", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: "e16", name: "Seated Cable Row", muscle: "Back", equipment: "Cable", difficulty: "Beginner" },
  { id: "e17", name: "Dumbbell Rows", muscle: "Back", equipment: "Dumbbell", difficulty: "Beginner" },
  { id: "e18", name: "Overhead Press", muscle: "Shoulders", equipment: "Barbell", difficulty: "Intermediate" },
  { id: "e19", name: "Lateral Raises", muscle: "Shoulders", equipment: "Dumbbell", difficulty: "Beginner" },
  { id: "e20", name: "Face Pulls", muscle: "Shoulders", equipment: "Cable", difficulty: "Beginner" },
  { id: "e21", name: "Arnold Press", muscle: "Shoulders", equipment: "Dumbbell", difficulty: "Intermediate" },
  { id: "e22", name: "Reverse Flyes", muscle: "Shoulders", equipment: "Dumbbell", difficulty: "Beginner" },
  { id: "e23", name: "Barbell Curls", muscle: "Arms", equipment: "Barbell", difficulty: "Beginner" },
  { id: "e24", name: "Hammer Curls", muscle: "Arms", equipment: "Dumbbell", difficulty: "Beginner" },
  { id: "e25", name: "Tricep Pushdowns", muscle: "Arms", equipment: "Cable", difficulty: "Beginner" },
  { id: "e26", name: "Skull Crushers", muscle: "Arms", equipment: "Barbell", difficulty: "Intermediate" },
  { id: "e27", name: "Concentration Curls", muscle: "Arms", equipment: "Dumbbell", difficulty: "Beginner" },
  { id: "e28", name: "Overhead Tricep Extension", muscle: "Arms", equipment: "Cable", difficulty: "Beginner" },
  { id: "e29", name: "Plank", muscle: "Core", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "e30", name: "Cable Crunches", muscle: "Core", equipment: "Cable", difficulty: "Beginner" },
  { id: "e31", name: "Hanging Leg Raises", muscle: "Core", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: "e32", name: "Ab Wheel Rollout", muscle: "Core", equipment: "Bodyweight", difficulty: "Advanced" },
  { id: "e33", name: "Russian Twists", muscle: "Core", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "e34", name: "Hip Thrusts", muscle: "Glutes", equipment: "Barbell", difficulty: "Intermediate" },
  { id: "e35", name: "Glute Bridges", muscle: "Glutes", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "e36", name: "Cable Kickbacks", muscle: "Glutes", equipment: "Cable", difficulty: "Beginner" },
  { id: "e37", name: "Sumo Deadlift", muscle: "Glutes", equipment: "Barbell", difficulty: "Intermediate" },
  { id: "e38", name: "Calf Raises", muscle: "Calves", equipment: "Machine", difficulty: "Beginner" },
  { id: "e39", name: "Seated Calf Raises", muscle: "Calves", equipment: "Machine", difficulty: "Beginner" },
  { id: "e40", name: "Burpees", muscle: "Full Body", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: "e41", name: "Kettlebell Swings", muscle: "Full Body", equipment: "Kettlebell", difficulty: "Intermediate" },
  { id: "e42", name: "Clean and Press", muscle: "Full Body", equipment: "Barbell", difficulty: "Advanced" },
  { id: "e43", name: "Thrusters", muscle: "Full Body", equipment: "Barbell", difficulty: "Advanced" },
  { id: "e44", name: "Turkish Get-up", muscle: "Full Body", equipment: "Kettlebell", difficulty: "Advanced" },
  { id: "e45", name: "Smith Machine Squat", muscle: "Legs", equipment: "Smith Machine", difficulty: "Beginner" },
  { id: "e46", name: "Band Pull-aparts", muscle: "Shoulders", equipment: "Band", difficulty: "Beginner" },
  { id: "e47", name: "Banded Hip Abduction", muscle: "Glutes", equipment: "Band", difficulty: "Beginner" },
  { id: "e48", name: "Goblet Squat", muscle: "Legs", equipment: "Kettlebell", difficulty: "Beginner" },
  { id: "e49", name: "Chest Press Machine", muscle: "Chest", equipment: "Machine", difficulty: "Beginner" },
  { id: "e50", name: "Smith Machine Bench", muscle: "Chest", equipment: "Smith Machine", difficulty: "Beginner" },
];

const difficultyColors: Record<string, string> = {
  Beginner: "bg-[#E2F4A6]/20 text-[#E2F4A6]",
  Intermediate: "bg-[#5A4EFF]/20 text-[#5A4EFF]",
  Advanced: "bg-[#EEA0FF]/20 text-[#EEA0FF]",
};

const muscleColors: Record<string, string> = {
  Chest: "from-red-500/20 to-red-600/10",
  Back: "from-blue-500/20 to-blue-600/10",
  Shoulders: "from-yellow-500/20 to-yellow-600/10",
  Arms: "from-purple-500/20 to-purple-600/10",
  Legs: "from-green-500/20 to-green-600/10",
  Core: "from-orange-500/20 to-orange-600/10",
  Glutes: "from-pink-500/20 to-pink-600/10",
  Calves: "from-teal-500/20 to-teal-600/10",
  "Full Body": "from-[#5A4EFF]/20 to-[#EEA0FF]/10",
};

export default function ExerciseLibraryPage() {
  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("All");
  const [equipmentFilter, setEquipmentFilter] = useState("All");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filtered = EXERCISES.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchMuscle = muscleFilter === "All" || e.muscle === muscleFilter;
    const matchEquip = equipmentFilter === "All" || e.equipment === equipmentFilter;
    return matchSearch && matchMuscle && matchEquip;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Back */}
        <Link href="/programmes" className="inline-flex items-center gap-1 text-sm text-[#A1A1AA] hover:text-[#FAFAFA] mb-4 transition duration-100 ease-linear">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Programmes
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Exercise Library</h1>
            <p className="text-sm text-[#A1A1AA] mt-1">{EXERCISES.length} exercises available</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search exercises..." className="w-full min-h-[44px] pl-10 pr-4 bg-[#111111] border border-[#262626] rounded-xl text-[#FAFAFA] placeholder-[#71717A] text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear" />
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-6">
          <div>
            <p className="text-xs text-[#71717A] mb-2">Muscle Group</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {MUSCLE_GROUPS.map((m) => (
                <button key={m} onClick={() => setMuscleFilter(m)} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition duration-100 ease-linear ${
                  muscleFilter === m ? "bg-[#5A4EFF] text-white" : "bg-[#111111] border border-[#262626] text-[#A1A1AA] hover:text-[#FAFAFA]"
                }`}>{m}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-[#71717A] mb-2">Equipment</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {EQUIPMENT.map((eq) => (
                <button key={eq} onClick={() => setEquipmentFilter(eq)} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition duration-100 ease-linear ${
                  equipmentFilter === eq ? "bg-[#5A4EFF] text-white" : "bg-[#111111] border border-[#262626] text-[#A1A1AA] hover:text-[#FAFAFA]"
                }`}>{eq}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-[#71717A] mb-4">{filtered.length} exercise{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Exercise Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((ex, idx) => (
            <button key={ex.id} onClick={() => setSelectedExercise(ex)} className={`relative text-left bg-gradient-to-br ${muscleColors[ex.muscle] || "from-gray-500/20 to-gray-600/10"} border border-[#262626] rounded-2xl p-4 hover:border-[#5A4EFF]/50 transition duration-100 ease-linear`}>
              {idx % 3 === 0 && (
                <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-[#5A4EFF]/80">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="white"><polygon points="2,1 9,5 2,9"/></svg>
                </div>
              )}
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm text-[#FAFAFA]">{ex.name}</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-0.5 rounded-md bg-[#0A0A0A]/50 text-[#A1A1AA] text-xs">{ex.muscle}</span>
                <span className="px-2 py-0.5 rounded-md bg-[#0A0A0A]/50 text-[#A1A1AA] text-xs">{ex.equipment}</span>
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${difficultyColors[ex.difficulty]}`}>{ex.difficulty}</span>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#71717A]">
            <p>No exercises match your filters.</p>
          </div>
        )}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedExercise(null)}>
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#262626] bg-[#111111] p-6" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button onClick={() => setSelectedExercise(null)} className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg bg-[#262626] text-[#A1A1AA] hover:text-[#FAFAFA] transition duration-100 ease-linear">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Exercise name & tags */}
            <h2 className="text-xl font-bold text-[#FAFAFA] mb-3 pr-8">{selectedExercise.name}</h2>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="px-2 py-0.5 rounded-md bg-[#0A0A0A]/50 text-[#A1A1AA] text-xs">{selectedExercise.muscle}</span>
              <span className="px-2 py-0.5 rounded-md bg-[#0A0A0A]/50 text-[#A1A1AA] text-xs">{selectedExercise.equipment}</span>
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${difficultyColors[selectedExercise.difficulty]}`}>{selectedExercise.difficulty}</span>
            </div>

            {/* Video placeholder */}
            <div className="aspect-video rounded-xl border border-[#262626] bg-[#1A1A1A] flex flex-col items-center justify-center mb-5">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#5A4EFF]/20 mb-2">
                <svg width="18" height="18" viewBox="0 0 10 10" fill="#5A4EFF"><polygon points="2,1 9,5 2,9"/></svg>
              </div>
              <span className="text-xs text-[#71717A]">Demo video</span>
            </div>

            {/* Instructions */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-[#FAFAFA] mb-2">Instructions</h3>
              <ol className="list-decimal list-inside space-y-1.5 text-sm text-[#A1A1AA]">
                <li>Set up with proper form and brace your core before initiating the {selectedExercise.name.toLowerCase()}.</li>
                <li>Perform the movement through a full range of motion with controlled tempo.</li>
                <li>Return to the starting position slowly, maintaining tension throughout.</li>
              </ol>
            </div>

            {/* Muscles */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-[#FAFAFA] mb-2">Muscles Worked</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-[#71717A]">Primary:</span> <span className="text-[#FAFAFA]">{selectedExercise.muscle}</span></p>
                <p><span className="text-[#71717A]">Secondary:</span> <span className="text-[#FAFAFA]">{
                  selectedExercise.muscle === "Chest" ? "Triceps, Front Delts" :
                  selectedExercise.muscle === "Back" ? "Biceps, Rear Delts" :
                  selectedExercise.muscle === "Shoulders" ? "Traps, Triceps" :
                  selectedExercise.muscle === "Arms" ? "Forearms, Shoulders" :
                  selectedExercise.muscle === "Legs" ? "Glutes, Core" :
                  selectedExercise.muscle === "Core" ? "Hip Flexors, Lower Back" :
                  selectedExercise.muscle === "Glutes" ? "Hamstrings, Lower Back" :
                  selectedExercise.muscle === "Calves" ? "Tibialis, Ankles" :
                  "Core, Shoulders"
                }</span></p>
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-[#FAFAFA] mb-2">Common Mistakes</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-[#A1A1AA]">
                <li>Using momentum instead of controlled muscle engagement</li>
                <li>Not maintaining a neutral spine throughout the movement</li>
                <li>Shortening the range of motion to lift heavier weight</li>
              </ul>
            </div>

            {/* Variations */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#FAFAFA] mb-2">Variations</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  `Banded ${selectedExercise.name}`,
                  `Single-arm ${selectedExercise.name}`,
                  `Tempo ${selectedExercise.name}`,
                ].map((v) => (
                  <span key={v} className="px-2.5 py-1 rounded-lg border border-[#262626] bg-[#0A0A0A] text-xs text-[#A1A1AA]">{v}</span>
                ))}
              </div>
            </div>

            {/* Add to programme button */}
            <button className="w-full min-h-[44px] rounded-xl bg-[#5A4EFF] text-white font-medium hover:bg-[#4840E8] transition duration-100 ease-linear">
              Add to Programme
            </button>
          </div>
        </div>
      )}
    </div>
  );
}