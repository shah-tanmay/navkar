import { NextPage } from "next";
import { AdminLayout } from "../../../components/AdminLayout";
import { Card } from "../../../components/AdminLayout/styles";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "../../../lib/axios";
import { toast } from "react-toastify";
import styled from "styled-components";
import { FaWhatsapp, FaCheck, FaExternalLinkAlt } from "react-icons/fa";

const LeadCard = styled(Card)`
  margin-bottom: 1rem;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-left: 4px solid #D4AF37;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const LeadInfo = styled.div`
  flex: 1;
  h3 { margin: 0 0 0.5rem; color: #111; display: flex; align-items: center; gap: 0.5rem; }
  p { margin: 0.25rem 0; color: #4b5563; font-size: 0.9rem; }
  .token { font-family: monospace; background: #f3f4f6; padding: 2px 4px; border-radius: 4px; font-size: 0.8rem; }
`;

const LeadActions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const ActionButton = styled.button<{ $variant?: "success" | "primary" }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: ${props => props.$variant === "success" ? "#10b981" : "#3b82f6"};
  color: white;

  &:hover { opacity: 0.9; transform: translateY(-1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Badge = styled.span`
  background: #fef3c7;
  color: #92400e;
  padding: 2px 8px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const CODLeadsPage: NextPage = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const res = await axios.get("/admin/cod-leads");
      setLeads(res.data || []);
      setLoading(false);
    } catch (e) {
      toast.error("Failed to sync leads");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleConvert = async (orderId: string) => {
    if (!confirm("Are you sure you want to mark this lead as CONVERTED? This will set the order status to PAID and allow the customer to track it.")) return;
    
    try {
      // 1. Mark as Paid and Confirmed
      await axios.put(`/admin/orders/${orderId}`, {
        payment_status: "paid",
        status: "confirmed"
      });

      // 2. Add 'received' status to tracking timeline
      await axios.post(`/admin/orders/${orderId}/tracking`, {
        status: "received",
        notes: "COD Order confirmed and received by Admin."
      });

      toast.success("Lead converted to Order successfully!");
      fetchLeads();
    } catch (e) {
      toast.error("Failed to convert lead");
    }
  };

  const openWhatsApp = (phone: string, token: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanPhone}`, "_blank");
  };

  return (
    <>
      <Head>
        <title>COD Inquiry Leads | Navkar Admin</title>
      </Head>
      <AdminLayout title="COD Inquiry Leads">
        <p style={{ marginBottom: "2rem", color: "#64748b" }}>
          The following users clicked the "WhatsApp for C.O.D" button. 
          Contact them and mark as converted once you receive proof of payment or confirm the order.
        </p>

        {loading ? (
          <div>Syncing leads...</div>
        ) : leads.length === 0 ? (
          <Card>No active COD inquiry leads found.</Card>
        ) : (
          leads.map((lead) => (
            <LeadCard key={lead.id}>
              <LeadInfo>
                <h3>
                  {lead.metadata_name || "Guest User"} 
                  <Badge>COD Requested</Badge>
                </h3>
                <p><strong>Phone:</strong> {lead.metadata_phone || lead.shipping_phone || "---"}</p>
                <p><strong>Total:</strong> ₹{lead.total_amount}</p>
                <p><strong>Items:</strong> {lead.items?.map((i: any) => `${i.quantity}x ${i.product_name}`).join(", ")}</p>
                <p>
                  <strong>Address:</strong> {lead.shipping_address?.street}, {lead.shipping_address?.city}
                </p>
                <p style={{ marginTop: "0.5rem" }}>
                  <span className="token">Order Token: {lead.order_token}</span>
                </p>
              </LeadInfo>
              <LeadActions>
                <ActionButton 
                  onClick={() => openWhatsApp(lead.metadata_phone || lead.shipping_phone || "", lead.order_token)}
                >
                  <FaWhatsapp /> Chat
                </ActionButton>
                <ActionButton 
                  $variant="success"
                  onClick={() => handleConvert(lead.id)}
                >
                  <FaCheck /> Mark Converted
                </ActionButton>
              </LeadActions>
            </LeadCard>
          ))
        )}
      </AdminLayout>
    </>
  );
};

export default CODLeadsPage;
