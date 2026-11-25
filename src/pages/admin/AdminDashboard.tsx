import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoBagCheckOutline,
  IoPeopleOutline,
  IoWalletOutline,
  IoReceiptOutline,
  IoCubeOutline,
  IoBarChartOutline,
} from "react-icons/io5";
import { apiRequest } from "../../services/apiService";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { Card, CardHeader, EmptyState, PageHeader, StatCard, StatusBadge, cx, inr } from "../../components/admin/AdminUI";

interface RevenueAnalytics {
  label: string;
  revenue: number;
}

interface TopProduct {
  productId: string;
  name: string;
  image: string;
  sales: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  orderId: string;
  customer: string;
  email: string;
  date: string;
  status: string;
  total: number;
}

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  newCustomers: number;
  activeVisitors: null;
  revenueAnalytics: RevenueAnalytics[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
}

const RANGES = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7days", label: "Last 7 days" },
  { value: "last30days", label: "Last 30 days" },
];

const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

const AdminDashboard = () => {
  const [range, setRange] = useState("today");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const { adminUser } = useAdminAuth();

  // same endpoint + params as before
  const fetchDashboard = async (selectedRange: string) => {
    try {
      setLoading(true);
      const response = await apiRequest(`/admin/api/v1/dashboard/get?range=${selectedRange}`, "GET");
      if (response?.success) {
        setDashboard(response.dashboard);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(range);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeRange = (value: string) => {
    setRange(value);
    fetchDashboard(value);
  };

  const revenue = dashboard?.revenueAnalytics || [];
  const maxRevenue = Math.max(...revenue.map((r) => r.revenue), 1);
  const avgOrder = dashboard?.totalOrders ? (dashboard.totalRevenue || 0) / dashboard.totalOrders : 0;
  const rangeLabel = RANGES.find((r) => r.value === range)?.label.toLowerCase();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back${adminUser?.name ? `, ${adminUser.name.split(" ")[0]}` : ""}`}
        description={`Here’s how the store is doing — ${rangeLabel}.`}
        actions={
          <div role="tablist" aria-label="Date range" className="flex rounded-xl border border-gray-200 bg-white p-1 shadow-card">
            {RANGES.map((r) => (
              <button
                key={r.value}
                role="tab"
                aria-selected={range === r.value}
                onClick={() => changeRange(r.value)}
                className={cx(
                  "min-h-[36px] rounded-lg px-3 text-[13px] font-semibold transition-colors",
                  range === r.value ? "bg-brand text-white" : "text-gray-600 hover:bg-gray-100",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" value={inr(dashboard?.totalRevenue)} icon={IoWalletOutline} tone="green" loading={loading} />
        <StatCard
          label="Orders"
          value={Number(dashboard?.totalOrders || 0).toLocaleString("en-IN")}
          icon={IoBagCheckOutline}
          tone="plum"
          loading={loading}
        />
        <StatCard label="Average order value" value={inr(avgOrder)} icon={IoReceiptOutline} tone="blue" loading={loading} />
        <StatCard
          label="New customers"
          value={Number(dashboard?.newCustomers || 0).toLocaleString("en-IN")}
          icon={IoPeopleOutline}
          tone="coral"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Revenue chart */}
        <Card className="xl:col-span-2">
          <CardHeader title="Revenue" action={{ label: "Full report", to: "/admin/reports" }} />
          {revenue.length ? (
            <div>
              <div className="relative h-64">
                {/* gridlines */}
                <div aria-hidden className="absolute inset-0 flex flex-col justify-between">
                  {[0, 1, 2, 3].map((g) => (
                    <div key={g} className="border-t border-dashed border-gray-100" />
                  ))}
                </div>
                <div className="relative flex h-full items-end gap-1.5 sm:gap-2.5">
                  {revenue.map((item, i) => {
                    const h = Math.max((item.revenue / maxRevenue) * 100, 3);
                    return (
                      <div key={i} className="group relative flex h-full flex-1 items-end">
                        <div
                          className="w-full rounded-t-lg bg-brand/80 transition-colors group-hover:bg-brand"
                          style={{ height: `${h}%` }}
                          role="img"
                          aria-label={`${item.label}: ${inr(item.revenue)}`}
                        />
                        <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                          {inr(item.revenue)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-3 flex gap-1.5 sm:gap-2.5">
                {revenue.map((item, i) => (
                  <span key={i} className="flex-1 truncate text-center text-[11px] font-medium text-gray-400">
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState icon={IoBarChartOutline} title={loading ? "Loading…" : "No revenue in this period"} />
          )}
        </Card>

        {/* Top products */}
        <Card>
          <CardHeader title="Top products" action={{ label: "All products", to: "/admin/products" }} />
          {dashboard?.topProducts?.length ? (
            <ol className="space-y-3">
              {dashboard.topProducts.map((prod, i) => (
                <li key={prod.productId} className="flex items-center gap-3">
                  <span className="w-5 shrink-0 text-center text-xs font-bold text-gray-400">{i + 1}</span>
                  <span className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    {prod.image && <img src={prod.image} alt="" className="h-full w-full object-cover" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-gray-900">{prod.name}</span>
                    <span className="block text-xs text-gray-500">{prod.sales} sold</span>
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{inr(prod.revenue)}</span>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState icon={IoCubeOutline} title={loading ? "Loading…" : "No sales yet"} />
          )}
        </Card>
      </div>

      {/* Recent orders */}
      <Card padded={false} className="overflow-hidden">
        <div className="px-5 pt-5 md:px-6 md:pt-6">
          <CardHeader title="Recent orders" action={{ label: "All orders", to: "/admin/orders" }} />
        </div>

        {dashboard?.recentOrders?.length ? (
          <>
            {/* table ≥ md */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-y border-gray-100 bg-gray-50/70 text-[12px] font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-3">Order</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dashboard.recentOrders.map((order) => (
                    <tr key={order.orderId} className="transition-colors hover:bg-gray-50/70">
                      <td className="px-6 py-3.5 font-mono text-[13px] font-medium text-brand">#{order.id}</td>
                      <td className="px-6 py-3.5">
                        <span className="block font-medium text-gray-900">{order.customer}</span>
                        <span className="block text-xs text-gray-500">{order.email}</span>
                      </td>
                      <td className="px-6 py-3.5 text-gray-500">{formatDate(order.date)}</td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-3.5 text-right font-semibold text-gray-900">{inr(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* cards < md */}
            <ul className="divide-y divide-gray-100 border-t border-gray-100 md:hidden">
              {dashboard.recentOrders.map((order) => (
                <li key={order.orderId} className="flex items-start justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="font-mono text-[13px] font-medium text-brand">#{order.id}</p>
                    <p className="mt-0.5 truncate text-sm font-medium text-gray-900">{order.customer}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="text-sm font-semibold text-gray-900">{inr(order.total)}</span>
                    <StatusBadge status={order.status} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyState icon={IoBagCheckOutline} title={loading ? "Loading…" : "No recent orders"} />
        )}
      </Card>

      <p className="text-center text-xs text-gray-400">
        Need more detail? Open{" "}
        <Link to="/admin/reports" className="font-semibold text-brand hover:underline">
          Reports
        </Link>
        .
      </p>
    </div>
  );
};

export default AdminDashboard;
