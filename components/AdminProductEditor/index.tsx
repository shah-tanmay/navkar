import React, { useState, useEffect, useMemo, useCallback } from "react";
import * as S from "./styles";
import axios from "../../lib/axios";
import { toast } from "react-toastify";
import { Product } from "../../types/api";
import { useRouter } from "next/router";
import _ from "lodash";

interface AdminProductEditorProps {
  editProduct?: Product | null;
}

export const AdminProductEditor: React.FC<AdminProductEditorProps> = ({ editProduct }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("base");
  
  interface BaseFormState {
    name: string;
    description: string;
    price: string;
    stock: string;
    features: string;
    sizes: string;
    image_main: string;
    fabric_material: string;
    fabric_gsm: string;
    fabric_opacity: string;
    fabric_lining: string;
    wash_care: string;
    is_discontinued: boolean;
    tag: string;
    is_blackout: boolean;
    door_size: string;
    window_size: string;
    sold_as: string;
  }

  // Base Product Data
  const [baseForm, setBaseForm] = useState<BaseFormState>({
    name: "",
    description: "",
    price: "",
    stock: "",
    features: "Premium Grade Fabric\nElegant Drape & Flow\nLight Filtering / Blackout Efficiency\nWrinkle Resistant Maintenance\nEasy Installation Eyelets",
    sizes: "",
    image_main: "",
    fabric_material: "Premium High-Density Polyester Blend",
    fabric_gsm: "280 GSM",
    fabric_opacity: "Room Darkening / Blackout",
    fabric_lining: "Unlined",
    wash_care: "Machine wash cold, gentle cycle. Use mild detergent. Tumble dry low. Do not bleach. Warm iron if needed.",
    is_discontinued: false,
    tag: "sale",
    is_blackout: false,
    door_size: "7ft × 4ft (214cm × 120cm)",
    window_size: "5ft × 4ft (152cm × 120cm)",
    sold_as: "1 panel",
  });

  // Variant Data Context (Shared for a Color Group)
  const [variantForm, setVariantForm] = useState({
    color: "",
    color_hex_code: "",
    image_main: "",
    image_g1: "",
    image_g2: "",
    image_g3: "",
    variant_description: "",
    // Map of type -> { price, stock, id }
    types: {} as Record<string, { id?: string; price: string; stock: string; exists: boolean }>,
  });
  // Local product state — initialized from prop, refreshed after saves
  const [productData, setProductData] = useState<any>(editProduct);

  useEffect(() => {
    setProductData(editProduct);
  }, [editProduct]);

  const productId = productData?.id || productData?.product_id;
  const variants = productData?.variants || [];

  // Re-fetch product from API without a full page reload
  const refreshProduct = useCallback(async () => {
    if (!productId) return;
    try {
      const res: any = await axios.get(`/products/${productId}`);
      setProductData(res.data.product);
    } catch (e) {
      console.error("[AdminEditor] Failed to refresh product data", e);
    }
  }, [productId]);
  
  // Derive available types from existing variants + base form sizes
  // useMemo prevents a new array reference on every render, which was
  // causing the variant useEffect to re-fire and wipe user input.
  const availableTypes = useMemo<string[]>(() => {
    const fromBase = baseForm.sizes.split(",").map(s => s.trim()).filter(Boolean);
    const fromVariants = _.uniq(variants.map((v: any) => v.type).filter(Boolean));
    const merged = _.uniq([...fromBase, ...fromVariants]);
    if (merged.length === 0) return ["Window", "Door", "Long Door"];
    return merged as string[];
  }, [baseForm.sizes, variants]);

  useEffect(() => {
    if (editProduct) {
      const p = editProduct as any;
      const meta = p.metadata || {};
      console.log("[AdminEditor] Product loaded:", { id: p.id, product_id: p.product_id, name: p.name });
      console.log("[AdminEditor] Metadata keys:", Object.keys(meta));
      console.log("[AdminEditor] fabric_details:", meta.fabric_details);
      setBaseForm({
        name: p.name || "",
        description: p.description || "",
        price: (p.price || 0).toString(),
        stock: (p.stock || 0).toString(),
        features: (meta.features || []).join("\n"),
        sizes: (meta.available_sizes || meta.sizes || []).join(", "),
        image_main: p.image_url || "",
        fabric_material: meta.fabric_details?.material || "",
        fabric_gsm: meta.fabric_details?.gsm || "",
        fabric_opacity: meta.fabric_details?.opacity || "",
        fabric_lining: meta.fabric_details?.lining || "",
        wash_care: meta.wash_care || "",
        is_discontinued: p.is_discontinued || false,
        tag: p.tag || "sale",
        is_blackout: p.is_blackout || false,
        door_size: meta.size_guide?.door || "7ft × 4ft (214cm × 120cm)",
        window_size: meta.size_guide?.window || "5ft × 4ft (152cm × 120cm)",
        sold_as: meta.sold_as || "1 panel",
      });
    }
  }, [editProduct]);


  useEffect(() => {
    if (activeTab === "base") {
      if (productData) {
        const meta = productData.metadata || {};
        setBaseForm({
          name: productData.name || "",
          description: productData.description || "",
          price: (productData.price || 0).toString(),
          stock: (productData.stock || 0).toString(),
          features: (meta.features || []).join("\n"),
          sizes: (meta.available_sizes || meta.sizes || []).join(", "),
          image_main: productData.image_url || "",
          fabric_material: meta.fabric_details?.material || "",
          fabric_gsm: meta.fabric_details?.gsm || "",
          fabric_opacity: meta.fabric_details?.opacity || "",
          fabric_lining: meta.fabric_details?.lining || "",
          wash_care: meta.wash_care || "",
          is_discontinued: productData.is_discontinued || false,
          tag: productData.tag || "sale",
          is_blackout: productData.is_blackout || false,
          door_size: meta.size_guide?.door || "7ft × 4ft (214cm × 120cm)",
          window_size: meta.size_guide?.window || "5ft × 4ft (152cm × 120cm)",
          sold_as: meta.sold_as || "1 panel",
        });
      }
    } else if (activeTab === "new_color") {
      setVariantForm({
        color: "", color_hex_code: "", 
        image_main: "", image_g1: "", image_g2: "", image_g3: "",
        variant_description: "",
        types: availableTypes.reduce((acc: Record<string, { id?: string; price: string; stock: string; exists: boolean }>, t: string) => ({ ...acc, [t]: { price: "", stock: "", exists: false } }), {})
      });
    } else {
      // activeTab is color_hex_code
      const colorVariants = variants.filter((v: any) => v.color_hex_code === activeTab);
      if (colorVariants.length > 0) {
        const first = colorVariants[0];
        const meta = first.metadata || {};
        const gallery = meta.gallery_images || [];
        
        const typeMap: Record<string, { id?: string; price: string; stock: string; exists: boolean }> = availableTypes.reduce((acc: any, t: string) => {
          const v = colorVariants.find((v: any) => v.type === t);
          return {
            ...acc,
            [t]: v ? { id: v.id, price: (v.price || 0).toString(), stock: (v.stock || 0).toString(), exists: true } 
                   : { price: "", stock: "", exists: false }
          };
        }, {});

        setVariantForm({
          color: first.name || "",
          color_hex_code: first.color_hex_code || "",
          image_main: first.image_url || "",
          image_g1: gallery[0] || "",
          image_g2: gallery[1] || "",
          image_g3: gallery[2] || "",
          variant_description: meta.variant_description || "",
          types: typeMap
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, productData]);


  const handleGlobalSave = async () => {
    setLoading(true);
    try {
      const payload = {
        name: baseForm.name,
        description: baseForm.description,
        price: parseFloat(baseForm.price) || 0,
        stock: parseInt(baseForm.stock, 10) || 0,
        image_url: baseForm.image_main,
        metadata: {
          ...((editProduct as any)?.metadata || {}),
          features: baseForm.features.split("\n").map(s => s.trim()).filter(Boolean),
          available_sizes: availableTypes,
          fabric_details: {
            material: baseForm.fabric_material,
            gsm: baseForm.fabric_gsm,
            opacity: baseForm.fabric_opacity,
            lining: baseForm.fabric_lining,
          },
          wash_care: baseForm.wash_care,
          size_guide: {
            door: baseForm.door_size,
            window: baseForm.window_size,
          },
          sold_as: baseForm.sold_as,
        },
        is_discontinued: baseForm.is_discontinued,
        tag: baseForm.tag,
        is_blackout: baseForm.is_blackout,
      };

      if (editProduct && productId) {
        console.log(`[AdminEditor] Saving global data to product ID: ${productId}`);
        await axios.put(`/products/${productId}`, payload);
        toast.success("Global Product Data Updated!");
        await refreshProduct();
      } else {
        const res: any = await axios.post("/products", payload);
        toast.success("Product Anchor Created!");
        router.push(`/admin/products/edit/${res.data.product?.id || res.data.id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save base product.");
    } finally {
      setLoading(false);
    }
  };

  const handleVariantSave = async () => {
    if (!editProduct) return;
    setLoading(true);
    try {
      const galleryArray = [variantForm.image_g1, variantForm.image_g2, variantForm.image_g3].filter(Boolean);
      
      const commonData = {
        color: variantForm.color,
        color_hex_code: variantForm.color_hex_code,
        image_url: variantForm.image_main,
        metadata: { 
          gallery_images: galleryArray,
          variant_description: variantForm.variant_description,
        },
      };

      console.log(`[AdminEditor] Saving Variants for ${productId}`, { color: variantForm.color, types: Object.keys(variantForm.types) });

      // We need to loop over defined types and update/create them
      const promises = Object.entries(variantForm.types).map(async ([type, data]) => {
        if (!data.exists && (!data.price || !data.stock)) {
          console.log(`[AdminEditor] Skipping inactive type: ${type}`);
          return;
        }

        const payload = {
          ...commonData,
          type,
          price: parseFloat(data.price) || 0,
          stock: parseInt(data.stock, 10) || 0,
        };

        if (data.id) {
          console.log(`[AdminEditor] Updating existing variant: ${data.id} (${type})`);
          return axios.put(`/products/productvariant/${data.id}`, payload);
        } else {
          console.log(`[AdminEditor] Creating new variant: ${type}`);
          return axios.post(`/products/${productId}/variants`, payload);
        }
      });

      await Promise.all(promises);
      toast.success(`Color Group '${variantForm.color}' Synced!`);
      await refreshProduct();
    } catch (err) {
      console.error("[AdminEditor] Variant Save Error:", err);
      toast.error("Failed to save variations.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVariant = async (vid: string) => {
    if (!window.confirm("Remove this variant?")) return;
    try {
      await axios.delete(`/products/productvariant/${vid}`);
      toast.success("Variant removed");
      router.reload();
    } catch (err) {
      toast.error("Failed to delete variant");
    }
  };

  return (
    <S.EditorWrapper>
      <S.StickyHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <S.Button onClick={() => router.push("/admin/products")}>&larr; Back</S.Button>
          <h2 style={{ margin: 0 }}>{editProduct ? `Editing: ${baseForm.name}` : "New Product Creation"}</h2>
        </div>
        <div className="actions">
          {activeTab === "base" ? (
            <S.Button $variant="primary" onClick={handleGlobalSave} disabled={loading}>
              {loading ? "Saving..." : editProduct ? "Update Global Rules" : "Create Product Anchor"}
            </S.Button>
          ) : (
            <S.Button $variant="primary" onClick={handleVariantSave} disabled={loading}>
              {loading ? "Locking in..." : activeTab === "new_color" ? "Save New Color Group" : "Update Color Group"}
            </S.Button>
          )}
        </div>
      </S.StickyHeader>

      <S.VariantSection>
        <S.VariantSidebar>
          <S.VariantItem 
            $active={activeTab === "base"} 
            onClick={() => setActiveTab("base")}
          >
            <div className="info">Global Information<span>General settings & fallback</span></div>
          </S.VariantItem>
          
          {editProduct && (
            <>
              <div style={{ marginTop: "1rem", fontSize: "0.8rem", fontWeight: "bold", opacity: 0.5, letterSpacing: "1px", textTransform: "uppercase" }}>Color Variations</div>
              {/* Group variants by color hex for sidebar */}
              {_.uniqBy(variants, "color_hex_code").map((v: any) => (
                <S.VariantItem 
                  key={v.color_hex_code} 
                  $active={activeTab === v.color_hex_code} 
                  onClick={() => setActiveTab(v.color_hex_code)}
                >
                  <div className="swatch" style={{ background: v.color_hex_code }} />
                  <div className="info">
                    {v.name}
                    <span>{variants.filter((vx: any) => vx.color_hex_code === v.color_hex_code).length} Types Attached</span>
                  </div>
                </S.VariantItem>
              ))}
              <S.VariantItem 
                $active={activeTab === "new_color"} 
                onClick={() => setActiveTab("new_color")}
                style={{ borderStyle: "dashed", borderColor: "#ccc" }}
              >
                <div className="info" style={{ color: "#777" }}>+ Add Color Group<span>New color palette</span></div>
              </S.VariantItem>
            </>
          )}
        </S.VariantSidebar>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {activeTab === "base" ? (
            <>
              <S.Card>
                <S.SectionTitle>Identity & Description</S.SectionTitle>
                <S.FormGrid>
                  <S.FormGroup $fullWidth>
                    <label>Product Global Name</label>
                    <input value={baseForm.name} onChange={e => setBaseForm({...baseForm, name: e.target.value})} placeholder="e.g. Navkar Premium Velvet Curtains" />
                  </S.FormGroup>
                  <S.FormGroup $fullWidth>
                    <label>Rich Description</label>
                    <textarea value={baseForm.description} onChange={e => setBaseForm({...baseForm, description: e.target.value})} />
                  </S.FormGroup>
                  <S.FormGroup>
                    <label>Available Types / Sizes (Comma separated)</label>
                    <input 
                      value={baseForm.sizes} 
                      onChange={e => setBaseForm({...baseForm, sizes: e.target.value})} 
                      placeholder="e.g. Window, Door, Long Door"
                    />
                  </S.FormGroup>
                  <S.FormGroup>
                    <label style={{ display: "flex", justifyContent: "space-between" }}>
                      Key Features (One per line)
                      <button 
                        type="button" 
                        onClick={() => setBaseForm({...baseForm, features: "Premium Grade Fabric\nElegant Drape & Flow\nLight Filtering Efficiency\nWrinkle Resistant Maintenance\nEasy Installation Eyelets"})}
                        style={{ background: "none", border: "none", color: "#005aee", fontSize: "0.7rem", cursor: "pointer", textDecoration: "underline" }}
                      >
                        Reset to Defaults
                      </button>
                    </label>
                    <textarea value={baseForm.features} onChange={e => setBaseForm({...baseForm, features: e.target.value})} />
                  </S.FormGroup>
                  <S.FormGroup>
                    <label>Promotional Tag / Label</label>
                    <select
                      value={baseForm.tag}
                      onChange={(e) => setBaseForm({ ...baseForm, tag: e.target.value })}
                      style={{ 
                        width: "100%", 
                        padding: "0.6rem", 
                        borderRadius: "8px", 
                        border: "1px solid #d9d9d9", 
                        fontSize: "0.95rem",
                        background: "white",
                        height: "40px"
                      }}
                    >
                      <option value="new">🆕 NEW ARRIVAL</option>
                      <option value="sale">🔥 SALE</option>
                      <option value="premium">✨ PREMIUM</option>
                      <option value="limited">⏳ LIMITED</option>
                      <option value="eco">🌿 ECO FRIENDLY</option>
                    </select>
                  </S.FormGroup>
                   <S.FormGroup $fullWidth>
                    <label>Product Status & Type</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: baseForm.is_discontinued ? "#fff1f0" : "#f6ffed", borderRadius: "8px", border: "1px solid", borderColor: baseForm.is_discontinued ? "#ffa39e" : "#b7eb8f" }}>
                        <input 
                          type="checkbox" 
                          id="is_discontinued"
                          checked={baseForm.is_discontinued} 
                          onChange={e => setBaseForm({...baseForm, is_discontinued: e.target.checked})} 
                          style={{ width: "18px", height: "18px", cursor: "pointer" }}
                        />
                        <label htmlFor="is_discontinued" style={{ margin: 0, cursor: "pointer", color: baseForm.is_discontinued ? "#cf1322" : "#389e0d", fontWeight: "bold", fontSize: "0.85rem" }}>
                          {baseForm.is_discontinued ? "DISCONTINUED (HIDDEN)" : "ACTIVE (SHOWN)"}
                        </label>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: baseForm.is_blackout ? "#e6f7ff" : "#f5f5f5", borderRadius: "8px", border: "1px solid", borderColor: baseForm.is_blackout ? "#91d5ff" : "#d9d9d9" }}>
                        <input 
                          type="checkbox" 
                          id="is_blackout"
                          checked={baseForm.is_blackout} 
                          onChange={e => setBaseForm({...baseForm, is_blackout: e.target.checked})} 
                          style={{ width: "18px", height: "18px", cursor: "pointer" }}
                        />
                        <label htmlFor="is_blackout" style={{ margin: 0, cursor: "pointer", color: baseForm.is_blackout ? "#0050b3" : "#595959", fontWeight: "bold", fontSize: "0.85rem" }}>
                          {baseForm.is_blackout ? "BLACKOUT PRODUCT" : "REGULAR PRODUCT"}
                        </label>
                      </div>
                    </div>
                  </S.FormGroup>
                </S.FormGrid>
              </S.Card>

              <S.Card>
                <S.SectionTitle>Measurements & Packaging</S.SectionTitle>
                <S.FormGrid>
                  <S.FormGroup><label>Door Size Label</label><input value={baseForm.door_size} onChange={e => setBaseForm({...baseForm, door_size: e.target.value})} placeholder="e.g. 7ft × 4ft (214cm × 120cm)" /></S.FormGroup>
                  <S.FormGroup><label>Window Size Label</label><input value={baseForm.window_size} onChange={e => setBaseForm({...baseForm, window_size: e.target.value})} placeholder="e.g. 5ft × 4ft (152cm × 120cm)" /></S.FormGroup>
                  <S.FormGroup><label>Sold As</label><input value={baseForm.sold_as} onChange={e => setBaseForm({...baseForm, sold_as: e.target.value})} placeholder="e.g. 1 panel" /></S.FormGroup>
                </S.FormGrid>
              </S.Card>

              <S.Card>
                <S.SectionTitle>Fabric & Care Details</S.SectionTitle>
                <S.FormGrid>
                  <S.FormGroup>
                    <label>Material</label>
                    <input value={baseForm.fabric_material} onChange={e => setBaseForm({...baseForm, fabric_material: e.target.value})} />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                      {["Premium Polyester Blend", "Velvet Touch Synthetic", "Linen-Look Polyester", "Cotton Canvas"].map(opt => (
                        <button key={opt} type="button" onClick={() => setBaseForm({...baseForm, fabric_material: opt})} style={{ padding: "2px 6px", fontSize: "10px", background: "#f0f0f0", border: "1px solid #d9d9d9", borderRadius: "4px", cursor: "pointer" }}>{opt}</button>
                      ))}
                    </div>
                  </S.FormGroup>
                  <S.FormGroup>
                    <label>GSM</label>
                    <input value={baseForm.fabric_gsm} onChange={e => setBaseForm({...baseForm, fabric_gsm: e.target.value})} />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                      {["180 GSM", "210 GSM", "250 GSM", "280 GSM", "320 GSM"].map(opt => (
                        <button key={opt} type="button" onClick={() => setBaseForm({...baseForm, fabric_gsm: opt})} style={{ padding: "2px 6px", fontSize: "10px", background: "#f0f0f0", border: "1px solid #d9d9d9", borderRadius: "4px", cursor: "pointer" }}>{opt}</button>
                      ))}
                    </div>
                  </S.FormGroup>
                  <S.FormGroup>
                    <label>Opacity</label>
                    <input value={baseForm.fabric_opacity} onChange={e => setBaseForm({...baseForm, fabric_opacity: e.target.value})} />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                      {["Room Darkening (70-80%)", "Blackout (95%+)", "Semi-Sheer", "Translucent"].map(opt => (
                        <button key={opt} type="button" onClick={() => setBaseForm({...baseForm, fabric_opacity: opt})} style={{ padding: "2px 6px", fontSize: "10px", background: "#f0f0f0", border: "1px solid #d9d9d9", borderRadius: "4px", cursor: "pointer" }}>{opt}</button>
                      ))}
                    </div>
                  </S.FormGroup>
                  <S.FormGroup>
                    <label>Lining</label>
                    <input value={baseForm.fabric_lining} onChange={e => setBaseForm({...baseForm, fabric_lining: e.target.value})} />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                      {["Unlined", "Lined (White Fabric)", "Lined (Blackout Fabric)"].map(opt => (
                        <button key={opt} type="button" onClick={() => setBaseForm({...baseForm, fabric_lining: opt})} style={{ padding: "2px 6px", fontSize: "10px", background: "#f0f0f0", border: "1px solid #d9d9d9", borderRadius: "4px", cursor: "pointer" }}>{opt}</button>
                      ))}
                    </div>
                  </S.FormGroup>
                  <S.FormGroup $fullWidth>
                    <label>Wash Care Instructions</label>
                    <textarea value={baseForm.wash_care} onChange={e => setBaseForm({...baseForm, wash_care: e.target.value})} />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                      {["Machine wash cold, gentle cycle. Use mild detergent. Tumble dry low. Do not bleach. Warm iron if needed.", "Dry clean recommended. Do not hand wash. Warm iron only.", "Hand wash cold. Do not wring. Drip dry in shade. Low iron."].map((opt, i) => (
                        <button key={i} type="button" onClick={() => setBaseForm({...baseForm, wash_care: opt})} style={{ padding: "2px 6px", fontSize: "10px", background: "#f0f0f0", border: "1px solid #d9d9d9", borderRadius: "4px", cursor: "pointer", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Option {i+1}</button>
                      ))}
                    </div>
                  </S.FormGroup>
                </S.FormGrid>
              </S.Card>

              <S.Card>
                <S.SectionTitle>Media (Global Fallback)</S.SectionTitle>
                <S.FormGroup>
                  <label>Main Fallback Image URL</label>
                  <input value={baseForm.image_main} onChange={e => setBaseForm({...baseForm, image_main: e.target.value})} />
                </S.FormGroup>
                <S.ImagePreview>
                  {baseForm.image_main ? <img src={baseForm.image_main} alt="Preview" /> : <div className="placeholder">Paste image URL to preview</div>}
                </S.ImagePreview>
              </S.Card>
            </>
          ) : (
            <>
              <S.Card>
                <S.SectionTitle>{activeTab === "new_color" ? "New Color Palette" : "Edit Color Group"}</S.SectionTitle>
                <S.FormGrid>
                  <S.FormGroup>
                    <label>Color Name</label>
                    <input value={variantForm.color} onChange={e => setVariantForm({...variantForm, color: e.target.value})} placeholder="e.g. Emerald Green" />
                  </S.FormGroup>
                  <S.FormGroup>
                    <label>Hex Code</label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input value={variantForm.color_hex_code} onChange={e => setVariantForm({...variantForm, color_hex_code: e.target.value})} placeholder="#000000" style={{ flex: 1 }} />
                      <div style={{ width: "45px", height: "45px", borderRadius: "10px", background: variantForm.color_hex_code || "#eee", border: "1px solid #ddd" }} />
                    </div>
                  </S.FormGroup>
                  <S.FormGroup $fullWidth>
                    <label>Shared Description for this Color</label>
                    <textarea value={variantForm.variant_description} onChange={e => setVariantForm({...variantForm, variant_description: e.target.value})} />
                  </S.FormGroup>
                </S.FormGrid>
              </S.Card>

              <S.Card>
                <S.SectionTitle>Prices & Stock (Per Type)</S.SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {availableTypes.map(type => {
                    const data = variantForm.types[type] || { price: "", stock: "", exists: false };
                    return (
                      <div key={type} style={{ display: "grid", gridTemplateColumns: "150px 1fr 1fr 100px", gap: "1rem", alignItems: "center", padding: "1rem", background: data.exists ? "#f0fdf4" : "#f8fafc", borderRadius: "12px", border: "1px solid", borderColor: data.exists ? "#bbf7d0" : "#e2e8f0" }}>
                        <div style={{ fontWeight: 600 }}>{type}</div>
                        <S.FormGroup style={{ gap: "2px" }}>
                          <label style={{ fontSize: "0.7rem" }}>Price (₹)</label>
                          <input 
                            value={data.price} 
                            onChange={e => setVariantForm({
                              ...variantForm, 
                            types: { ...variantForm.types, [type as string]: { ...data, price: e.target.value } }
                            })} 
                            type="number" 
                          />
                        </S.FormGroup>
                        <S.FormGroup style={{ gap: "2px" }}>
                          <label style={{ fontSize: "0.7rem" }}>Stock</label>
                          <input 
                            value={data.stock} 
                            onChange={e => setVariantForm({
                              ...variantForm, 
                            types: { ...variantForm.types, [type as string]: { ...data, stock: e.target.value } }
                            })} 
                            type="number" 
                          />
                        </S.FormGroup>
                        <div style={{ fontSize: "0.8rem", textAlign: "center" }}>
                          {data.exists ? <span style={{ color: "green" }}>● Active</span> : <span style={{ color: "#94a3b8" }}>○ Inactive</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </S.Card>

              <S.Card>
                <S.SectionTitle>Gallery Management</S.SectionTitle>
                <S.FormGrid>
                  <S.FormGroup $fullWidth>
                    <label>Variant Main Hero Image</label>
                    <input value={variantForm.image_main} onChange={e => setVariantForm({...variantForm, image_main: e.target.value})} />
                  </S.FormGroup>
                  <S.FormGroup><label>Gallery Image 1</label><input value={variantForm.image_g1} onChange={e => setVariantForm({...variantForm, image_g1: e.target.value})} /></S.FormGroup>
                  <S.FormGroup><label>Gallery Image 2</label><input value={variantForm.image_g2} onChange={e => setVariantForm({...variantForm, image_g2: e.target.value})} /></S.FormGroup>
                  <S.FormGroup><label>Gallery Image 3</label><input value={variantForm.image_g3} onChange={e => setVariantForm({...variantForm, image_g3: e.target.value})} /></S.FormGroup>
                </S.FormGrid>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", overflowX: "auto", paddingBottom: "1rem" }}>
                  {[variantForm.image_main, variantForm.image_g1, variantForm.image_g2, variantForm.image_g3].filter(Boolean).map((url, i) => (
                    <img key={i} src={url} style={{ width: "100px", height: "100px", borderRadius: "10px", objectFit: "cover" }} />
                  ))}
                </div>
              </S.Card>

              {activeTab !== "new_color" && (
                <S.Button $variant="danger" onClick={() => {
                  const ids = Object.values(variantForm.types).map(d => d.id).filter(Boolean);
                  if (window.confirm(`Delete ALL variants for this color (${ids.length} items)?`)) {
                    Promise.all(ids.map(id => axios.delete(`/products/productvariant/${id}`)))
                      .then(() => { toast.success("Color group deleted"); router.reload(); });
                  }
                }} style={{ alignSelf: "flex-start" }}>
                  Delete Entire Color Group
                </S.Button>
              )}
            </>
          )}
        </div>
      </S.VariantSection>
    </S.EditorWrapper>
  );
};
