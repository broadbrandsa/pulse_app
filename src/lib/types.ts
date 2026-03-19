export type MembershipType = "Monthly" | "PT Package" | "Drop-in";
export type MembershipStatus = "Active" | "Expiring Soon" | "Lapsed" | "Trial";
export type LoyaltyTier = "Bronze" | "Silver" | "Gold" | "Platinum";
export type AppointmentStatus = "Confirmed" | "Pending" | "Completed";
export type ServiceType =
    | "Personal Training"
    | "Group HIIT"
    | "Yoga Flow"
    | "Boxing Conditioning"
    | "Nutrition Consult"
    | "Fitness Assessment"
    | "Trial Session";
export type ProductCategory = "Supplements" | "Equipment" | "Accessories";
export type PaymentMethod = "Card" | "EFT / Ozow" | "Cash" | "SnapScan";
export type StoreProductCategory = "Digital" | "Physical" | "Gift Voucher";
export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type NotificationType = "booking" | "payment" | "client" | "form" | "programme" | "review" | "stock";
export type FormStatus = "Active" | "Draft";
export type SubmissionStatus = "Completed" | "Pending" | "Overdue";
export type NutritionGoal = "Lose weight" | "Build muscle" | "Maintain" | "Performance";
export type ExerciseDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Client {
    id: string;
    name: string;
    initials: string;
    avatarUrl: string | null;
    email: string;
    phone: string;
    membershipType: MembershipType;
    membershipStatus: MembershipStatus;
    loyaltyPoints: number;
    loyaltyTier: LoyaltyTier;
    joinDate: string;
    lastVisit: string;
    totalSpend: number;
    upcomingSession: string | null;
    assignedTrainer: null;
    goals: string[];
    notes: string;
}

export interface Appointment {
    id: string;
    clientName: string;
    clientInitials: string;
    clientAvatarUrl: string | null;
    service: ServiceType;
    date: string;
    time: string;
    duration: number;
    status: AppointmentStatus;
}

export interface Product {
    id: string;
    name: string;
    category: ProductCategory;
    sku: string;
    price: number;
    costPrice: number;
    stock: number;
    reorderLevel: number;
    supplier: string;
}

export interface Transaction {
    id: string;
    clientName: string;
    service: string;
    amount: number;
    paymentMethod: PaymentMethod;
    timestamp: string;
}

export interface LoyaltyEvent {
    id: string;
    clientName: string;
    type: "earned" | "redeemed";
    points: number;
    description: string;
    timestamp: string;
}

export interface MonthlyRevenue {
    month: string;
    total: number;
    memberships: number;
    ptSessions: number;
    classes: number;
    retail: number;
}

export interface Business {
    name: string;
    location: string;
    owner: string;
    plan: string;
    members: number;
    activePTs: number;
}

export interface TodayStats {
    sessionsToday: number;
    newMembersThisWeek: number;
    revenueToday: number;
    activeMembers: number;
    monthlyRecurringRevenue: number;
    upcomingSessionsNext7Days: number;
}

export interface LoyaltyTierInfo {
    name: LoyaltyTier;
    minPoints: number;
    maxPoints: number;
    memberCount: number;
    color: string;
}

export interface Programme {
    id: string;
    name: string;
    type: string;
    duration: string;
    frequency: string;
    assignedClients: string[];
    status: "Active" | "Draft";
    completionRate: number;
}

export interface Exercise {
    id: string;
    name: string;
    muscleGroups: string[];
    equipment: string;
    difficulty: ExerciseDifficulty;
    type: string;
}

export interface NutritionPlan {
    id: string;
    clientId: string;
    clientName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    goal: NutritionGoal;
    complianceRate: number;
}

export interface FormTemplate {
    id: string;
    name: string;
    description: string;
    completions: number;
    lastSent: string;
    status: FormStatus;
}

export interface FormSubmission {
    id: string;
    clientId: string;
    clientName: string;
    formName: string;
    submittedDate: string;
    status: SubmissionStatus;
}

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    timestamp: string;
    isRead: boolean;
    actionLabel?: string;
    color: string;
}

export interface Conversation {
    id: string;
    clientId: string;
    clientName: string;
    clientInitials: string;
    clientAvatarUrl: string | null;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isOnline: boolean;
    messages: Message[];
}

export interface Message {
    id: string;
    sender: "coach" | "client";
    text: string;
    timestamp: string;
    type: "text" | "system";
}

export interface Review {
    id: string;
    clientName: string;
    clientInitials: string;
    rating: number;
    text: string;
    date: string;
    response?: string;
}

export interface StoreProduct {
    id: string;
    name: string;
    description: string;
    category: StoreProductCategory;
    price: number;
    compareAtPrice?: number;
    stock: number | null;
    sku: string;
    isDigital: boolean;
    isActive: boolean;
    gradient: string;
}

export interface StoreOrder {
    id: string;
    orderNumber: string;
    clientName: string;
    clientInitials: string;
    date: string;
    items: string;
    total: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
}

export interface Referral {
    id: string;
    referrerName: string;
    referredName: string;
    date: string;
    pointsAwarded: number;
    status: "Active" | "Pending" | "Expired";
}

export interface BookingService {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    category: "Personal Training" | "Group Classes" | "Assessments" | "Consultations";
}

// === Feature 1: Trial Sessions ===
export type TrialOutcome = "converted" | "follow-up" | "not-interested" | "pending";

export interface TrialSession {
  id: string;
  clientName: string;
  clientInitials: string;
  date: string;
  service: string;
  outcome: TrialOutcome;
  daysToConvert?: number;
}

// === Feature 2: Proposals ===
export interface ProposalTier {
  name: string;
  sessions: number;
  sessionType: string;
  validity: string;
  price: number;
  features: string[];
}

export type ProposalStatus = "draft" | "sent" | "viewed" | "accepted" | "declined";

export interface Proposal {
  id: string;
  clientId: string;
  clientName: string;
  clientInitials: string;
  title: string;
  status: ProposalStatus;
  tiers: ProposalTier[];
  totalValue: number;
  sentDate: string;
  expiryDate: string;
  signedDate?: string;
}

// === Feature 3: Referral Codes ===
export interface ReferralCode {
  id: string;
  clientId: string;
  clientName: string;
  clientInitials: string;
  code: string;
  timesShared: number;
  signUps: number;
  conversions: number;
  pointsEarned: number;
}

// === Feature 4: Contract Signatures ===
export interface ContractSignature {
  id: string;
  clientId: string;
  clientName: string;
  contractType: string;
  signedDate: string;
  signatureMethod: "drawn" | "typed";
}

// === Feature 5: Milestones ===
export interface Milestone {
  id: string;
  clientId: string;
  clientName: string;
  clientInitials: string;
  type: string;
  title: string;
  description: string;
  date: string;
  pointsAwarded: number;
  celebrated: boolean;
}

// === Feature 6: Challenges ===
export type ChallengeStatus = "active" | "completed";
export type ChallengeType = "competitive" | "threshold";

export interface Challenge {
  id: string;
  name: string;
  type: ChallengeType;
  metric: string;
  goal?: string;
  startDate: string;
  endDate: string;
  participantCount: number;
  status: ChallengeStatus;
  winner?: string;
}

export interface ChallengeEntry {
  challengeId: string;
  clientId: string;
  clientName: string;
  clientInitials: string;
  score: number;
  rank: number;
  change: number;
}

// === Feature 7: Progress Photos ===
export interface ProgressPhoto {
  id: string;
  clientId: string;
  date: string;
  photoUrl: string;
  notes?: string;
  weight?: number;
  bodyFat?: number;
  popiConsent: boolean;
}

// === Feature 8: Locations ===
export interface TrainingLocation {
  id: string;
  name: string;
  address: string;
  sessionTypes: string[];
  travelBuffer: number;
  capacity: number;
  equipment: string[];
  notes?: string;
}

export interface SessionTypeMapping {
  sessionType: string;
  defaultLocationId: string;
  buffer: number;
  canOverride: boolean;
}

// === Feature 9: Installment Plans ===
export interface InstallmentPlan {
  id: string;
  clientId: string;
  totalAmount: number;
  installments: number;
  amountPerInstallment: number;
  startDate: string;
  paidCount: number;
  status: "active" | "completed" | "defaulted";
}

// === Feature 10: Invoices ===
export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type InvoiceStatus = "paid" | "outstanding" | "overdue" | "draft";

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  clientInitials: string;
  invoiceNumber: string;
  description: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  vat: number;
  total: number;
  dueDate: string;
  status: InvoiceStatus;
  chaseStatus?: string;
  paidDate?: string;
}

export interface RecurringInvoice {
  id: string;
  clientId: string;
  clientName: string;
  description: string;
  amount: number;
  frequency: "monthly" | "weekly";
  nextDate: string;
  status: "active" | "paused";
}

export interface ChaseStep {
  dayOffset: number;
  action: string;
  completed: boolean;
  date?: string;
}

// === Feature 11: Resources ===
export type ResourceFileType = "pdf" | "video" | "image";

export interface Resource {
  id: string;
  name: string;
  category: string;
  fileType: ResourceFileType;
  fileSize?: string;
  url: string;
  assignedTo: "all" | string[];
  downloadCount: number;
  dateAdded: string;
  dripDay?: number;
}

// === Feature 12: Booking Patterns ===
export interface BookingPattern {
  mostFrequentDay: string;
  mostFrequentTime: string;
  consistencyPercent: number;
}
