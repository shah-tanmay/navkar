import { NextPage } from "next";
import { AdminLayout } from "../../../components/AdminLayout";
import { Card } from "../../../components/AdminLayout/styles";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "../../../lib/axios";
import { toast } from "react-toastify";

const AdminPincodes: NextPage = () => {
  const [pincodes, setPincodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPincode, setNewPincode] = useState("");

  const fetchPincodes = async () => {
    try {
      const res = await axios.get("/admin/pincodes");
      setPincodes(res.data);
      setLoading(false);
    } catch (e) {
      toast.error("Failed to load pincodes");
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPincode.length !== 6) return toast.warning("Pincode must be 6 digits");
    try {
      await axios.post("/admin/pincodes", { pincode: newPincode });
      toast.success("Pincode Added");
      setNewPincode("");
      fetchPincodes();
    } catch (e) {
      toast.error("Failed to add pincode");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`/admin/pincodes/${id}`);
      toast.success("Pincode Removed");
      fetchPincodes();
    } catch (e) {
      toast.error("Deletion failed");
    }
  };

  useEffect(() => {
    fetchPincodes();
  }, []);

  return (
    <>
      <Head>
        <title>Pincode Manager | Navkar Admin</title>
      </Head>
      <AdminLayout title="Pincode Serviceability Manager">
        <Card style={{ marginBottom: "2rem", maxWidth: "500px" }}>
          <h3 style={{ marginBottom: "1rem" }}>📍 Add Serviceable Pincode</h3>
          <form onSubmit={handleAdd} style={{ display: "flex", gap: "1rem" }}>
            <input 
              value={newPincode} 
              onChange={(e) => setNewPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit Pincode" 
              style={{ flex: 1, padding: "0.8rem", borderRadius: "4px", border: "1px solid #ddd" }}
              required 
            />
            <button type="submit" style={{ background: "#111", color: "#D4AF37", border: "none", borderRadius: "4px", padding: "0.8rem 1.5rem", cursor: "pointer", fontWeight: "bold" }}>
              Add Zone
            </button>
          </form>
        </Card>

        <Card style={{ maxWidth: "800px" }}>
          {loading ? (
            <p>Loading Pincodes...</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "1rem" }}>
              {pincodes.map((p) => (
                <div key={p.id} style={{ border: "1px solid #eee", padding: "0.75rem", borderRadius: "8px", position: "relative", textAlign: "center", background: "#fcfcfc" }}>
                  <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{p.pincode}</div>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    style={{ background: "none", border: "none", color: "#F44336", fontSize: "0.7rem", cursor: "pointer", marginTop: "0.5rem" }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {pincodes.length === 0 && <p>No specific pincodes added. (All zones might be open if logic allows fallback).</p>}
            </div>
          )}
        </Card>
      </AdminLayout>
    </>
  );
};

export default AdminPincodes;
