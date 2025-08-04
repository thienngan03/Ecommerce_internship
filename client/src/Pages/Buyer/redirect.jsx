import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BuyerOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("order_id")) {
      navigate("/buyer/order", { replace: true });
    }
  }, [location.search, navigate]);
};

export default BuyerOrder;
