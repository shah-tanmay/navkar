import styled from "styled-components";
import COLORS from "../../constants/color";

export const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${COLORS.accent}; /* Off-white for stark contrast */
  font-family: "Outfit", sans-serif;
`;

export const Sidebar = styled.aside`
  width: 280px;
  background-color: #0f172a; /* Premium Navy/Charcoal */
  color: #f8fafc;
  padding: 2.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

export const SidebarLink = styled.div<{ $active?: boolean }>`
  padding: 0.85rem 1.25rem;
  border-radius: 10px;
  background-color: ${(props) => (props.$active ? "rgba(212, 175, 55, 0.15)" : "transparent")};
  color: ${(props) => (props.$active ? "#D4AF37" : "#94a3b8")};
  cursor: pointer;
  font-weight: ${(props) => (props.$active ? "600" : "500")};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 2px;

  &:hover {
    background-color: ${(props) => (props.$active ? "rgba(212, 175, 55, 0.15)" : "rgba(255, 255, 255, 0.05)")};
    color: ${(props) => (props.$active ? "#D4AF37" : "#f1f5f9")};
  }
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 3rem 4rem;
  overflow-y: auto;
  position: relative;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.2rem;
    color: ${COLORS.secondary};
    margin: 0;
    font-weight: 700;
    letter-spacing: -0.5px;
  }
`;

export const Card = styled.div`
  background: ${COLORS.primary};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0,0,0,0.02);
`;
