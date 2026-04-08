import { NextPage } from "next";
import { AdminLayout } from "../../../components/AdminLayout";
import { Card } from "../../../components/AdminLayout/styles";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "../../../lib/axios";
import { toast } from "react-toastify";

const AdminCoupons: NextPage = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: "", type: "percentage", value: "", expiry_date: "", usage_limit: "" });

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("/admin/coupons");
      setCoupons(res.data);
      setLoading(false);
    } catch (e) {
      toast.error("Failed to load coupons");
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/admin/coupons", { 
        ...form, 
        value: parseFloat(form.value), 
        usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
        expiry_date: form.expiry_date || null
      });
      toast.success("Coupon Created");
      setForm({ code: "", type: "percentage", value: "", expiry_date: "", usage_limit: "" });
      fetchCoupons();
    } catch (e) {
      toast.error("Creation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`/admin/coupons/${id}`);
      toast.success("Coupon Deleted");
      fetchCoupons();
    } catch (e) {
      toast.error("Deletion failed");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <>
      <Head>
        <title>Coupon Manager | Navkar Admin</title>
      </Head>
      <AdminLayout title="Discount & Coupon Manager">
        <Card style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>✨ Create New Discount</h3>
          <form onSubmit={handleCreate} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", display: "block" }}>Code</label>
              <input value={form.code} onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})} placeholder="E.G. FESTIVE20" style={{ width: "100%", padding: "0.6rem" }} required />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", display: "block" }}>Type</label>
              <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} style={{ width: "100%", padding: "0.6rem" }}>
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Discount (₹)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", display: "block" }}>Value</label>
              <input type="number" value={form.value} onChange={(e) => setForm({...form, value: e.target.value})} style={{ width: "100%", padding: "0.6rem" }} required />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", display: "block" }}>Expiry (Optional)</label>
              <input type="date" value={form.expiry_date} onChange={(e) => setForm({...form, expiry_date: e.target.value})} style={{ width: "100%", padding: "0.6rem" }} />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", display: "block" }}>Usage Limit</label>
              <input type="number" value={form.usage_limit} onChange={(e) => setForm({...form, usage_limit: e.target.value})} style={{ width: "100%", padding: "0.6rem" }} />
            </div>
            <button type="submit" style={{ background: "#111", color: "#D4AF37", border: "none", borderRadius: "4px", padding: "0.6rem", alignSelf: "flex-end", cursor: "pointer", fontWeight: "bold" }}>
              Add Coupon
            </button>
          </form>
        </Card>

        <Card>
          {loading ? (
            <p>Loading Coupons...</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Code</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Discount</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Expiry</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Usage</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id}>
                      <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0", fontWeight: "bold" }}>{c.code}</td>
                      <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
                        {c.type === "percentage" ? `${c.value}% OFF` : `₹${c.value} OFF`}
                      </td>
                      <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
                        {c.expiry_date ? new Date(c.expiry_date).toLocaleDateString() : "Never"}
                      </td>
                      <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
                        {c.used_count} / {c.usage_limit || "∞"}
                      </td>
                      <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
                        <button onClick={() => handleDelete(c.id)} style={{ color: "#e3342f", background: "none", border: "none", cursor: "pointer" }}>Delete</button>
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

export default AdminCoupons;
