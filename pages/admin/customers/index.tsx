import { NextPage } from "next";
import { AdminLayout } from "../../../components/AdminLayout";
import { Card } from "../../../components/AdminLayout/styles";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "../../../lib/axios";
import { toast } from "react-toastify";

const AdminCustomers: NextPage = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/admin/customers");
      setCustomers(res.data);
      setLoading(false);
    } catch (e) {
      toast.error("Failed to load customers");
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (customers.length === 0) return;
    
    const headers = ["ID", "Name", "Email", "Phone", "Joined Date", "Total Orders", "Total Spend (INR)"];
    const rows = customers.map(c => [
      c.id,
      c.name,
      c.email,
      c.phone,
      new Date(c.joined_date).toLocaleDateString(),
      c.total_orders,
      c.total_spend
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `navkar_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <Head>
        <title>Customer Database | Navkar Admin</title>
      </Head>
      <AdminLayout title="Customer Database">
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "flex-end" }}>
          <button 
            onClick={exportToCSV}
            style={{ 
              background: "#D4AF37", 
              color: "#111", 
              padding: "0.8rem 1.5rem", 
              border: "none", 
              borderRadius: "4px", 
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            📥 Export to CSV
          </button>
        </div>
        <Card>
          {loading ? (
            <p>Loading Customers...</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Joined</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Customer Name</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Contact Details</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Orders</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Lifetime Spend</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
                        {new Date(c.joined_date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0", fontWeight: "bold" }}>
                        {c.name}
                      </td>
                      <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
                        {c.email}<br />{c.phone}
                      </td>
                      <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
                        {c.total_orders}
                      </td>
                      <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0", fontWeight: "bold", color: "#B8860B" }}>
                        ₹{c.total_spend}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </AdminLayout>
    </>
  );
};

export default AdminCustomers;
