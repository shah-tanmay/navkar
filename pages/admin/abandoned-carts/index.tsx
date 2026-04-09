import { NextPage } from "next";
import { AdminLayout } from "../../../components/AdminLayout";
import { Card } from "../../../components/AdminLayout/styles";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "../../../lib/axios";
import { toast } from "react-toastify";

const AdminAbandonedCarts: NextPage = () => {
  const [carts, setCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState("48");

  const fetchCarts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/admin/abandoned-carts?hours=${hours}`);
      setCarts(res.data);
      setLoading(false);
    } catch (e) {
      toast.error("Failed to load abandoned carts");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, [hours]);

  return (
    <>
      <Head>
        <title>Abandoned Cart Tracker | Navkar Admin</title>
      </Head>
      <AdminLayout title="Abandoned Cart Tracker">
         <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ margin: 0, color: "#666" }}>
            Showing users who have added items to their cart but haven&apos;t placed an order.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#64748b" }}>Lookback Period:</span>
            <select 
              value={hours} 
              onChange={(e) => setHours(e.target.value)}
              style={{ 
                padding: "8px 16px", 
                borderRadius: "8px", 
                border: "1px solid #cbd5e1", 
                backgroundColor: "white",
                color: "#1e293b",
                fontWeight: "500",
                cursor: "pointer",
                outline: "none",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
              }}
            >
              <option value="24">Last 24 Hours</option>
              <option value="48">Last 48 Hours</option>
              <option value="72">Last 3 days</option>
              <option value="168">Last 7 Days</option>
              <option value="720">Last 30 Days</option>
            </select>
          </div>
        </div>
        <Card>
          {loading ? (
            <p>Scanning Carts...</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Last Active</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Customer Name</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Contact Info</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Items In Cart</th>
                  </tr>
                </thead>
                <tbody>
                  {carts.map((c, i) => (
                    <tr key={i}>
                      <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
                        {new Date(c.last_active).toLocaleString()}
                      </td>
                      <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0", fontWeight: "bold" }}>
                        {c.name}
                      </td>
                      <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
                        {c.email}<br />{c.phone}
                      </td>
                      <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
                        <strong>{c.item_count} items</strong>
                      </td>
                    </tr>
                  ))}
                  {carts.length === 0 && <p style={{ padding: "1rem" }}>No abandoned carts found in the tracked interval.</p>}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </AdminLayout>
    </>
  );
};

export default AdminAbandonedCarts;
