"use client";

import {
  TrendUp01,
  Users01,
  RefreshCcw01,
  CurrencyDollarCircle,
  BarChart01,
  Star01,
  Globe01,
  Share07,
  MarkerPin01,
  SearchLg,
  AlertCircle,
  Clock,
  Phone,
} from "@untitledui/icons";

const weeklyRevenue = [
  { week: "W1", amount: 14200 },
  { week: "W2", amount: 16800 },
  { week: "W3", amount: 15400 },
  { week: "W4", amount: 11600 },
];

const topServices = [
  { name: "Box Braids", revenue: "R18,700", bookings: 22, share: 32 },
  { name: "Full Colour", revenue: "R11,050", bookings: 17, share: 19 },
  { name: "Silk Press", revenue: "R9,450", bookings: 21, share: 16 },
  { name: "Relaxer", revenue: "R6,400", bookings: 16, share: 11 },
  { name: "Wash & Blow", revenue: "R5,500", bookings: 22, share: 9 },
];

const stylistPerf = [
  { name: "Naledi", revenue: "R32,400", clients: 42, rebookRate: "78%", avgRating: 4.9 },
  { name: "Zinhle", revenue: "R24,600", clients: 35, rebookRate: "71%", avgRating: 4.8 },
  { name: "Buhle", revenue: "R18,200", clients: 28, rebookRate: "65%", avgRating: 4.7 },
];

const sources = [
  { source: "Instagram", clients: 8, share: 44 },
  { source: "Referral", clients: 5, share: 28 },
  { source: "Walk-in", clients: 3, share: 17 },
  { source: "Google", clients: 2, share: 11 },
];

const rebookClients = [
  { name: "Thandiwe M.", lastVisit: "22 days ago", service: "Box Braids" },
  { name: "Ayanda K.", lastVisit: "28 days ago", service: "Silk Press" },
  { name: "Lindiwe S.", lastVisit: "31 days ago", service: "Full Colour" },
  { name: "Nomsa D.", lastVisit: "35 days ago", service: "Relaxer" },
  { name: "Palesa R.", lastVisit: "38 days ago", service: "Wash & Blow" },
];

function sourceIcon(source: string) {
  switch (source) {
    case "Instagram":
      return <Globe01 className="size-4 text-[#D946EF]" />;
    case "Referral":
      return <Share07 className="size-4 text-[#D946EF]" />;
    case "Walk-in":
      return <MarkerPin01 className="size-4 text-[#D946EF]" />;
    case "Google":
      return <SearchLg className="size-4 text-[#D946EF]" />;
    default:
      return null;
  }
}

export default function SalonGrowPage() {
  const maxRevenue = Math.max(...weeklyRevenue.map((w) => w.amount));
  const chartHeight = 180;
  const barWidth = 48;
  const gap = 32;
  const chartWidth = weeklyRevenue.length * (barWidth + gap) - gap + 40;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--pa-text-primary)]">Growth & Analytics</h1>
        <p className="mt-1 text-sm text-[var(--pa-text-muted)]">Track your salon&apos;s performance and identify growth opportunities.</p>
      </div>

      {/* Growth Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Revenue Growth",
            value: "+18%",
            sub: "vs last month",
            icon: TrendUp01,
            accent: "text-emerald-400",
          },
          {
            label: "New Clients",
            value: "18",
            sub: "this month",
            icon: Users01,
            accent: "text-[#D946EF]",
          },
          {
            label: "Rebooking Rate",
            value: "72%",
            sub: "of returning clients",
            icon: RefreshCcw01,
            accent: "text-[#D946EF]",
          },
          {
            label: "Average Ticket",
            value: "R485",
            sub: "per appointment",
            icon: CurrencyDollarCircle,
            accent: "text-[#D946EF]",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">
                {stat.label}
              </span>
              <stat.icon className={`size-5 ${stat.accent}`} />
            </div>
            <p className="mt-3 text-3xl font-bold text-[var(--pa-text-primary)]">{stat.value}</p>
            <p className="mt-1 text-xs text-[var(--pa-text-muted)]">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-6">
        <div className="mb-6 flex items-center gap-2">
          <BarChart01 className="size-5 text-[#D946EF]" />
          <h2 className="text-lg font-semibold text-[var(--pa-text-primary)]">Weekly Revenue</h2>
        </div>
        <div className="flex justify-center overflow-x-auto">
          <svg width={chartWidth} height={chartHeight + 40} viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D946EF" />
                <stop offset="100%" stopColor="#D946EF" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            {weeklyRevenue.map((w, i) => {
              const barHeight = (w.amount / maxRevenue) * chartHeight;
              const x = 20 + i * (barWidth + gap);
              const y = chartHeight - barHeight;
              return (
                <g key={w.week}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={8}
                    fill="url(#barGrad)"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    className="fill-[var(--pa-text-secondary)] text-[11px]"
                    fontSize={11}
                  >
                    R{(w.amount / 1000).toFixed(1)}k
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    className="fill-[var(--pa-text-muted)] text-[12px]"
                    fontSize={12}
                  >
                    {w.week}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Two-column layout: Top Services + Stylist Performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Services */}
        <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-6">
          <h2 className="mb-5 text-lg font-semibold text-[var(--pa-text-primary)]">Top Services by Revenue</h2>
          <div className="space-y-4">
            {topServices.map((svc) => (
              <div key={svc.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--pa-text-primary)]">{svc.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--pa-text-muted)]">{svc.bookings} bookings</span>
                    <span className="font-medium text-[#D946EF]">{svc.revenue}</span>
                  </div>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-[var(--pa-bg-elevated)]">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#D946EF] to-[#D946EF]/50"
                    style={{ width: `${svc.share}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-[10px] text-[var(--pa-text-muted)]">{svc.share}% of revenue</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stylist Performance */}
        <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-6">
          <h2 className="mb-5 text-lg font-semibold text-[var(--pa-text-primary)]">Stylist Performance</h2>
          <div className="space-y-4">
            {stylistPerf.map((stylist, idx) => (
              <div
                key={stylist.name}
                className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-topbar)] p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D946EF]/15 text-sm font-bold text-[#D946EF]">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--pa-text-primary)]">{stylist.name}</p>
                      <p className="text-xs text-[var(--pa-text-muted)]">{stylist.clients} clients</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-[#D946EF]">{stylist.revenue}</p>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-[var(--pa-text-secondary)]">
                  <span className="flex items-center gap-1">
                    <RefreshCcw01 className="size-3.5" />
                    {stylist.rebookRate} rebook
                  </span>
                  <span className="flex items-center gap-1">
                    <Star01 className="size-3.5 text-amber-400" />
                    {stylist.avgRating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column layout: Client Sources + Retention */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Client Acquisition Sources */}
        <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-6">
          <h2 className="mb-5 text-lg font-semibold text-[var(--pa-text-primary)]">Client Acquisition Sources</h2>
          <div className="space-y-3">
            {sources.map((s) => (
              <div
                key={s.source}
                className="flex items-center gap-3 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-topbar)] p-4"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D946EF]/10">
                  {sourceIcon(s.source)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--pa-text-primary)]">{s.source}</span>
                    <span className="text-sm font-semibold text-[#D946EF]">{s.clients} clients</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--pa-bg-elevated)]">
                    <div
                      className="h-1.5 rounded-full bg-[#D946EF]"
                      style={{ width: `${s.share}%` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-[10px] text-[var(--pa-text-muted)]">{s.share}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retention Insights */}
        <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-6">
          <h2 className="mb-5 text-lg font-semibold text-[var(--pa-text-primary)]">Retention Insights</h2>

          {/* Summary cards */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-topbar)] p-4 text-center">
              <AlertCircle className="mx-auto size-5 text-amber-400" />
              <p className="mt-2 text-2xl font-bold text-[var(--pa-text-primary)]">12</p>
              <p className="text-[10px] text-[var(--pa-text-muted)]">Due for rebooking</p>
            </div>
            <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-topbar)] p-4 text-center">
              <Clock className="mx-auto size-5 text-red-400" />
              <p className="mt-2 text-2xl font-bold text-[var(--pa-text-primary)]">8</p>
              <p className="text-[10px] text-[var(--pa-text-muted)]">30+ days inactive</p>
            </div>
          </div>

          {/* Outreach list */}
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">
            Needs Outreach
          </p>
          <div className="space-y-2">
            {rebookClients.map((client) => (
              <div
                key={client.name}
                className="flex items-center justify-between rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-topbar)] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--pa-text-primary)]">{client.name}</p>
                  <p className="text-[10px] text-[var(--pa-text-muted)]">
                    {client.service} &middot; {client.lastVisit}
                  </p>
                </div>
                <button className="flex items-center gap-1.5 rounded-lg bg-[#D946EF]/10 px-3 py-1.5 text-xs font-medium text-[#D946EF] transition hover:bg-[#D946EF]/20">
                  <Phone className="size-3" />
                  Reach out
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
