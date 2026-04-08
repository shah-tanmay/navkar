import { NextPage } from "next";
import { AdminLayout } from "../../../components/AdminLayout";
import { Card } from "../../../components/AdminLayout/styles";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "../../../lib/axios";
import { toast } from "react-toastify";
import styled from "styled-components";

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: 2rem 1.5rem;
  h3 { color: #666; font-size: 0.9rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px; }
  .value { color: #111; font-size: 2rem; font-weight: 700; color: #D4AF37; }
`;

const AdminDashboard: NextPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, bestRes] = await Promise.all([
          axios.get("/admin/stats/revenue"),
          axios.get("/admin/stats/best-sellers")
        ]);
        setStats(statsRes.data);
        setBestSellers(bestRes.data);
        setLoading(false);
      } catch (e) {
        toast.error("Dashboard sync failed");
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <AdminLayout title="Revenue Analytics">Loading Analytics...</AdminLayout>;

  return (
    <>
      <Head>
        <title>Revenue Dashboard | Navkar Admin</title>
      </Head>
      <AdminLayout title="Revenue Analytics">
        
        <StatsGrid>
          <StatCard>
            <h3>Revenue (Today)</h3>
            <div className="value">₹{stats?.today || 0}</div>
          </StatCard>
          <StatCard>
            <h3>Revenue (This Week)</h3>
            <div className="value">₹{stats?.week || 0}</div>
          </StatCard>
          <StatCard>
            <h3>Revenue (This Month)</h3>
            <div className="value">₹{stats?.month || 0}</div>
          </StatCard>
          <StatCard>
            <h3>Avg. Order Value</h3>
            <div className="value">₹{Math.round(stats?.aov_month || 0)}</div>
          </StatCard>
        </StatsGrid>

        <StatsGrid>
          <StatCard>
            <h3>Orders Today</h3>
            <div className="value" style={{ color: "#111" }}>{stats?.orders_today || 0}</div>
          </StatCard>
        </StatsGrid>

        <h2 style={{ marginBottom: "1.5rem", color: "#111" }}>🏆 Best Selling Variants</h2>
        <Card>
          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Product</th>
                <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Color</th>
                <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Type/Size</th>
                <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Total Sold</th>
              </tr>
            </thead>
            <tbody>
              {bestSellers.map((item, i) => (
                <tr key={i}>
                  <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>{item.product_name}</td>
                  <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>{item.color}</td>
                  <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>{item.type}</td>
                  <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0", fontWeight: "bold" }}>{item.total_sold} units</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
