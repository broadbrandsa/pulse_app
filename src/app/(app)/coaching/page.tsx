"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

type Programme = {
  id: string; name: string; description: string; weeks: number;
  clients: { avatar: string }[]; totalExercises: number;
  completionRate: number; category: string; difficulty: string;
};

type Exercise = { id: string; name: string; muscle: string; equipment: string; difficulty: string };

type Resource = {
  id: string; name: string; category: string; fileType: string;
  fileSize: string; downloads: number;
};

type Meal = { name: string; time: string; calories: number; protein: number; carbs: number; fat: number; items: string[] };
type MealPlan = { day: string; meals: Meal[] };
type Client = {
  id: string; name: string; avatar: string; goal: string;
  calories: { target: number; actual: number };
  protein: { target: number; actual: number };
  carbs: { target: number; actual: number };
  fat: { target: number; actual: number };
  compliance: number; lastUpdated: string;
  mealPlan: MealPlan[];
};

// ─── Mock Data ───────────────────────────────────────────────────────────────

const PROGRAMMES: Programme[] = [
  { id: "p1", name: "Strength Foundations", description: "12-week progressive overload programme for building baseline strength.", weeks: 12, clients: [{ avatar: "TN" }, { avatar: "LM" }, { avatar: "RG" }, { avatar: "NP" }], totalExercises: 48, completionRate: 72, category: "Strength", difficulty: "Beginner" },
  { id: "p2", name: "Shred & Burn", description: "8-week fat loss programme combining HIIT and metabolic conditioning.", weeks: 8, clients: [{ avatar: "AP" }, { avatar: "CB" }], totalExercises: 36, completionRate: 85, category: "Fat Loss", difficulty: "Intermediate" },
  { id: "p3", name: "Athletic Performance", description: "16-week sport-specific training for competitive athletes.", weeks: 16, clients: [{ avatar: "BZ" }, { avatar: "JM" }, { avatar: "RG" }], totalExercises: 64, completionRate: 45, category: "Performance", difficulty: "Advanced" },
  { id: "p4", name: "Post-Rehab Return", description: "6-week gentle return to training after injury recovery.", weeks: 6, clients: [{ avatar: "LM" }], totalExercises: 24, completionRate: 90, category: "Rehab", difficulty: "Beginner" },
  { id: "p5", name: "Muscle Hypertrophy", description: "10-week bodybuilding programme focused on muscle growth.", weeks: 10, clients: [{ avatar: "TN" }, { avatar: "BZ" }, { avatar: "JM" }, { avatar: "AP" }, { avatar: "RG" }], totalExercises: 55, completionRate: 60, category: "Hypertrophy", difficulty: "Intermediate" },
  { id: "p6", name: "Mobility Mastery", description: "4-week flexibility and mobility improvement programme.", weeks: 4, clients: [{ avatar: "NP" }, { avatar: "CB" }], totalExercises: 20, completionRate: 95, category: "Mobility", difficulty: "Beginner" },
];

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

const RESOURCES: Resource[] = [
  { id: "r1", name: "Beginner Strength Training Guide", category: "Workout Guides", fileType: "PDF", fileSize: "2.4 MB", downloads: 128 },
  { id: "r2", name: "HIIT Workout Templates", category: "Workout Guides", fileType: "PDF", fileSize: "1.8 MB", downloads: 95 },
  { id: "r3", name: "Progressive Overload Handbook", category: "Workout Guides", fileType: "PDF", fileSize: "3.1 MB", downloads: 74 },
  { id: "r4", name: "Macro Counting Basics", category: "Nutrition Guides", fileType: "PDF", fileSize: "1.2 MB", downloads: 156 },
  { id: "r5", name: "Meal Prep Blueprint", category: "Nutrition Guides", fileType: "PDF", fileSize: "2.8 MB", downloads: 112 },
  { id: "r6", name: "Supplement Guide", category: "Nutrition Guides", fileType: "PDF", fileSize: "900 KB", downloads: 67 },
  { id: "r7", name: "New Client Welcome Pack", category: "Onboarding", fileType: "PDF", fileSize: "4.2 MB", downloads: 203 },
  { id: "r8", name: "Training Agreement Template", category: "Onboarding", fileType: "DOCX", fileSize: "340 KB", downloads: 189 },
  { id: "r9", name: "Foam Rolling Protocols", category: "Recovery", fileType: "PDF", fileSize: "1.5 MB", downloads: 84 },
  { id: "r10", name: "Sleep & Recovery Guide", category: "Recovery", fileType: "PDF", fileSize: "2.1 MB", downloads: 91 },
  { id: "r11", name: "Stretching Routines", category: "Recovery", fileType: "PDF", fileSize: "1.7 MB", downloads: 103 },
  { id: "r12", name: "Progress Tracking Workbook", category: "Client Handbooks", fileType: "XLSX", fileSize: "560 KB", downloads: 145 },
  { id: "r13", name: "Exercise Technique Cards", category: "Client Handbooks", fileType: "PDF", fileSize: "5.3 MB", downloads: 178 },
  { id: "r14", name: "Goal Setting Worksheet", category: "Client Handbooks", fileType: "PDF", fileSize: "420 KB", downloads: 132 },
];

const INITIAL_CLIENTS: Client[] = [
  {
    id: "c1", name: "Thando Nkosi", avatar: "TN", goal: "Muscle Gain",
    calories: { target: 2800, actual: 2650 }, protein: { target: 180, actual: 165 },
    carbs: { target: 320, actual: 300 }, fat: { target: 80, actual: 75 },
    compliance: 92, lastUpdated: "Today",
    mealPlan: [{ day: "Monday", meals: [
      { name: "Breakfast", time: "07:00", calories: 650, protein: 40, carbs: 70, fat: 20, items: ["Oats with banana", "Protein shake", "Peanut butter toast"] },
      { name: "Lunch", time: "12:00", calories: 800, protein: 50, carbs: 90, fat: 25, items: ["Grilled chicken breast", "Brown rice", "Mixed vegetables", "Avocado"] },
      { name: "Snack", time: "15:00", calories: 350, protein: 30, carbs: 40, fat: 10, items: ["Greek yogurt", "Mixed nuts", "Apple"] },
      { name: "Dinner", time: "19:00", calories: 850, protein: 60, carbs: 80, fat: 25, items: ["Salmon fillet", "Sweet potato", "Broccoli", "Olive oil drizzle"] },
    ]}],
  },
  {
    id: "c2", name: "Lerato Mokoena", avatar: "LM", goal: "Fat Loss",
    calories: { target: 1800, actual: 1750 }, protein: { target: 140, actual: 135 },
    carbs: { target: 180, actual: 170 }, fat: { target: 60, actual: 58 },
    compliance: 88, lastUpdated: "Today",
    mealPlan: [{ day: "Monday", meals: [
      { name: "Breakfast", time: "07:30", calories: 400, protein: 35, carbs: 40, fat: 12, items: ["Egg white omelette", "Whole wheat toast", "Berries"] },
      { name: "Lunch", time: "12:30", calories: 550, protein: 45, carbs: 50, fat: 18, items: ["Turkey wrap", "Side salad", "Hummus"] },
      { name: "Dinner", time: "18:30", calories: 600, protein: 50, carbs: 55, fat: 20, items: ["Lean beef stir-fry", "Basmati rice", "Steamed veggies"] },
    ]}],
  },
  {
    id: "c3", name: "Ryan Govender", avatar: "RG", goal: "Performance",
    calories: { target: 3200, actual: 2900 }, protein: { target: 200, actual: 175 },
    carbs: { target: 400, actual: 350 }, fat: { target: 90, actual: 82 },
    compliance: 78, lastUpdated: "Yesterday",
    mealPlan: [{ day: "Monday", meals: [
      { name: "Breakfast", time: "06:00", calories: 800, protein: 50, carbs: 100, fat: 22, items: ["4 eggs scrambled", "Oatmeal", "Orange juice", "Banana"] },
      { name: "Lunch", time: "12:00", calories: 900, protein: 60, carbs: 110, fat: 25, items: ["Double chicken breast", "Pasta", "Green beans"] },
      { name: "Snack", time: "16:00", calories: 500, protein: 40, carbs: 50, fat: 15, items: ["Protein bar", "Rice cakes", "Almond butter"] },
      { name: "Dinner", time: "19:30", calories: 900, protein: 55, carbs: 100, fat: 28, items: ["Steak", "Mashed potato", "Salad", "Bread roll"] },
    ]}],
  },
  {
    id: "c4", name: "Naledi Phiri", avatar: "NP", goal: "Maintenance",
    calories: { target: 2200, actual: 2180 }, protein: { target: 130, actual: 128 },
    carbs: { target: 260, actual: 255 }, fat: { target: 70, actual: 68 },
    compliance: 96, lastUpdated: "Today",
    mealPlan: [{ day: "Monday", meals: [
      { name: "Breakfast", time: "08:00", calories: 500, protein: 30, carbs: 60, fat: 15, items: ["Smoothie bowl", "Granola", "Fresh fruit"] },
      { name: "Lunch", time: "13:00", calories: 700, protein: 45, carbs: 80, fat: 22, items: ["Fish tacos", "Black beans", "Coleslaw"] },
      { name: "Dinner", time: "19:00", calories: 700, protein: 40, carbs: 80, fat: 22, items: ["Chicken curry", "Jasmine rice", "Naan bread"] },
    ]}],
  },
  {
    id: "c5", name: "Aisha Patel", avatar: "AP", goal: "Fat Loss",
    calories: { target: 1600, actual: 1450 }, protein: { target: 120, actual: 110 },
    carbs: { target: 160, actual: 140 }, fat: { target: 55, actual: 48 },
    compliance: 82, lastUpdated: "2 days ago",
    mealPlan: [{ day: "Monday", meals: [
      { name: "Breakfast", time: "07:00", calories: 350, protein: 28, carbs: 35, fat: 12, items: ["Cottage cheese", "Berries", "Flaxseed"] },
      { name: "Lunch", time: "12:00", calories: 500, protein: 40, carbs: 45, fat: 18, items: ["Grilled chicken salad", "Quinoa", "Dressing on side"] },
      { name: "Dinner", time: "18:00", calories: 500, protein: 38, carbs: 50, fat: 16, items: ["Baked cod", "Roasted vegetables", "Couscous"] },
    ]}],
  },
  {
    id: "c6", name: "Bongani Zulu", avatar: "BZ", goal: "Muscle Gain",
    calories: { target: 3000, actual: 2400 }, protein: { target: 190, actual: 150 },
    carbs: { target: 350, actual: 280 }, fat: { target: 85, actual: 65 },
    compliance: 65, lastUpdated: "3 days ago",
    mealPlan: [{ day: "Monday", meals: [
      { name: "Breakfast", time: "08:00", calories: 600, protein: 40, carbs: 70, fat: 18, items: ["Protein pancakes", "Maple syrup", "Mixed berries"] },
      { name: "Lunch", time: "13:00", calories: 750, protein: 50, carbs: 85, fat: 22, items: ["Beef burger patty", "Brown rice", "Steamed vegetables"] },
      { name: "Dinner", time: "19:00", calories: 800, protein: 55, carbs: 90, fat: 25, items: ["Lamb chops", "Roast potatoes", "Green salad"] },
    ]}],
  },
];

// ─── Constants ───────────────────────────────────────────────────────────────

const PROGRAMME_CATEGORIES = ["Strength", "Fat Loss", "Performance", "Hypertrophy", "Mobility", "Rehab", "HIIT"] as const;
const PROGRAMME_DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;

const MUSCLE_GROUPS = ["All", "Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Glutes", "Calves", "Full Body"];
const EQUIPMENT = ["All", "Barbell", "Dumbbell", "Cable", "Machine", "Bodyweight", "Kettlebell", "Band", "Smith Machine"];

const RESOURCE_CATEGORIES = ["Workout Guides", "Nutrition Guides", "Onboarding", "Recovery", "Client Handbooks"];

const GOALS = ["Muscle Gain", "Fat Loss", "Performance", "Maintenance"] as const;

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

const goalColors: Record<string, string> = {
  "Muscle Gain": "bg-[#5A4EFF]/20 text-[#5A4EFF]",
  "Fat Loss": "bg-[#EEA0FF]/20 text-[#EEA0FF]",
  Performance: "bg-[#E2F4A6]/20 text-[#E2F4A6]",
  Maintenance: "bg-[#A1A1AA]/20 text-[#A1A1AA]",
};

const fileTypeIcons: Record<string, { bg: string; text: string }> = {
  PDF: { bg: "bg-red-500/20", text: "text-red-400" },
  DOCX: { bg: "bg-blue-500/20", text: "text-blue-400" },
  XLSX: { bg: "bg-green-500/20", text: "text-green-400" },
};

const MOCK_CLIENTS_LIST = ["Thando", "Craig", "Zanele", "Annelize", "Ayanda"];

const RESOURCE_CATEGORY_OPTIONS = ["Workout Guides", "Nutrition Guides", "Onboarding Documents", "Recovery & Mobility", "Client Handbooks"];
const FILE_TYPE_OPTIONS = ["PDF", "Video", "Image"];

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* Inline SVG icon components */
function SendIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function DownloadIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

/* Reusable Send Modal */
function SendModal({ title, itemName, onClose, onSend }: { title: string; itemName: string; onClose: () => void; onSend: (client: string) => void }) {
  const [selectedClient, setSelectedClient] = useState(MOCK_CLIENTS_LIST[0]);
  const [method, setMethod] = useState<"whatsapp" | "email">("whatsapp");

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-[#FAFAFA] mb-1">{title}</h2>
        <p className="text-sm text-[#A1A1AA] mb-4">{itemName}</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-1">Select Client</label>
            <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] min-h-[44px] px-4 text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear appearance-none">
              {MOCK_CLIENTS_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2">Send via</label>
            <div className="flex gap-2">
              <button onClick={() => setMethod("whatsapp")} className={`flex-1 min-h-[44px] rounded-xl text-sm font-medium transition duration-100 ease-linear ${method === "whatsapp" ? "bg-[#22C55E] text-white" : "bg-[#0A0A0A] border border-[#262626] text-[#A1A1AA] hover:text-[#FAFAFA]"}`}>WhatsApp</button>
              <button onClick={() => setMethod("email")} className={`flex-1 min-h-[44px] rounded-xl text-sm font-medium transition duration-100 ease-linear ${method === "email" ? "bg-[#5A4EFF] text-white" : "bg-[#0A0A0A] border border-[#262626] text-[#A1A1AA] hover:text-[#FAFAFA]"}`}>Email</button>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 min-h-[44px] px-4 bg-[#0A0A0A] border border-[#262626] text-[#FAFAFA] rounded-xl font-medium hover:bg-[#1a1a1a] transition duration-100 ease-linear text-sm">Cancel</button>
          <button onClick={() => onSend(selectedClient)} className="flex-1 min-h-[44px] px-4 bg-[#5A4EFF] text-white rounded-xl font-medium hover:bg-[#4940d9] transition duration-100 ease-linear text-sm">Send</button>
        </div>
      </div>
    </div>
  );
}

/* Reusable Toast */
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#22C55E] text-white rounded-xl px-4 py-3 z-[60] text-sm font-medium shadow-lg whitespace-nowrap">
      {message}
    </div>
  );
}

// ─── Tab definitions ─────────────────────────────────────────────────────────

const TABS = [
  { key: "programmes", label: "Programmes" },
  { key: "resources", label: "Resources" },
  { key: "library", label: "Exercise Library" },
  { key: "nutrition", label: "Nutrition Plans" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ─── Shared sub-components ───────────────────────────────────────────────────

function MacroBar({ label, actual, target, color }: { label: string; actual: number; target: number; color: string }) {
  const pct = Math.min((actual / target) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#71717A]">{label}</span>
        <span className="text-[#A1A1AA]">{actual}/{target}g</span>
      </div>
      <div className="h-1.5 bg-[#262626] rounded-full">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Programmes Tab ──────────────────────────────────────────────────────────

function ProgrammesTab() {
  const [search, setSearch] = useState("");
  const [programmes, setProgrammes] = useState<Programme[]>(PROGRAMMES);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newWeeks, setNewWeeks] = useState(8);
  const [newCategory, setNewCategory] = useState<string>(PROGRAMME_CATEGORIES[0]);
  const [newDifficulty, setNewDifficulty] = useState<string>(PROGRAMME_DIFFICULTIES[0]);
  const [sendProgramme, setSendProgramme] = useState<Programme | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  const filtered = programmes.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => { setNewName(""); setNewDescription(""); setNewWeeks(8); setNewCategory(PROGRAMME_CATEGORIES[0]); setNewDifficulty(PROGRAMME_DIFFICULTIES[0]); };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newProgramme: Programme = {
      id: `p${Date.now()}`, name: newName.trim(), description: newDescription.trim(),
      weeks: newWeeks, clients: [], totalExercises: 0, completionRate: 0,
      category: newCategory, difficulty: newDifficulty,
    };
    setProgrammes([newProgramme, ...programmes]);
    resetForm();
    setShowCreateModal(false);
  };

  const stats = [
    { label: "Active Programmes", value: String(programmes.length), color: "text-[#5A4EFF]" },
    { label: "Total Clients", value: "14", color: "text-[#EEA0FF]" },
    { label: "Avg. Completion", value: "74%", color: "text-[#E2F4A6]" },
    { label: "Exercises", value: "247", color: "text-[#FAFAFA]" },
  ];

  return (
    <>
      {/* Action button */}
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowCreateModal(true)} className="min-h-[44px] px-4 bg-[#5A4EFF] text-white rounded-xl font-medium hover:bg-[#4940d9] transition duration-100 ease-linear flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Programme
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#111111] border border-[#262626] rounded-2xl p-4">
            <p className="text-xs text-[#71717A] mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search programmes..." className="w-full min-h-[44px] pl-10 pr-4 bg-[#111111] border border-[#262626] rounded-xl text-[#FAFAFA] placeholder-[#71717A] text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear" />
      </div>

      {/* Programme Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-[#111111] border border-[#262626] rounded-2xl p-5 hover:border-[#5A4EFF]/50 transition duration-100 ease-linear group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${difficultyColors[p.difficulty]}`}>{p.difficulty}</span>
              <span className="text-xs text-[#71717A]">{p.weeks} weeks</span>
            </div>
            <h3 className="font-semibold text-[#FAFAFA] mb-1 group-hover:text-[#5A4EFF] transition duration-100 ease-linear">{p.name}</h3>
            <p className="text-sm text-[#A1A1AA] mb-4 line-clamp-2">{p.description}</p>
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#71717A]">Completion</span>
                <span className="text-[#FAFAFA]">{p.completionRate}%</span>
              </div>
              <div className="h-1.5 bg-[#262626] rounded-full">
                <div className="h-full bg-[#5A4EFF] rounded-full transition-all" style={{ width: `${p.completionRate}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {p.clients.slice(0, 4).map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5A4EFF] to-[#EEA0FF] flex items-center justify-center text-white text-[10px] font-medium border-2 border-[#111111]">{c.avatar}</div>
                ))}
                {p.clients.length > 4 && <div className="w-7 h-7 rounded-full bg-[#262626] flex items-center justify-center text-[10px] text-[#71717A] border-2 border-[#111111]">+{p.clients.length - 4}</div>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#71717A]">{p.totalExercises} exercises</span>
                <button onClick={(e) => { e.stopPropagation(); setSendProgramme(p); }} className="min-h-[44px] min-w-[44px] w-8 h-8 rounded-lg bg-[#262626] flex items-center justify-center text-[#A1A1AA] hover:text-[#FAFAFA] transition duration-100 ease-linear" title="Send Programme">
                  <SendIcon />
                </button>
                <button onClick={(e) => { e.stopPropagation(); downloadTextFile(`${p.name.replace(/\s+/g, "_")}.txt`, `Programme: ${p.name}\nDescription: ${p.description}\nDuration: ${p.weeks} weeks\nCategory: ${p.category}\nDifficulty: ${p.difficulty}\nTotal Exercises: ${p.totalExercises}\nCompletion Rate: ${p.completionRate}%`); }} className="min-h-[44px] min-w-[44px] w-8 h-8 rounded-lg bg-[#262626] flex items-center justify-center text-[#A1A1AA] hover:text-[#FAFAFA] transition duration-100 ease-linear" title="Download Programme">
                  <DownloadIcon />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Programme Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">Create Programme</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-1">Programme Name *</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Strength Foundations" className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] min-h-[44px] px-4 text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear placeholder-[#71717A]" />
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-1">Description</label>
                <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Brief description of the programme..." rows={3} className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] px-4 py-3 text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear placeholder-[#71717A] resize-none" />
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-1">Duration (weeks)</label>
                <input type="number" value={newWeeks} onChange={(e) => setNewWeeks(Math.max(1, parseInt(e.target.value) || 1))} min={1} className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] min-h-[44px] px-4 text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear" />
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-1">Category</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] min-h-[44px] px-4 text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear appearance-none">
                  {PROGRAMME_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-1">Difficulty</label>
                <select value={newDifficulty} onChange={(e) => setNewDifficulty(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] min-h-[44px] px-4 text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear appearance-none">
                  {PROGRAMME_DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { resetForm(); setShowCreateModal(false); }} className="flex-1 min-h-[44px] px-4 bg-[#0A0A0A] border border-[#262626] text-[#FAFAFA] rounded-xl font-medium hover:bg-[#1a1a1a] transition duration-100 ease-linear text-sm">Cancel</button>
              <button onClick={handleCreate} disabled={!newName.trim()} className="flex-1 min-h-[44px] px-4 bg-[#5A4EFF] text-white rounded-xl font-medium hover:bg-[#4940d9] transition duration-100 ease-linear text-sm disabled:opacity-50 disabled:cursor-not-allowed">Save Programme</button>
            </div>
          </div>
        </div>
      )}

      {/* Send Programme Modal */}
      {sendProgramme && (
        <SendModal
          title="Send Programme"
          itemName={sendProgramme.name}
          onClose={() => setSendProgramme(null)}
          onSend={(client) => { setToastMsg(`Programme sent to ${client}!`); setSendProgramme(null); }}
        />
      )}

      {toastMsg && <Toast message={toastMsg} onDone={() => setToastMsg("")} />}
    </>
  );
}

// ─── Resources Tab ───────────────────────────────────────────────────────────

function ResourcesTab() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [resources, setResources] = useState<Resource[]>(RESOURCES);
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResName, setNewResName] = useState("");
  const [newResCategory, setNewResCategory] = useState(RESOURCE_CATEGORY_OPTIONS[0]);
  const [newResFileType, setNewResFileType] = useState(FILE_TYPE_OPTIONS[0]);
  const [newResFileSize, setNewResFileSize] = useState("");
  const [sendResource, setSendResource] = useState<Resource | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  const filtered = resources.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "All" || r.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const totalDownloads = resources.reduce((sum, r) => sum + r.downloads, 0);

  const stats = [
    { label: "Total Resources", value: String(resources.length), color: "text-[#5A4EFF]" },
    { label: "Categories", value: String(RESOURCE_CATEGORIES.length), color: "text-[#EEA0FF]" },
    { label: "Total Downloads", value: String(totalDownloads), color: "text-[#E2F4A6]" },
  ];

  const handleAddResource = () => {
    if (!newResName.trim()) return;
    const newRes: Resource = {
      id: `r${Date.now()}`, name: newResName.trim(), category: newResCategory,
      fileType: newResFileType, fileSize: newResFileSize.trim() || "1.0 MB", downloads: 0,
    };
    setResources([newRes, ...resources]);
    setNewResName(""); setNewResCategory(RESOURCE_CATEGORY_OPTIONS[0]); setNewResFileType(FILE_TYPE_OPTIONS[0]); setNewResFileSize("");
    setShowAddResource(false);
  };

  const handleDownloadResource = (r: Resource) => {
    const content = `Resource: ${r.name}\nCategory: ${r.category}\nFile Type: ${r.fileType}\nFile Size: ${r.fileSize}\nDownloads: ${r.downloads}`;
    downloadTextFile(`${r.name.replace(/\s+/g, "_")}.txt`, content);
  };

  return (
    <>
      {/* Header with title and add button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#FAFAFA]">Resources</h2>
        <button onClick={() => setShowAddResource(true)} className="min-h-[44px] px-4 bg-[#5A4EFF] text-white rounded-xl font-medium hover:bg-[#4940d9] transition duration-100 ease-linear flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Resource
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#111111] border border-[#262626] rounded-2xl p-4">
            <p className="text-xs text-[#71717A] mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources..." className="w-full min-h-[44px] pl-10 pr-4 bg-[#111111] border border-[#262626] rounded-xl text-[#FAFAFA] placeholder-[#71717A] text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear" />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        <button onClick={() => setCategoryFilter("All")} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition duration-100 ease-linear ${categoryFilter === "All" ? "bg-[#5A4EFF] text-white" : "bg-[#111111] border border-[#262626] text-[#A1A1AA] hover:text-[#FAFAFA]"}`}>All</button>
        {RESOURCE_CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition duration-100 ease-linear ${categoryFilter === cat ? "bg-[#5A4EFF] text-white" : "bg-[#111111] border border-[#262626] text-[#A1A1AA] hover:text-[#FAFAFA]"}`}>{cat}</button>
        ))}
      </div>

      {/* Resource Cards */}
      <div className="space-y-3">
        {filtered.map((r) => {
          const ft = fileTypeIcons[r.fileType] || { bg: "bg-gray-500/20", text: "text-gray-400" };
          return (
            <div key={r.id} className="bg-[#111111] border border-[#262626] rounded-2xl p-4 flex items-center gap-4 hover:border-[#5A4EFF]/50 transition duration-100 ease-linear">
              <div className={`w-10 h-10 rounded-xl ${ft.bg} flex items-center justify-center shrink-0`}>
                <span className={`text-xs font-bold ${ft.text}`}>{r.fileType}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[#FAFAFA] truncate">{r.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-md bg-[#262626] text-[#A1A1AA] text-xs">{r.category}</span>
                  <span className="text-xs text-[#71717A]">{r.fileSize}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-[#71717A]">{r.downloads} downloads</span>
                <button onClick={() => setSendResource(r)} className="min-h-[44px] min-w-[44px] w-8 h-8 rounded-lg bg-[#262626] flex items-center justify-center text-[#A1A1AA] hover:text-[#FAFAFA] transition duration-100 ease-linear" title="Send to Client">
                  <SendIcon />
                </button>
                <button onClick={() => handleDownloadResource(r)} className="min-h-[44px] min-w-[44px] w-8 h-8 rounded-lg bg-[#262626] flex items-center justify-center text-[#A1A1AA] hover:text-[#FAFAFA] transition duration-100 ease-linear" title="Download">
                  <DownloadIcon />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[#71717A]"><p>No resources match your search.</p></div>
      )}

      {/* Add Resource Modal */}
      {showAddResource && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAddResource(false)}>
          <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">Add Resource</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-1">Name *</label>
                <input type="text" value={newResName} onChange={(e) => setNewResName(e.target.value)} placeholder="e.g. Beginner Nutrition Guide" className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] min-h-[44px] px-4 text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear placeholder-[#71717A]" />
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-1">Category</label>
                <select value={newResCategory} onChange={(e) => setNewResCategory(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] min-h-[44px] px-4 text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear appearance-none">
                  {RESOURCE_CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-1">File Type</label>
                <select value={newResFileType} onChange={(e) => setNewResFileType(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] min-h-[44px] px-4 text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear appearance-none">
                  {FILE_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-1">File Size</label>
                <input type="text" value={newResFileSize} onChange={(e) => setNewResFileSize(e.target.value)} placeholder="e.g. 2.4 MB" className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] min-h-[44px] px-4 text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear placeholder-[#71717A]" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddResource(false)} className="flex-1 min-h-[44px] px-4 bg-[#0A0A0A] border border-[#262626] text-[#FAFAFA] rounded-xl font-medium hover:bg-[#1a1a1a] transition duration-100 ease-linear text-sm">Cancel</button>
              <button onClick={handleAddResource} disabled={!newResName.trim()} className="flex-1 min-h-[44px] px-4 bg-[#5A4EFF] text-white rounded-xl font-medium hover:bg-[#4940d9] transition duration-100 ease-linear text-sm disabled:opacity-50 disabled:cursor-not-allowed">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Send Resource Modal */}
      {sendResource && (
        <SendModal
          title="Send Resource"
          itemName={sendResource.name}
          onClose={() => setSendResource(null)}
          onSend={(client) => { setToastMsg(`Resource sent to ${client}!`); setSendResource(null); }}
        />
      )}

      {toastMsg && <Toast message={toastMsg} onDone={() => setToastMsg("")} />}
    </>
  );
}

// ─── Exercise Library Tab ────────────────────────────────────────────────────

function ExerciseLibraryTab() {
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
    <>
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
              <button key={m} onClick={() => setMuscleFilter(m)} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition duration-100 ease-linear ${muscleFilter === m ? "bg-[#5A4EFF] text-white" : "bg-[#111111] border border-[#262626] text-[#A1A1AA] hover:text-[#FAFAFA]"}`}>{m}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-[#71717A] mb-2">Equipment</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {EQUIPMENT.map((eq) => (
              <button key={eq} onClick={() => setEquipmentFilter(eq)} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition duration-100 ease-linear ${equipmentFilter === eq ? "bg-[#5A4EFF] text-white" : "bg-[#111111] border border-[#262626] text-[#A1A1AA] hover:text-[#FAFAFA]"}`}>{eq}</button>
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
        <div className="text-center py-12 text-[#71717A]"><p>No exercises match your filters.</p></div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedExercise(null)}>
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#262626] bg-[#111111] p-6" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedExercise(null)} className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg bg-[#262626] text-[#A1A1AA] hover:text-[#FAFAFA] transition duration-100 ease-linear">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl font-bold text-[#FAFAFA] mb-3 pr-8">{selectedExercise.name}</h2>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="px-2 py-0.5 rounded-md bg-[#0A0A0A]/50 text-[#A1A1AA] text-xs">{selectedExercise.muscle}</span>
              <span className="px-2 py-0.5 rounded-md bg-[#0A0A0A]/50 text-[#A1A1AA] text-xs">{selectedExercise.equipment}</span>
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${difficultyColors[selectedExercise.difficulty]}`}>{selectedExercise.difficulty}</span>
            </div>
            <div className="aspect-video rounded-xl border border-[#262626] bg-[#1A1A1A] flex flex-col items-center justify-center mb-5">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#5A4EFF]/20 mb-2">
                <svg width="18" height="18" viewBox="0 0 10 10" fill="#5A4EFF"><polygon points="2,1 9,5 2,9"/></svg>
              </div>
              <span className="text-xs text-[#71717A]">Demo video</span>
            </div>
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-[#FAFAFA] mb-2">Instructions</h3>
              <ol className="list-decimal list-inside space-y-1.5 text-sm text-[#A1A1AA]">
                <li>Set up with proper form and brace your core before initiating the {selectedExercise.name.toLowerCase()}.</li>
                <li>Perform the movement through a full range of motion with controlled tempo.</li>
                <li>Return to the starting position slowly, maintaining tension throughout.</li>
              </ol>
            </div>
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
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-[#FAFAFA] mb-2">Common Mistakes</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-[#A1A1AA]">
                <li>Using momentum instead of controlled muscle engagement</li>
                <li>Not maintaining a neutral spine throughout the movement</li>
                <li>Shortening the range of motion to lift heavier weight</li>
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#FAFAFA] mb-2">Variations</h3>
              <div className="flex flex-wrap gap-2">
                {[`Banded ${selectedExercise.name}`, `Single-arm ${selectedExercise.name}`, `Tempo ${selectedExercise.name}`].map((v) => (
                  <span key={v} className="px-2.5 py-1 rounded-lg border border-[#262626] bg-[#0A0A0A] text-xs text-[#A1A1AA]">{v}</span>
                ))}
              </div>
            </div>
            <button className="w-full min-h-[44px] rounded-xl bg-[#5A4EFF] text-white font-medium hover:bg-[#4840E8] transition duration-100 ease-linear">Add to Programme</button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Nutrition Plans Tab ─────────────────────────────────────────────────────

function NutritionPlansTab() {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [openDays, setOpenDays] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: "", goal: "Muscle Gain" as string, calories: 2200, protein: 150, carbs: 250, fat: 70 });
  const [sendClient, setSendClient] = useState<Client | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  const client = clients.find((c) => c.id === selectedClient);

  const handleCreatePlan = () => {
    const initials = newPlan.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    const newClient: Client = {
      id: `c${Date.now()}`, name: newPlan.name, avatar: initials || "??", goal: newPlan.goal,
      calories: { target: newPlan.calories, actual: 0 }, protein: { target: newPlan.protein, actual: 0 },
      carbs: { target: newPlan.carbs, actual: 0 }, fat: { target: newPlan.fat, actual: 0 },
      compliance: 0, lastUpdated: "Just now", mealPlan: [],
    };
    setClients((prev) => [newClient, ...prev]);
    setShowCreateModal(false);
    setNewPlan({ name: "", goal: "Muscle Gain", calories: 2200, protein: 150, carbs: 250, fat: 70 });
  };

  const toggleDay = (day: string) => {
    setOpenDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  return (
    <>
      {/* Action button */}
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowCreateModal(true)} className="bg-[#5A4EFF] text-white rounded-xl min-h-[44px] px-4 font-medium transition duration-100 ease-linear hover:bg-[#4A3EEF] text-sm">+ New Plan</button>
      </div>

      {/* Client Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((c) => {
          const calPct = Math.round((c.calories.actual / c.calories.target) * 100);
          return (
            <button key={c.id} onClick={() => { setSelectedClient(c.id); setOpenDays([]); }} className="bg-[#111111] border border-[#262626] rounded-2xl p-4 text-left hover:border-[#5A4EFF]/50 transition duration-100 ease-linear">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5A4EFF] to-[#EEA0FF] flex items-center justify-center text-white text-sm font-medium shrink-0">{c.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[#FAFAFA] truncate">{c.name}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium mt-0.5 ${goalColors[c.goal]}`}>{c.goal}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="relative w-14 h-14 shrink-0">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="#262626" strokeWidth="4" />
                    <circle cx="24" cy="24" r="20" fill="none" stroke={c.compliance >= 85 ? "#E2F4A6" : c.compliance >= 70 ? "#5A4EFF" : "#EEA0FF"} strokeWidth="4" strokeDasharray={`${calPct * 1.257} 125.7`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{calPct}%</span>
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="text-[#A1A1AA]">{c.calories.actual} / {c.calories.target} kcal</p>
                  <p className={`font-medium ${c.compliance >= 85 ? "text-[#E2F4A6]" : c.compliance >= 70 ? "text-[#5A4EFF]" : "text-[#EEA0FF]"}`}>{c.compliance}% compliant</p>
                  <p className="text-[#71717A]">Updated {c.lastUpdated}</p>
                </div>
              </div>
              <div className="space-y-2">
                <MacroBar label="Protein" actual={c.protein.actual} target={c.protein.target} color="bg-[#5A4EFF]" />
                <MacroBar label="Carbs" actual={c.carbs.actual} target={c.carbs.target} color="bg-[#E2F4A6]" />
                <MacroBar label="Fat" actual={c.fat.actual} target={c.fat.target} color="bg-[#EEA0FF]" />
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#262626]">
                <button onClick={(e) => { e.stopPropagation(); setSendClient(c); }} className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 rounded-xl bg-[#262626] text-[#A1A1AA] hover:text-[#FAFAFA] text-xs font-medium transition duration-100 ease-linear">
                  <SendIcon className="w-3.5 h-3.5" /> Send
                </button>
                <button onClick={(e) => { e.stopPropagation(); downloadTextFile(`${c.name.replace(/\s+/g, "_")}_Nutrition_Plan.txt`, `Nutrition Plan: ${c.name}\nGoal: ${c.goal}\nCalories: ${c.calories.actual} / ${c.calories.target} kcal\nProtein: ${c.protein.actual}g / ${c.protein.target}g\nCarbs: ${c.carbs.actual}g / ${c.carbs.target}g\nFat: ${c.fat.actual}g / ${c.fat.target}g\nCompliance: ${c.compliance}%\nLast Updated: ${c.lastUpdated}`); }} className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 rounded-xl bg-[#262626] text-[#A1A1AA] hover:text-[#FAFAFA] text-xs font-medium transition duration-100 ease-linear">
                  <DownloadIcon className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </button>
          );
        })}
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">Create Nutrition Plan</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#A1A1AA] mb-1 block">Client</label>
                <input list="client-names" type="text" value={newPlan.name} onChange={(e) => setNewPlan((p) => ({ ...p, name: e.target.value }))} placeholder="Select or type a client name" className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] min-h-[44px] px-4 text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear" />
                <datalist id="client-names">{clients.map((c) => <option key={c.id} value={c.name} />)}</datalist>
              </div>
              <div>
                <label className="text-sm text-[#A1A1AA] mb-1 block">Goal</label>
                <select value={newPlan.goal} onChange={(e) => setNewPlan((p) => ({ ...p, goal: e.target.value }))} className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] min-h-[44px] px-4 text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear appearance-none">
                  {GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-[#A1A1AA] mb-1 block">Daily Calorie Target</label>
                <input type="number" value={newPlan.calories} onChange={(e) => setNewPlan((p) => ({ ...p, calories: Number(e.target.value) }))} className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] min-h-[44px] px-4 text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm text-[#A1A1AA] mb-1 block">Protein (g)</label>
                  <input type="number" value={newPlan.protein} onChange={(e) => setNewPlan((p) => ({ ...p, protein: Number(e.target.value) }))} className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] min-h-[44px] px-4 text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear" />
                </div>
                <div>
                  <label className="text-sm text-[#A1A1AA] mb-1 block">Carbs (g)</label>
                  <input type="number" value={newPlan.carbs} onChange={(e) => setNewPlan((p) => ({ ...p, carbs: Number(e.target.value) }))} className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] min-h-[44px] px-4 text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear" />
                </div>
                <div>
                  <label className="text-sm text-[#A1A1AA] mb-1 block">Fat (g)</label>
                  <input type="number" value={newPlan.fat} onChange={(e) => setNewPlan((p) => ({ ...p, fat: Number(e.target.value) }))} className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl text-[#FAFAFA] min-h-[44px] px-4 text-sm outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear" />
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button onClick={handleCreatePlan} disabled={!newPlan.name.trim()} className="w-full min-h-[44px] bg-[#5A4EFF] text-white rounded-xl font-medium transition duration-100 ease-linear hover:bg-[#4A3EEF] disabled:opacity-50 disabled:cursor-not-allowed">Save Plan</button>
                <button onClick={() => setShowCreateModal(false)} className="w-full min-h-[44px] bg-transparent border border-[#262626] text-[#A1A1AA] rounded-xl font-medium transition duration-100 ease-linear hover:text-[#FAFAFA] hover:border-[#3a3a3a]">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meal Plan Modal */}
      {client && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50" onClick={() => setSelectedClient(null)}>
          <div className="bg-[#111111] border border-[#262626] rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#111111] border-b border-[#262626] p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5A4EFF] to-[#EEA0FF] flex items-center justify-center text-white text-sm font-medium">{client.avatar}</div>
                <div>
                  <p className="font-semibold text-sm text-[#FAFAFA]">{client.name}</p>
                  <p className="text-xs text-[#71717A]">Meal Plan</p>
                </div>
              </div>
              <button onClick={() => setSelectedClient(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#71717A] hover:text-[#FAFAFA] transition duration-100 ease-linear">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 space-y-3">
              {client.mealPlan.map((mp) => (
                <div key={mp.day}>
                  <button onClick={() => toggleDay(mp.day)} className="w-full flex items-center justify-between p-3 bg-[#0A0A0A] border border-[#262626] rounded-xl text-left hover:bg-[#1a1a1a] transition duration-100 ease-linear">
                    <span className="font-medium text-sm text-[#FAFAFA]">{mp.day}</span>
                    <svg className={`w-4 h-4 text-[#71717A] transition-transform duration-200 ${openDays.includes(mp.day) ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {openDays.includes(mp.day) && (
                    <div className="mt-2 space-y-2 pl-2">
                      {mp.meals.map((meal) => (
                        <div key={meal.name} className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium text-sm text-[#FAFAFA]">{meal.name}</p>
                              <p className="text-xs text-[#71717A]">{meal.time}</p>
                            </div>
                            <span className="text-sm font-semibold text-[#E2F4A6]">{meal.calories} kcal</span>
                          </div>
                          <div className="flex gap-3 text-xs text-[#A1A1AA] mb-2">
                            <span>P: {meal.protein}g</span>
                            <span>C: {meal.carbs}g</span>
                            <span>F: {meal.fat}g</span>
                          </div>
                          <ul className="space-y-0.5">
                            {meal.items.map((item) => (
                              <li key={item} className="text-xs text-[#71717A] flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-[#5A4EFF] shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Send Nutrition Plan Modal */}
      {sendClient && (
        <SendModal
          title="Send Nutrition Plan"
          itemName={`${sendClient.name} - ${sendClient.goal}`}
          onClose={() => setSendClient(null)}
          onSend={(client) => { setToastMsg(`Nutrition plan sent to ${client}!`); setSendClient(null); }}
        />
      )}

      {toastMsg && <Toast message={toastMsg} onDone={() => setToastMsg("")} />}
    </>
  );
}

// ─── Main Coaching Page (inner, uses useSearchParams) ────────────────────────

function CoachingPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = (searchParams.get("tab") as TabKey) || "programmes";

  const setTab = useCallback((tab: TabKey) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "programmes") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const qs = params.toString();
    router.push(qs ? `/coaching?${qs}` : "/coaching");
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Coaching</h1>
          <p className="text-sm text-[#A1A1AA] mt-1">Programmes, nutrition and resources</p>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 mb-8 overflow-x-auto border-b border-[#262626]">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition duration-100 ease-linear border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-[#5A4EFF] text-[#FAFAFA]"
                  : "border-transparent text-[#71717A] hover:text-[#A1A1AA]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "programmes" && <ProgrammesTab />}
        {activeTab === "resources" && <ResourcesTab />}
        {activeTab === "library" && <ExerciseLibraryTab />}
        {activeTab === "nutrition" && <NutritionPlansTab />}
      </div>
    </div>
  );
}

// ─── Export with Suspense boundary (required for useSearchParams) ────────────

export default function CoachingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A]" />}>
      <CoachingPageInner />
    </Suspense>
  );
}
