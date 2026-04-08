import { NextPage } from "next";
import { AdminLayout } from "../../../components/AdminLayout";
import { Card } from "../../../components/AdminLayout/styles";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "../../../lib/axios";
import { toast } from "react-toastify";

const AdminInventory: NextPage = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [updating, setUpdating] = useState(false);

  const fetchInventory = async () => {
    try {
      const res = await axios.get("/admin/inventory");
      setInventory(res.data);
      setLoading(false);
    } catch (e) {
      toast.error("Failed to load inventory");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async (id: string) => {
    setUpdating(true);
    try {
      await axios.put(`/admin/inventory/${id}`, { stock: editValue });
      toast.success("Inventory updated");
      setEditingId(null);
      fetchInventory();
    } catch (e) {
      toast.error("Failed to update inventory");
    } finally {
      setUpdating(false);
    }
  };

  const startEditing = (item: any) => {
    setEditingId(item.id);
    setEditValue(item.stock);
  };

  return (
    <>
      <Head>
        <title>Inventory Tracker | Navkar Admin</title>
      </Head>
      <AdminLayout title="Inventory Tracker">
        <Card>
          {loading ? (
            <p>Loading Inventory...</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Product</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Variant (Color)</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Type / Size</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Current Stock</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Status</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid #e2e8f0" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => {
                    const isLowStock = item.stock < 10;
                    const isEditing = editingId === item.id;

                    return (
                      <tr key={item.id} style={{ background: isLowStock ? "rgba(255, 77, 79, 0.05)" : "transparent" }}>
                        <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>{item.product_name}</td>
                        <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>{item.color}</td>
                        <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>{item.type}</td>
                        <td style={{ 
                          padding: "1rem", 
                          borderBottom: "1px solid #e2e8f0", 
                          fontWeight: isLowStock ? "bold" : "normal",
                          color: isLowStock ? "#ff4d4f" : "#111"
                        }}>
                          {isEditing ? (
                            <input 
                              type="number" 
                              value={editValue} 
                              onChange={(e) => setEditValue(parseInt(e.target.value) || 0)} 
                              style={{ width: "80px", padding: "0.3rem", borderRadius: "4px", border: "1px solid #ddd" }}
                              autoFocus
                            />
                          ) : (
                            <>{item.stock} units</>
                          )}
                        </td>
                        <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
                          {isLowStock ? (
                            <span style={{ 
                              background: "#ffccc7", 
                              color: "#cf1322", 
                              padding: "0.2rem 0.6rem", 
                              borderRadius: "4px", 
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                              border: "1px solid #ffa39e"
                            }}>
                              LOW STOCK
                            </span>
                          ) : (
                            <span style={{ color: "#389e0d", fontSize: "0.8rem", fontWeight: "bold" }}>● Healthy</span>
                          )}
                        </td>
                        <td style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
                          {isEditing ? (
                            <>
                              <button 
                                onClick={() => handleUpdateStock(item.id)} 
                                disabled={updating}
                                style={{ background: "#d4af37", color: "white", border: "none", padding: "0.3rem 0.8rem", borderRadius: "4px", cursor: "pointer", marginRight: "0.5rem" }}
                              >
                                {updating ? "..." : "Save"}
                              </button>
                              <button 
                                onClick={() => setEditingId(null)} 
                                style={{ background: "#f0f0f0", border: "none", padding: "0.3rem 0.8rem", borderRadius: "4px", cursor: "pointer" }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => startEditing(item)} 
                              style={{ background: "transparent", border: "1px solid #d4af37", color: "#d4af37", padding: "0.3rem 0.8rem", borderRadius: "4px", cursor: "pointer" }}
                            >
                              Edit Stock
                            </button>
                          )}
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

export default AdminInventory;
