import { NextPage } from "next";
import { AdminLayout } from "../../../components/AdminLayout";
import { Card } from "../../../components/AdminLayout/styles";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "../../../lib/axios";
import { toast } from "react-toastify";
import { getAllProducts } from "../../../services/productService";

const AdminCoupons: NextPage = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ 
    code: "", 
    type: "percentage", 
    value: "0", 
    expiry_date: "", 
    usage_limit: "",
    product_id: "",
    min_order_amount: "0",
    is_free_shipping: false
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [couponRes, productRes] = await Promise.all([
        axios.get("/admin/coupons"),
        getAllProducts()
      ]);
      setCoupons(couponRes.data);
      setProducts(productRes);
      setLoading(false);
    } catch (e) {
      toast.error("Failed to load data");
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/admin/coupons", { 
        ...form, 
        value: parseFloat(form.value), 
        min_order_amount: parseFloat(form.min_order_amount),
        usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
        expiry_date: form.expiry_date || null,
        product_id: form.product_id || null,
        is_free_shipping: !!form.is_free_shipping
      });
      toast.success("Coupon Created");
      setForm({ code: "", type: "percentage", value: "0", expiry_date: "", usage_limit: "", product_id: "", min_order_amount: "0", is_free_shipping: false });
      fetchData();
    } catch (e) {
      toast.error("Creation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`/admin/coupons/${id}`);
      toast.success("Coupon Deleted");
      fetchData();
    } catch (e) {
      toast.error("Deletion failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Coupon Manager | Navkar Admin</title>
      </Head>
      <AdminLayout title="Discount & Coupon Manager">
        <Card style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>✨ Create New Discount</h3>
          <form onSubmit={handleCreate} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>Coupon Code</label>
              <input value={form.code} onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})} placeholder="E.G. FESTIVE20" style={{ width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "4px" }} required />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>Discount Type</label>
              <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "4px" }}>
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Discount (₹)</option>
                <option value="free_shipping">Free Shipping Only</option>
              </select>
            </div>
            {form.type !== "free_shipping" && (
              <div>
                <label style={{ fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>Discount Value</label>
                <input type="number" value={form.value} onChange={(e) => setForm({...form, value: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "4px" }} required />
              </div>
            )}
            <div>
              <label style={{ fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>Minimum Order Total (₹)</label>
              <input type="number" value={form.min_order_amount} onChange={(e) => setForm({...form, min_order_amount: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "4px" }} />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>Specific Product (Optional)</label>
              <select value={form.product_id} onChange={(e) => setForm({...form, product_id: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "4px" }}>
                <option value="">Any Product</option>
                {products.map(p => (
                  <option key={p.product_id} value={p.product_id}>{p.product_name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "1.2rem" }}>
              <input type="checkbox" checked={form.is_free_shipping} onChange={(e) => setForm({...form, is_free_shipping: e.target.checked})} id="free_ship" style={{ width: "18px", height: "18px" }} />
              <label htmlFor="free_ship" style={{ fontSize: "0.9rem", fontWeight: "500" }}>Include Free Shipping</label>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>Expiry Date</label>
              <input type="date" value={form.expiry_date} onChange={(e) => setForm({...form, expiry_date: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "4px" }} />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>Usage Limit</label>
              <input type="number" value={form.usage_limit} onChange={(e) => setForm({...form, usage_limit: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "4px" }} placeholder="∞" />
            </div>
            <button type="submit" style={{ gridColumn: "1 / -1", background: "#111", color: "#D4AF37", border: "none", borderRadius: "4px", padding: "1rem", cursor: "pointer", fontWeight: "bold", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              Create Coupon
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
                  <tr style={{ background: "#f1f5f9" }}>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Code</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Discount Rules</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Conditions</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Usage</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Expiry</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "1rem", fontWeight: "bold", color: "#111" }}>{c.code}</td>
                      <td style={{ padding: "1rem" }}>
                        <div style={{ fontWeight: "600" }}>
                          {c.type === "free_shipping" ? "FREE SHIPPING" : (c.type === "percentage" ? `${c.value}% OFF` : `₹${c.value} OFF`)}
                        </div>
                        {c.is_free_shipping && c.type !== "free_shipping" && <div style={{ fontSize: "0.75rem", color: "#2e7d32", marginTop: "2px" }}>+ Free Shipping Bonus</div>}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        {c.product_id ? (
                           <div style={{ fontSize: "0.8rem", color: "#6366f1" }}>Specific Product Only</div>
                        ) : (
                           <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Sitewide</div>
                        )}
                        {parseFloat(c.min_order_amount) > 0 && <div style={{ fontSize: "0.8rem", color: "#f59e0b" }}>Min. Order: ₹{c.min_order_amount}</div>}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ padding: "2px 8px", background: "#f1f5f9", borderRadius: "12px", fontSize: "0.8rem" }}>
                          {c.used_count} / {c.usage_limit || "∞"}
                        </span>
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.85rem", color: "#64748b" }}>
                        {c.expiry_date ? new Date(c.expiry_date).toLocaleDateString() : "Never"}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <button onClick={() => handleDelete(c.id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: "500" }}>Remove</button>
                      </td>
                    </tr>
                  ))}
                  {coupons.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>No coupons found. Create your first one above!</td>
                    </tr>
                  )}
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
