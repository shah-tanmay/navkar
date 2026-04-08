import { NextPage } from "next";
import { AdminLayout } from "../../../components/AdminLayout";
import { Card } from "../../../components/AdminLayout/styles";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "../../../lib/axios";
import { toast } from "react-toastify";

const AdminAdPerformance: NextPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], meta_spend: "", google_spend: "" });

  const fetchPerformance = async () => {
    try {
      const res = await axios.get("/admin/ad-performance");
      setLogs(res.data);
      setLoading(false);
    } catch (e) {
      toast.error("Failed to load ad data");
      setLoading(false);
    }
  };

  const handleLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/admin/ad-performance", { 
        ...form, 
        meta_spend: parseFloat(form.meta_spend) || 0,
        google_spend: parseFloat(form.google_spend) || 0
      });
      toast.success("Ad Spend Logged");
      fetchPerformance();
    } catch (e) {
      toast.error("Failed to log spend");
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  return (
    <>
      <Head>
        <title>Ad Performance Log | Navkar Admin</title>
      </Head>
      <AdminLayout title="Ad Performance Notes">
        <Card style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>📝 Log Daily Ad Spend</h3>
          <form onSubmit={handleLog} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: "150px" }}>
              <label style={{ fontSize: "0.8rem", display: "block" }}>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} style={{ width: "100%", padding: "0.6rem" }} required />
            </div>
            <div style={{ flex: 1, minWidth: "150px" }}>
              <label style={{ fontSize: "0.8rem", display: "block" }}>Meta/FB Spend (₹)</label>
              <input type="number" value={form.meta_spend} onChange={(e) => setForm({...form, meta_spend: e.target.value})} style={{ width: "100%", padding: "0.6rem" }} placeholder="0" />
            </div>
            <div style={{ flex: 1, minWidth: "150px" }}>
              <label style={{ fontSize: "0.8rem", display: "block" }}>Google Ads Spend (₹)</label>
              <input type="number" value={form.google_spend} onChange={(e) => setForm({...form, google_spend: e.target.value})} style={{ width: "100%", padding: "0.6rem" }} placeholder="0" />
            </div>
            <button type="submit" style={{ background: "#111", color: "#D4AF37", border: "none", borderRadius: "4px", padding: "0.6rem 1.5rem", cursor: "pointer", fontWeight: "bold", height: "42px" }}>
              Save Log
            </button>
          </form>
        </Card>

        <Card>
          {loading ? (
            <p>Loading Performance Data...</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Date</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Meta Spend</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Google Spend</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Total Spend</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Orders rec&apos;d</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Revenue</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((L, i) => {
                    const roas = L.total_spend > 0 ? (L.revenue / L.total_spend).toFixed(2) : "N/A";
                    return (
                      <tr key={i}>
                        <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>{new Date(L.log_date).toLocaleDateString()}</td>
                        <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>₹{L.meta_spend}</td>
                        <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>₹{L.google_spend}</td>
                        <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0", fontWeight: "bold" }}>₹{L.total_spend}</td>
                        <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>{L.orders_count}</td>
                        <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>₹{L.revenue}</td>
                        <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0", color: parseFloat(roas) > 3 ? "#27ae60" : "#111", fontWeight: "bold" }}>
                          {roas}x
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </AdminLayout>
    </>
  );
};

export default AdminAdPerformance;
