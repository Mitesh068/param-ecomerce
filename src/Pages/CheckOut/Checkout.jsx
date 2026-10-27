import { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AddRounded,
  CheckCircleRounded,
  EditOutlined,
  LocationOnOutlined,
  LocalShippingOutlined,
  LockOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { addAddress, cartList, checkShiprocketServiceability, createOrder, createPayment, createShiprocketOrder, getAddressList, verifyPayment } from "../../Api/services/Services";

const BRAND = "#8b0000";

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

// Reads the logged-in user's id from localStorage.
// Supports a stored "user" object or plain "userId" / "user_id" keys.
const getClientId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const id = user?.id ?? user?.user_id ?? user?._id;
    if (id) return id;
  } catch {
    // "user" isn't valid JSON, fall through to the plain keys
  }
  return localStorage.getItem("userId") || localStorage.getItem("user_id") || null;
};

const emptyForm = {
  full_name: "",
  phone: "",
  email: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  address_type: "home",
  is_default: false,
};

const ADDRESS_TYPES = [
  { value: "home", label: "Home" },
  { value: "work", label: "Work" },
  { value: "other", label: "Other" },
];

const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
}).format(Number(value) || 0);

const submitShiprocketOrder = async ({ order, address, paymentMethod, items, subtotal, delivery }) => {
  const orderId = order?.order_number ?? order?.order_id ?? order?.id ?? order?.data?.order_number ?? order?.data?.id;
  if (!orderId) throw new Error("Your order was confirmed, but its ID was missing. Shipping could not be requested.");
  return createShiprocketOrder({
    order_id: String(orderId),
    customer_name: address.full_name,
    email: address.email,
    phone: address.phone,
    address: address.address_line1,
    address2: address.address_line2 || "",
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    items: items.map((item) => ({
      name: item.product_name || item.name || item.title || "Product",
      sku: item.sku || item.product_id || item.id,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
    })),
    payment_method: paymentMethod === "COD" ? "COD" : "Prepaid",
    sub_total: Number(subtotal) || 0,
    shipping_charges: Number(delivery) || 0,
  });
};

/* ---------- validation ---------- */
const validate = (form) => {
  const errors = {};
  if (!form.full_name.trim()) errors.full_name = "Enter the full name";
  if (!/^[6-9]\d{9}$/.test(form.phone)) errors.phone = "Enter a valid 10-digit mobile number";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email address";
  if (!form.address_line1.trim()) errors.address_line1 = "Enter the house no., building and street";
  if (!form.city.trim()) errors.city = "Enter the city";
  if (!form.state.trim()) errors.state = "Enter the state";
  if (!/^\d{6}$/.test(form.pincode)) errors.pincode = "Enter a valid 6-digit PIN code";
  if (!form.country.trim()) errors.country = "Enter the country";
  return errors;
};

/* ---------- address card ---------- */
function AddressCard({ address, selected, onSelect }) {
  const typeLabel = address.address_type.toUpperCase();
  return (
    <Box
      onClick={() => onSelect(address.id)}
      sx={{
        cursor: "pointer",
        border: selected ? `2px solid ${BRAND}` : "1px solid #dedede",
        borderRadius: 2,
        p: { xs: 1.75, sm: 2.25 },
        transition: "border-color .2s ease, box-shadow .2s ease",
        boxShadow: selected ? "0 5px 18px rgba(139, 0, 0, .10)" : "none",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Radio
          checked={selected}
          value={address.id}
          sx={{ mt: -0.8, ml: -0.9, color: BRAND, "&.Mui-checked": { color: BRAND } }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
          >
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography sx={{ fontWeight: 700, color: "#202020" }}>{address.full_name}</Typography>
              <Box
                sx={{
                  px: 0.8,
                  py: 0.2,
                  bgcolor: "#f5e9e9",
                  color: BRAND,
                  borderRadius: 0.75,
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: ".06em",
                }}
              >
                {typeLabel}
              </Box>
              {address.is_default && (
                <Box
                  sx={{
                    px: 0.8,
                    py: 0.2,
                    bgcolor: "#e8f5ef",
                    color: "#13805b",
                    borderRadius: 0.75,
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: ".06em",
                  }}
                >
                  DEFAULT
                </Box>
              )}
            </Stack>
            <Typography sx={{ color: "#555", fontSize: 14, whiteSpace: "nowrap" }}>+91 {address.phone}</Typography>
          </Stack>

          <Typography sx={{ mt: 0.9, color: "#5d5d5d", fontSize: 14.5, lineHeight: 1.6 }}>
            {address.address_line1}
            {address.address_line2 ? `, ${address.address_line2}` : ""}
            <br />
            {address.city}, {address.state} - {address.pincode}
            <br />
            {address.country}
          </Typography>
          <Typography sx={{ mt: 0.5, color: "#777", fontSize: 13.5, wordBreak: "break-all" }}>
            {address.email}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

/* ---------- add address dialog ---------- */
function AddressDialog({ open, onClose, onSave, saving, apiError }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const update = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const handleClose = () => {
    setForm(emptyForm);
    setErrors({});
    onClose();
  };

  const save = async () => {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    // Payload matches the request body exactly
    const payload = {
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address_line1: form.address_line1.trim(),
      address_line2: form.address_line2.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      country: form.country.trim(),
      address_type: form.address_type,
      is_default: form.is_default,
    };

    const ok = await onSave(payload);
    if (ok) {
      setForm(emptyForm);
      setErrors({});
    }
  };

  const field = (name, label, extra = {}) => (
    <TextField
      label={label}
      value={form[name]}
      onChange={update(name)}
      error={Boolean(errors[name])}
      helperText={errors[name]}
      fullWidth
      {...extra}
    />
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Add a new address</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: "#6a6a6a", fontSize: 14, mb: 2.5 }}>
          Enter the delivery details for this address.
        </Typography>

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}

        <Grid container spacing={1.75}>
          <Grid size={{ xs: 12, sm: 6 }}>{field("full_name", "Full name", { required: true })}</Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            {field("phone", "Mobile number", {
              required: true,
              type: "tel",
              slotProps: { htmlInput: { inputMode: "numeric", maxLength: 10 } },
              onChange: (e) => update("phone")({ target: { value: e.target.value.replace(/\D/g, "") } }),
            })}
          </Grid>
          <Grid size={12}>{field("email", "Email address", { required: true, type: "email" })}</Grid>
          <Grid size={12}>{field("address_line1", "House no., building, street", { required: true })}</Grid>
          <Grid size={12}>{field("address_line2", "Landmark, area (optional)")}</Grid>
          <Grid size={{ xs: 12, sm: 6 }}>{field("city", "City", { required: true })}</Grid>
          <Grid size={{ xs: 12, sm: 6 }}>{field("state", "State", { required: true })}</Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            {field("pincode", "PIN code", {
              required: true,
              slotProps: { htmlInput: { inputMode: "numeric", maxLength: 6 } },
              onChange: (e) => update("pincode")({ target: { value: e.target.value.replace(/\D/g, "") } }),
            })}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>{field("country", "Country", { required: true })}</Grid>
          <Grid size={12}>
            <TextField select label="Address type" value={form.address_type} onChange={update("address_type")} fullWidth>
              {ADDRESS_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.is_default}
                  onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                  sx={{ color: BRAND, "&.Mui-checked": { color: BRAND } }}
                />
              }
              label="Make this my default address"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleClose} sx={{ color: "#555" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={save}
          disabled={saving}
          disableElevation
          sx={{ bgcolor: BRAND, px: 2.75, "&:hover": { bgcolor: "#670000" } }}
        >
          {saving ? "Saving…" : "Save address"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ---------- checkout ---------- */
export default function Checkout() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressLoadError, setAddressLoadError] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [serviceabilityLoading, setServiceabilityLoading] = useState(false);
  const [serviceabilityMessage, setServiceabilityMessage] = useState("");
  const [serviceabilityError, setServiceabilityError] = useState("");

  // Guards the initial fetch so address + cart APIs run only once
  // (also stops the double call caused by React StrictMode in development).
  const fetched = useRef(false);

  const delivery = 50;
  const savings = cartItems.reduce((sum, item) => (
    sum + Math.max((Number(item.compare_at_price) || 0) - (Number(item.price) || 0), 0) * (Number(item.quantity) || 0)
  ), 0);
  const total = cartSubtotal + delivery;
  const checkDeliveryServiceability = async () => {
    const address = addresses.find((item) => item.id === selectedAddress);
    const pickupPostcode = import.meta.env.VITE_SHIPROCKET_PICKUP_PINCODE;
    if (!address) return;
    if (!pickupPostcode) {
      setServiceabilityError("Set VITE_SHIPROCKET_PICKUP_PINCODE to your Shiprocket pickup PIN code to check delivery availability.");
      return;
    }
    setServiceabilityLoading(true);
    setServiceabilityMessage("");
    setServiceabilityError("");
    try {
      const response = await checkShiprocketServiceability({
        pickup_postcode: pickupPostcode,
        delivery_postcode: address.pincode,
        weight: 0.5,
        cod: paymentMethod === "COD" ? 1 : 0,
      });
      const data = response?.data || {};
      const couriers = data?.data?.available_courier_companies || data?.available_courier_companies || [];
      setServiceabilityMessage(couriers.length
        ? `Delivery is available to ${address.pincode} (${couriers.length} courier option${couriers.length === 1 ? "" : "s"}).`
        : `Shiprocket returned no available courier options for ${address.pincode}.`);
    } catch (err) {
      setServiceabilityError(err.response?.data?.message || err.message || "Could not check delivery availability.");
    } finally {
      setServiceabilityLoading(false);
    }
  };

  /* ---------- data loading ---------- */
  const loadAddresses = async () => {
    setAddressesLoading(true);
    setAddressLoadError("");
    try {
      const response = await getAddressList();
      const fetchedAddresses = Array.isArray(response?.data) ? response.data : [];
      setAddresses(fetchedAddresses);
      const defaultAddress = fetchedAddresses.find((address) => address.is_default) || fetchedAddresses[0];
      setSelectedAddress(defaultAddress?.id ?? null);
    } catch (err) {
      setAddressLoadError(
        err.response?.data?.message || err.message || "Could not load your saved addresses."
      );
    } finally {
      setAddressesLoading(false);
    }
  };

  const loadCart = async () => {
    setCartLoading(true);
    setCartError("");
    try {
      const response = await cartList();
      const cart = response?.data || {};
      const items = Array.isArray(cart.items) ? cart.items : [];
      setCartItems(items);
      setCartSubtotal(Number(cart.subtotal) || items.reduce((sum, item) => (
        sum + (Number(item.item_total) || (Number(item.price) || 0) * (Number(item.quantity) || 0))
      ), 0));
    } catch (err) {
      setCartError(err.response?.data?.message || err.message || "Could not load your cart.");
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    loadAddresses();
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- place order ---------- */
  const placeOrder = async () => {
    const address = addresses.find((item) => item.id === selectedAddress);
    if (!address) {
      setOrderError("Select a delivery address before placing your order.");
      return;
    }

    setPlacingOrder(true);
    setOrderError("");
    setOrderSuccess("");

    // ---------- Online payment ----------
    if (paymentMethod === "ONLINE") {
      const clientId = getClientId(); // user id from localStorage
      if (!clientId) {
        setOrderError("Could not identify your account. Please log in again.");
        setPlacingOrder(false);
        return;
      }

      try {
        if (!(await loadRazorpay())) {
          throw new Error("Could not load Razorpay checkout. Please try again.");
        }

        // 1) Create payment: needs address_id + client_id (user id)
        const res = await createPayment({
          address_id: address.id,
          client_id: clientId,
        });
        const data = res?.data || {};
        if (res?.success === false || !data.razorpay_order_id || !data.key_id) {
          throw new Error(res?.message || "Could not start online payment.");
        }

        // 2) Open Razorpay
        const rzp = new window.Razorpay({
          key: data.key_id,
          amount: data.amount,
          currency: data.currency || "INR",
          name: "Param",
          description: `Order ${data.order_number || "payment"}`,
          order_id: data.razorpay_order_id,
          prefill: { name: address.full_name, email: address.email, contact: address.phone },
          notes: { order_id: String(data.order_id), client_id: String(clientId) },
          theme: { color: BRAND },

          // 3) Verify payment after success
          handler: async (result) => {
            try {
              const verified = await verifyPayment({
                order_id: data.order_id,
                client_id: clientId,
                razorpay_order_id: result.razorpay_order_id,
                razorpay_payment_id: result.razorpay_payment_id,
                razorpay_signature: result.razorpay_signature,
              });
              if (verified?.success === false) {
                throw new Error(verified.message || "Payment verification failed.");
              }
              let shippingMessage = "";
              try {
                await submitShiprocketOrder({
                  order: verified?.data?.order || verified?.order || data,
                  address,
                  paymentMethod: "ONLINE",
                  items: cartItems,
                  subtotal: cartSubtotal,
                  delivery,
                });
              } catch (shippingError) {
                shippingMessage = ` Shipping request could not be created: ${shippingError.response?.data?.message || shippingError.message}`;
              }
              setOrderSuccess(`${verified?.message || "Payment received and order confirmed."}${shippingMessage}`);
              navigate("/account-setting");
            } catch (err) {
              setOrderError(
                err.response?.data?.message || err.message || "Payment could not be verified. Please contact support."
              );
            } finally {
              setPlacingOrder(false);
            }
          },
          modal: { ondismiss: () => setPlacingOrder(false) },
        });

        rzp.on("payment.failed", (failure) => {
          setOrderError(failure.error?.description || "Payment failed. Please try again.");
          setPlacingOrder(false);
        });

        rzp.open(); // placingOrder is reset in handler / ondismiss / payment.failed
      } catch (err) {
        setOrderError(err.response?.data?.message || err.message || "Could not start online payment.");
        setPlacingOrder(false);
      }
      return;
    }

    // ---------- Cash on delivery ----------
    try {
      const response = await createOrder({
        payment_method: "COD",
        shipping_name: address.full_name,
        shipping_phone: address.phone,
        shipping_email: address.email,
        shipping_address: [address.address_line1, address.address_line2].filter(Boolean).join(", "),
        shipping_city: address.city,
        shipping_state: address.state,
        shipping_pincode: address.pincode,
        shipping_charge: delivery,
        discount_amount: savings,
      });
      if (response?.success === false) throw new Error(response.message || "Could not place your order.");
      let shippingMessage = "";
      try {
        await submitShiprocketOrder({
          order: response?.data?.order || response?.order || response?.data || response,
          address,
          paymentMethod: "COD",
          items: cartItems,
          subtotal: cartSubtotal,
          delivery,
        });
      } catch (shippingError) {
        shippingMessage = ` Shipping request could not be created: ${shippingError.response?.data?.message || shippingError.message}`;
      }
      setOrderSuccess(`${response?.message || "Your order was placed successfully."}${shippingMessage}`);
      navigate("/account-setting");
    } catch (err) {
      setOrderError(err.response?.data?.message || err.message || "Could not place your order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  // Returns true when the address was saved, so the dialog can reset itself.
  const saveAddress = async (payload) => {
    setSaving(true);
    setApiError("");
    try {
      const response = await addAddress(payload);
      const responseAddress = response?.address || response?.data || response || {};
      const saved = {
        ...payload,
        ...responseAddress,
        id: responseAddress.id || responseAddress._id || responseAddress.address_id || `address-${Date.now()}`,
      };

      setAddresses((prev) => {
        // only one default address at a time
        const base = saved.is_default ? prev.map((a) => ({ ...a, is_default: false })) : prev;
        return [...base, saved];
      });
      setSelectedAddress(saved.id);
      setAddressDialogOpen(false);
      return true;
    } catch (err) {
      setApiError(
        err.response?.data?.message || err.message || "Could not save the address. Please try again."
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  const openDialog = () => {
    setApiError("");
    setAddressDialogOpen(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7F7F7", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 3.5 }}>
          <Typography component="h1" sx={{ fontSize: { xs: 27, sm: 32 }, fontWeight: 800, color: "#202020" }}>
            Checkout
          </Typography>
          <Typography sx={{ mt: 0.6, color: "#777", fontSize: 15 }}>
            Almost there — choose a delivery address and review your order.
          </Typography>
        </Box>

        <Grid container spacing={3} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ bgcolor: "#fff", borderRadius: 2.5, p: { xs: 2, sm: 3 }, border: "1px solid #ececec" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.25 }}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "#f8e8e8",
                      color: BRAND,
                    }}
                  >
                    <LocationOnOutlined fontSize="small" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 750 }}>Delivery address</Typography>
                    <Typography sx={{ color: "#777", fontSize: 13 }}>Where should we send your order?</Typography>
                  </Box>
                </Stack>
              </Stack>

              {addressLoadError && <Alert severity="error" sx={{ mb: 1.5 }}>{addressLoadError}</Alert>}
              {addressesLoading && <Typography sx={{ color: "#777", py: 2 }}>Loading saved addresses…</Typography>}
              <Stack spacing={1.5}>
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    selected={selectedAddress === address.id}
                    onSelect={setSelectedAddress}
                  />
                ))}
              </Stack>
              <Button
                variant="text"
                disabled={!selectedAddress || serviceabilityLoading}
                onClick={checkDeliveryServiceability}
                sx={{ mt: 1, color: BRAND, fontWeight: 700, textTransform: "none" }}
              >
                {serviceabilityLoading ? "Checking delivery…" : "Check Shiprocket delivery availability"}
              </Button>
              {serviceabilityError && <Alert severity="error" sx={{ mt: 1 }}>{serviceabilityError}</Alert>}
              {serviceabilityMessage && <Alert severity="info" sx={{ mt: 1 }}>{serviceabilityMessage}</Alert>}
              {!addressesLoading && !addressLoadError && addresses.length === 0 && (
                <Typography sx={{ color: "#777", py: 2 }}>No saved addresses yet. Add a delivery address to continue.</Typography>
              )}

              <Button
                fullWidth
                startIcon={<AddRounded />}
                variant="outlined"
                onClick={openDialog}
                sx={{
                  mt: 1.75,
                  height: 48,
                  color: BRAND,
                  borderColor: "#c88484",
                  borderStyle: "dashed",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": { borderColor: BRAND, bgcolor: "#fff8f8" },
                }}
              >
                Add a new address
              </Button>
            </Box>

            <Box sx={{ mt: 2, bgcolor: "#fff", borderRadius: 2.5, p: { xs: 2, sm: 3 }, border: "1px solid #ececec" }}>
              <Typography sx={{ fontWeight: 750, mb: 2 }}>Order items</Typography>
              {cartError && <Alert severity="error" sx={{ mb: 1.5 }}>{cartError}</Alert>}
              {cartLoading && <Typography sx={{ color: "#777", py: 2 }}>Loading cart…</Typography>}
              {!cartLoading && !cartError && cartItems.length === 0 && (
                <Typography sx={{ color: "#777", py: 2 }}>Your cart is empty.</Typography>
              )}
              <Stack spacing={2}>
                {cartItems.map((item) => (
                  <Stack key={item.cart_item_id || item.product_id} direction="row" spacing={2} alignItems="center">
                    <Box sx={{ width: 76, height: 76, flexShrink: 0, borderRadius: 1.5, bgcolor: "#f5f5f5", display: "grid", placeItems: "center", color: "#777" }}>
                      <LocalShippingOutlined />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 650, fontSize: 15, lineHeight: 1.4 }}>{item.name}</Typography>
                      <Typography sx={{ color: "#777", fontSize: 14, mt: 0.5 }}>
                        SKU: {item.sku || "—"} &nbsp;·&nbsp; Qty: {item.quantity}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mt: 0.75 }}>
                        <Typography sx={{ fontWeight: 750 }}>
                          {money(item.item_total ?? Number(item.price) * Number(item.quantity))}
                        </Typography>
                        {Number(item.compare_at_price) > Number(item.price) && (
                          <Typography sx={{ color: "#888", textDecoration: "line-through", fontSize: 13 }}>
                            {money(Number(item.compare_at_price) * Number(item.quantity))}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                    <Button startIcon={<EditOutlined />} component={RouterLink} to="/cart" sx={{ color: BRAND, textTransform: "none", fontWeight: 700 }}>
                      Edit
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                bgcolor: "#fff",
                border: "1px solid #ececec",
                borderRadius: 2.5,
                p: { xs: 2, sm: 3 },
                position: { md: "sticky" },
                top: { md: 102 },
              }}
            >
              <Typography sx={{ fontWeight: 800, fontSize: 19 }}>Order summary</Typography>
              <Divider sx={{ my: 2.25 }} />
              <Stack spacing={1.4}>
                <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography sx={{ ml: "auto", textAlign: "right" }}>{money(cartSubtotal)}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                  <Typography color="text.secondary">Savings included</Typography>
                  <Typography sx={{ ml: "auto", textAlign: "right", color: "#13805b" }}>{money(savings)}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                  <Typography color="text.secondary">Delivery</Typography>
                  <Typography sx={{ ml: "auto", textAlign: "right", color: "#13805b", fontWeight: 600 }}>{money(delivery)}</Typography>
                </Stack>
              </Stack>
              <Divider sx={{ my: 2.25 }} />
              <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                <Typography sx={{ fontWeight: 800, fontSize: 18 }}>Total</Typography>
                <Typography sx={{ ml: "auto", textAlign: "right", fontWeight: 800, fontSize: 21 }}>{money(total)}</Typography>
              </Stack>

              <Box sx={{ display: "flex", gap: 1, bgcolor: "#f1faf6", borderRadius: 1.5, p: 1.25, mt: 2.1, color: "#27765b" }}>
                <LocalShippingOutlined fontSize="small" />
                <Typography sx={{ fontSize: 13.5 }}>Shipping {money(delivery)}. Estimated arrival in 3–5 business days.</Typography>
              </Box>

              <Typography sx={{ fontWeight: 750, mt: 2.2, mb: 0.75 }}>Payment method</Typography>
              <Stack spacing={0.5}>
                <FormControlLabel
                  control={<Radio checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} sx={{ color: BRAND, "&.Mui-checked": { color: BRAND } }} />}
                  label={<Box><Typography sx={{ fontWeight: 650 }}>Cash on delivery</Typography><Typography sx={{ color: "#777", fontSize: 12.5 }}>Pay when your order arrives</Typography></Box>}
                />
                <FormControlLabel
                  control={<Radio checked={paymentMethod === "ONLINE"} onChange={() => setPaymentMethod("ONLINE")} sx={{ color: BRAND, "&.Mui-checked": { color: BRAND } }} />}
                  label={<Box><Typography sx={{ fontWeight: 650 }}>Pay online</Typography><Typography sx={{ color: "#777", fontSize: 12.5 }}>Secure payment with Razorpay</Typography></Box>}
                />
              </Stack>

              <FormControlLabel
                control={<Checkbox defaultChecked size="small" sx={{ color: BRAND, "&.Mui-checked": { color: BRAND } }} />}
                label={<Typography sx={{ fontSize: 13.5, color: "#666" }}>Send me order updates on WhatsApp</Typography>}
                sx={{ mt: 1.25, ml: -0.5 }}
              />

              <Button
                fullWidth
                variant="contained"
                disableElevation
                disabled={!selectedAddress || placingOrder || cartLoading || cartItems.length === 0}
                onClick={placeOrder}
                sx={{
                  mt: 1.3,
                  height: 52,
                  borderRadius: 1.5,
                  bgcolor: BRAND,
                  fontWeight: 800,
                  fontSize: 16,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#670000" },
                }}
              >
                {placingOrder ? "Placing order…" : "Proceed to payment"}
              </Button>
              {orderError && <Alert severity="error" sx={{ mt: 1.5 }}>{orderError}</Alert>}
              {orderSuccess && <Alert severity="success" sx={{ mt: 1.5 }}>{orderSuccess}</Alert>}

              <Stack direction="row" spacing={0.75} justifyContent="center" alignItems="center" sx={{ mt: 1.75, color: "#777" }}>
                <LockOutlined sx={{ fontSize: 15 }} />
                <Typography sx={{ fontSize: 12.5 }}>Secure checkout · Your payment details are protected</Typography>
              </Stack>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, color: "#5e8b78" }}>
              <CheckCircleRounded fontSize="small" />
              <Typography sx={{ fontSize: 13.5 }}>Easy returns within 7 days of delivery</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <AddressDialog
        open={addressDialogOpen}
        onClose={() => setAddressDialogOpen(false)}
        onSave={saveAddress}
        saving={saving}
        apiError={apiError}
      />
    </Box>
  );
}
