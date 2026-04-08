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

  const fetchCarts = async () => {
    try {
      const res = await axios.get("/admin/abandoned-carts");
      setCarts(res.data);
      setLoading(false);
    } catch (e) {
      toast.error("Failed to load abandoned carts");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  return (
    <>
      <Head>
        <title>Abandoned Cart Tracker | Navkar Admin</title>
      </Head>
      <AdminLayout title="Abandoned Cart Tracker">
        <p style={{ marginBottom: "2rem", color: "#666" }}>
          Showing users who have added items to their cart in the last 48 hours but haven&apos;t placed an order.
        </p>
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
