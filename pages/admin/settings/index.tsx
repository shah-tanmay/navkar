import { NextPage } from "next";
import { AdminLayout } from "../../../components/AdminLayout";
import { Card } from "../../../components/AdminLayout/styles";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "../../../lib/axios";
import { toast } from "react-toastify";
import styled from "styled-components";

const SettingsForm = styled.div`
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-weight: 600;
    color: #374151;
  }
  
  input {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #ba8160;
      box-shadow: 0 0 0 3px rgba(186, 129, 96, 0.1);
    }
  }
  
  .hint {
    font-size: 0.85rem;
    color: #6b7280;
  }
`;

const SaveButton = styled.button`
  background: #ba8160;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
  
  &:hover {
    background: #a67152;
  }
  
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;

const AdminSettings: NextPage = () => {
  const [stitchingFee, setStitchingFee] = useState<string>("100");
  const [deliveryTimeline, setDeliveryTimeline] = useState<string>("5-7 business days");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<string>("2000");
  const [shippingFee, setShippingFee] = useState<string>("50");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("/admin/settings");
        if (res.data.stitching_fee) {
          setStitchingFee(res.data.stitching_fee.toString());
        }
        if (res.data.delivery_timeline) {
          setDeliveryTimeline(res.data.delivery_timeline);
        }
        if (res.data.free_shipping_threshold) {
          setFreeShippingThreshold(res.data.free_shipping_threshold.toString());
        }
        if (res.data.standard_shipping_fee) {
          setShippingFee(res.data.standard_shipping_fee.toString());
        }
        setLoading(false);
      } catch (e) {
        toast.error("Failed to load settings");
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save Stitching Fee
      await axios.post("/admin/settings", {
        key: "stitching_fee",
        value: stitchingFee
      });
      
      // Save Delivery Timeline
      await axios.post("/admin/settings", {
        key: "delivery_timeline",
        value: deliveryTimeline
      });

      // Save Free Shipping Threshold
      await axios.post("/admin/settings", {
        key: "free_shipping_threshold",
        value: freeShippingThreshold
      });

      // Save Standard Shipping Fee
      await axios.post("/admin/settings", {
        key: "standard_shipping_fee",
        value: shippingFee
      });

      toast.success("All settings saved successfully");
    } catch (e) {
      toast.error("Failed to save some settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout title="Site Settings">Loading Settings...</AdminLayout>;

  return (
    <>
      <Head>
        <title>Settings | Navkar Admin</title>
      </Head>
      <AdminLayout title="Global Site Settings">
        <Card>
          <SettingsForm>
            <FormGroup>
              <label>Custom Curtain Stitching Fee (INR)</label>
              <input 
                type="number" 
                value={stitchingFee} 
                onChange={(e) => setStitchingFee(e.target.value)}
                placeholder="100"
              />
              <div className="hint">Added to every custom curtain panel in price calculation.</div>
            </FormGroup>

            <FormGroup>
              <label>Delivery Timeline Label</label>
              <input 
                type="text" 
                value={deliveryTimeline} 
                onChange={(e) => setDeliveryTimeline(e.target.value)}
                placeholder="5-7 business days"
              />
              <div className="hint">Shows up on product pages (e.g., "Delivered in 5-7 business days").</div>
            </FormGroup>

            <FormGroup>
              <label>Free Shipping Threshold (INR)</label>
              <input 
                type="number" 
                value={freeShippingThreshold} 
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                placeholder="2000"
              />
              <div className="hint">Minimum order value for free shipping.</div>
            </FormGroup>

            <FormGroup>
              <label>Standard Shipping Fee (INR)</label>
              <input 
                type="number" 
                value={shippingFee} 
                onChange={(e) => setShippingFee(e.target.value)}
                placeholder="50"
              />
              <div className="hint">Charged for orders below the threshold.</div>
            </FormGroup>
            
            <SaveButton onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save All Settings"}
            </SaveButton>
          </SettingsForm>
        </Card>
      </AdminLayout>
    </>
  );
};

export default AdminSettings;
