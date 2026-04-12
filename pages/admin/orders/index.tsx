import { NextPage } from "next";
import { AdminLayout } from "../../../components/AdminLayout";
import { Card } from "../../../components/AdminLayout/styles";
import Head from "next/head";
import React, { useEffect, useState, Fragment } from "react";
import axios from "../../../lib/axios";
import { toast } from "react-toastify";

const AdminOrdersComprehensive: NextPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [searchId, setSearchId] = useState("");
  const [showPartialOnly, setShowPartialOnly] = useState(false);

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/admin/orders");
      setOrders(res.data);
      setLoading(false);
    } catch (e) {
      toast.error("Failed to load orders");
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchOrders();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to PERMANENTLY DELETE this order? This action cannot be undone.")) return;
    try {
      await axios.delete(`/admin/orders/${orderId}`);
      toast.success("Order deleted");
      fetchOrders();
    } catch (e) {
      toast.error("Failed to delete order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Head>
        <title>Orders Management | Navkar Admin</title>
      </Head>
      <AdminLayout title="Orders Management">
        <Card>
          <div style={{ marginBottom: "2rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontWeight: "700", fontSize: "0.85rem", color: "#64748b", textTransform: "uppercase" }}>Search Order</label>
              <input
                type="text"
                placeholder="ID or Token..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", width: "220px", fontSize: "0.9rem" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontWeight: "700", fontSize: "0.85rem", color: "#64748b", textTransform: "uppercase" }}>Payment Status</label>
              <select 
                value={paymentFilter} 
                onChange={(e) => setPaymentFilter(e.target.value)}
                style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", width: "180px", fontSize: "0.9rem", background: "white" }}
              >
                <option value="all">All Transactions</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginTop: "1.2rem" }}>
              <input
                type="checkbox"
                id="partialCheck"
                checked={showPartialOnly}
                onChange={(e) => setShowPartialOnly(e.target.checked)}
                style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "#d4af37" }}
              />
              <label htmlFor="partialCheck" style={{ fontWeight: "600", color: "#1e293b", cursor: "pointer" }}>
                Lead Insights (Partial Checkouts)
              </label>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <p style={{ color: "#64748b" }}>Syncing orders database...</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", textAlign: "left", borderCollapse: "separate", borderSpacing: "0 0.5rem", minWidth: "1200px" }}>
                <thead>
                  <tr style={{ color: "#64748b", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "800" }}>
                    <th style={{ padding: "1rem" }}>Order Details</th>
                    <th style={{ padding: "1rem" }}>Customer & Ship To</th>
                    <th style={{ padding: "1rem" }}>Order Items</th>
                    <th style={{ padding: "1rem" }}>Financials</th>
                    <th style={{ padding: "1rem" }}>Lifecycle Status</th>
                    <th style={{ padding: "1rem" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.filter(o => {
                    const matchPayment = paymentFilter === "all" || String(o.payment_status).toLowerCase() === paymentFilter;
                    const matchId = !searchId || (o.order_token && String(o.order_token).toLowerCase().includes(searchId.toLowerCase()));
                    const isPartial = showPartialOnly ? (o.payment_status === "pending" && o.metadata_phone) : true;
                    return matchPayment && matchId && isPartial;
                  }).map((o) => (
                    <Fragment key={o.id}>
                    <tr style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                      <td style={{ padding: "1.2rem 1rem", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", borderLeft: "4px solid #d4af37" }}>
                        <span style={{ fontWeight: "800", color: "#1e293b", fontSize: "1.05rem" }}>#{o.order_token}</span><br />
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "600" }}>
                          {new Date(o.order_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td style={{ padding: "1.2rem 1rem", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ marginBottom: "0.4rem" }}>
                          <strong style={{ color: "#1e293b" }}>{o.metadata_name || o.customer_name}</strong><br />
                          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>{o.email}</span>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b", padding: "0.4rem", background: "#f8fafc", borderRadius: "6px" }}>
                          <i style={{ color: "#94a3b8" }}>Shipping:</i><br />
                          {o.street || o.shipping_address?.street || '---'}, {o.city || o.shipping_address?.city || '---'}<br />
                          {o.state || o.shipping_address?.state || '---'} {o.postal_code || o.shipping_address?.postal_code || '---'}
                        </div>
                      </td>
                      <td style={{ padding: "1.2rem 1rem", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                          {o.items.map((it: any, i: number) => (
                            <div key={i} style={{ fontSize: "0.85rem", display: "flex", flexDirection: "column", borderBottom: i < o.items.length - 1 ? "1px solid #f1f5f9" : "none", paddingBottom: "0.4rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                                <span style={{ fontWeight: "600" }}>{it.quantity}x {it.product_name} <i>({it.color || 'No Color'})</i></span>
                                <span style={{ color: "#94a3b8" }}>{it.type}</span>
                              </div>
                              {(() => {
                                const m = it.metadata || {};
                                if (m.width || m.length) {
                                  return (
                                    <div style={{ fontSize: "0.8rem", color: "#722ed1", fontWeight: "700", marginTop: "0.2rem", background: "#f9f0ff", padding: "2px 6px", borderRadius: "4px", width: "fit-content" }}>
                                      {m.width} {m.unit || 'in'} × {m.length} {m.unit || 'in'}
                                    </div>
                                  );
                                } else if (m.width_ft || m.length_ft) {
                                  return (
                                    <div style={{ fontSize: "0.8rem", color: "#722ed1", fontWeight: "700", marginTop: "0.2rem", background: "#f9f0ff", padding: "2px 6px", borderRadius: "4px", width: "fit-content" }}>
                                      {m.width_ft} ft × {m.length_ft} ft
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                              <div style={{ fontSize: "0.7rem", color: it.catalogue_name ? "#475569" : "#ef4444", marginTop: "0.3rem", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", width: "fit-content", fontWeight: "600", border: "1px solid #e2e8f0" }}>
                                Catalogue: {it.catalogue_name || 'PENDING'} | Serial: {it.serial_number || 'PENDING'}
                              </div>
                              {it.metadata?.hanging_style && (
                                <div style={{ fontSize: "0.7rem", color: "#ba8160", marginTop: "0.2rem", fontWeight: "800", textTransform: "uppercase" }}>
                                  Hanging: {it.metadata.hanging_style}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: "1.2rem 1rem", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ fontWeight: "800", color: "#1e293b", fontSize: "1.1rem" }}>₹{o.total_amount}</div>
                        <span style={{ 
                          padding: "0.2rem 0.6rem", 
                          borderRadius: "20px", 
                          fontSize: "0.7rem",
                          fontWeight: "800",
                          textTransform: "uppercase",
                          background: o.payment_status === "completed" || o.payment_status === "paid" ? "#dcfce7" : "#fee2e2",
                          color: o.payment_status === "completed" || o.payment_status === "paid" ? "#166534" : "#991b1b",
                          display: "inline-block",
                          marginTop: "0.3rem"
                        }}>
                          {o.payment_status}
                        </span>
                      </td>
                      <td style={{ padding: "1.2rem 1rem", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
                        <select 
                          value={o.status} 
                          onChange={(e) => updateStatus(o.id, e.target.value)}
                          style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.85rem", width: "100%", background: "#fff" }}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="processing">⚙️ Processing</option>
                          <option value="shipped">🚚 Shipped</option>
                          <option value="delivered">✅ Delivered</option>
                          <option value="cancelled">❌ Cancelled</option>
                          <option value="return_requested">🔄 Return Requested</option>
                          <option value="returned">🔙 Returned</option>
                          <option value="failed">⚠️ Failed</option>
                        </select>
                      </td>
                      <td style={{ padding: "1.2rem 1rem", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                           <button 
                            onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)} 
                            style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #e2e8f0", color: "#64748b", background: "#fff", cursor: "pointer", fontSize: "0.8rem", fontWeight: "600" }}
                            title="View Full Info"
                          >
                            {expandedOrder === o.id ? "Hide Info" : "View Info"}
                          </button>
                           <button 
                            onClick={() => handleDelete(o.id)} 
                            style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #fee2e2", color: "#ef4444", background: "#fff", cursor: "pointer", fontSize: "0.8rem", fontWeight: "600" }}
                            title="Delete Order"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedOrder === o.id && (
                      <tr style={{ background: "#f8fafc" }}>
                        <td colSpan={6} style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                            <div>
                              <h4 style={{ margin: "0 0 1rem 0", color: "#1e293b" }}>Order Metadata</h4>
                              <pre style={{ background: "#fff", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.8rem", overflow: "auto", maxHeight: "300px" }}>
                                {JSON.stringify(o.full_metadata, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <h4 style={{ margin: "0 0 1rem 0", color: "#1e293b" }}>Address & Contact</h4>
                              <p style={{ margin: "0.2rem 0", fontSize: "0.9rem" }}><strong>Phone:</strong> {o.metadata_phone || o.phone}</p>
                              <p style={{ margin: "0.2rem 0", fontSize: "0.9rem" }}><strong>Email:</strong> {o.email}</p>
                              <p style={{ margin: "0.2rem 0", fontSize: "0.9rem" }}><strong>Pincode (DB):</strong> {o.shipping_address?.postal_code}</p>
                              <p style={{ margin: "0.2rem 0", fontSize: "0.9rem" }}><strong>Full Address:</strong> {o.shipping_address?.street}, {o.shipping_address?.city}, {o.shipping_address?.state}</p>
                              <div style={{ marginTop: "1rem" }}>
                                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#1e293b" }}>Internal Details</h4>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>PGID: {o.id} | Token: {o.order_token}</span>
                                  {o.items.map((it: any, i: number) => (
                                    <div key={i} style={{ fontSize: "0.8rem", color: "#ba8160", fontWeight: "600" }}>
                                      {it.product_name} ({it.color}): {it.catalogue_name || 'N/A'} | {it.serial_number || 'N/A'}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
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

export default AdminOrdersComprehensive;
