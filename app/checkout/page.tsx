'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShieldCheck, CheckCircle2, Truck, CreditCard, Building2, Smartphone, ArrowRight, Tag } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    clearCart,
    subtotal,
    discountAmount,
    shippingCost,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    shippingCity,
    setShippingCity,
  } = useCart();

  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [shippingMethod, setShippingMethod] = useState<'STANDARD' | 'EXPRESS' | 'STORE_PICKUP'>('STANDARD');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK_TRANSFER' | 'JAZZCASH' | 'CARD'>('COD');
  const [customerNotes, setCustomerNotes] = useState('');

  // Coupon inline form
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ text: string; error: boolean } | null>(null);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderComplete, setOrderComplete] = useState<any>(null);

  // Fetch current user if logged in
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
          setFullName(data.user.name || '');
          setEmail(data.user.email || '');
          if (data.user.phone) setPhone(data.user.phone);
        }
      })
      .catch(() => {});
  }, []);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponFeedback(null);
    const res = await applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponFeedback({ text: res.message, error: false });
      setCouponInput('');
    } else {
      setCouponFeedback({ text: res.message, error: true });
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('Your shopping bag is empty.');
      return;
    }

    if (!fullName || !phone || !streetAddress || !shippingCity) {
      setErrorMessage('Please fill in all required shipping fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        guestName: fullName,
        guestEmail: email || null,
        guestPhone: phone,
        shippingAddress: streetAddress,
        city: shippingCity,
        postalCode: postalCode || null,
        shippingMethod,
        paymentMethod,
        couponCode: appliedCoupon?.code || null,
        customerNotes,
        items,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process order. Please try again.');
      }

      setOrderComplete(data.order);
      clearCart();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pakistaniCities = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Gujranwala',
  ];

  // ORDER CONFIRMATION VIEW
  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs uppercase tracking-[0.25em] text-[#6B1724] font-semibold block">
          Order Confirmed
        </span>

        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F1D1D]">
          Thank You, {fullName}!
        </h1>

        <p className="text-sm text-[#7E7873] max-w-lg mx-auto leading-relaxed">
          Your order has been received at our atelier. A confirmation has been generated and our concierge team is preparing your package.
        </p>

        <div className="bg-white border border-[#E6DFD5] p-6 rounded-xs text-left max-w-md mx-auto space-y-3 shadow-xs text-xs">
          <div className="flex justify-between border-b border-[#F5EFE6] pb-2">
            <span className="text-[#7E7873]">Order Reference</span>
            <span className="font-bold text-[#6B1724] text-sm">{orderComplete.orderNumber}</span>
          </div>
          <div className="flex justify-between border-b border-[#F5EFE6] pb-2">
            <span className="text-[#7E7873]">Total Amount</span>
            <span className="font-bold text-[#1F1D1D]">Rs. {orderComplete.totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-b border-[#F5EFE6] pb-2">
            <span className="text-[#7E7873]">Payment Method</span>
            <span className="font-semibold text-[#1F1D1D]">{orderComplete.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7E7873]">Delivery Destination</span>
            <span className="font-semibold text-[#1F1D1D]">{shippingCity}</span>
          </div>
        </div>

        {paymentMethod === 'BANK_TRANSFER' && (
          <div className="bg-[#F5EFE6] border border-[#E6DFD5] p-5 rounded-xs text-left max-w-md mx-auto text-xs space-y-2">
            <span className="font-bold text-[#6B1724] block uppercase tracking-wider text-[11px]">
              Bank Transfer Instructions
            </span>
            <p className="text-[#4A4644]">
              Please transfer <strong>Rs. {orderComplete.totalAmount.toLocaleString()}</strong> to our official corporate account:
            </p>
            <div className="bg-white p-3 rounded-xs border border-[#E6DFD5] space-y-1">
              <div>Bank: <strong>Meezan Bank Limited</strong></div>
              <div>Account Title: <strong>Artisha Private Limited</strong></div>
              <div>Account Number: <strong>02010108920192</strong></div>
              <div>IBAN: <strong>PK82MEZN0002010108920192</strong></div>
            </div>
            <p className="text-[11px] text-[#7E7873]">
              Send transfer receipt screenshot with Order ID #{orderComplete.orderNumber} to WhatsApp: <strong>+92 300 8472910</strong>.
            </p>
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/order-tracking?order=${orderComplete.orderNumber}`}
            className="w-full sm:w-auto bg-[#6B1724] text-white px-7 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#500F1A] transition-colors"
          >
            Track Order Status
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto bg-white border border-[#D4C5B3] text-[#1F1D1D] px-7 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#FAF8F5] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#7E7873] uppercase tracking-wider border-b border-[#E6DFD5] pb-4">
        <Link href="/" className="hover:text-[#6B1724]">Home</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-[#6B1724]">Cart</Link>
        <span>/</span>
        <span className="text-[#1F1D1D] font-medium">Checkout</span>
      </div>

      <div className="flex items-baseline justify-between">
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F1D1D]">
          Express Checkout
        </h1>
        {!currentUser && (
          <span className="text-xs text-[#7E7873]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#6B1724] underline font-medium">
              Log In
            </Link>
          </span>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Customer & Delivery Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Customer Information */}
          <div className="bg-white border border-[#E6DFD5] p-6 rounded-xs space-y-4 shadow-xs">
            <h2 className="font-serif-luxury text-lg font-bold text-[#1F1D1D] border-b border-[#E6DFD5] pb-2">
              1. Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zainab Qureshi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3.5 py-2.5 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Mobile Phone * (for courier updates)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3.5 py-2.5 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                Email Address (for order receipts)
              </label>
              <input
                type="email"
                placeholder="e.g. zainab.q@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3.5 py-2.5 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
              />
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-white border border-[#E6DFD5] p-6 rounded-xs space-y-4 shadow-xs">
            <h2 className="font-serif-luxury text-lg font-bold text-[#1F1D1D] border-b border-[#E6DFD5] pb-2">
              2. Shipping Address
            </h2>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                Street Address / House / Flat Number *
              </label>
              <textarea
                required
                rows={2}
                placeholder="e.g. House 42, Sector Y, Phase 3, DHA"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3.5 py-2.5 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  City *
                </label>
                <select
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3.5 py-2.5 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
                >
                  {pakistaniCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Postal / Zip Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 54792"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3.5 py-2.5 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
                />
              </div>
            </div>

            {/* Delivery Method Options */}
            <div className="pt-2">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-2">
                Delivery Method
              </label>
              <div className="space-y-2 text-xs">
                <label className={`flex items-center justify-between p-3 border rounded-xs cursor-pointer transition-colors ${shippingMethod === 'STANDARD' ? 'border-[#6B1724] bg-[#F8F1F2]' : 'border-[#E6DFD5] bg-white'}`}>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'STANDARD'}
                      onChange={() => setShippingMethod('STANDARD')}
                      className="text-[#6B1724] focus:ring-0"
                    />
                    <div>
                      <span className="font-semibold block text-[#1F1D1D]">Standard Courier (TCS / Leopards)</span>
                      <span className="text-[11px] text-[#7E7873]">1-2 days in Lahore, 2-3 days nationwide</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#1F1D1D]">
                    {shippingCost === 0 ? 'Complimentary' : `Rs. ${shippingCost}`}
                  </span>
                </label>

                {shippingCity.toLowerCase() === 'lahore' && (
                  <label className={`flex items-center justify-between p-3 border rounded-xs cursor-pointer transition-colors ${shippingMethod === 'STORE_PICKUP' ? 'border-[#6B1724] bg-[#F8F1F2]' : 'border-[#E6DFD5] bg-white'}`}>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'STORE_PICKUP'}
                        onChange={() => setShippingMethod('STORE_PICKUP')}
                        className="text-[#6B1724] focus:ring-0"
                      />
                      <div>
                        <span className="font-semibold block text-[#1F1D1D]">Self-Pickup at Flagship Boutique</span>
                        <span className="text-[11px] text-[#7E7873]">Shop 104, Dolmen Mall Lahore (Free)</span>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-700">Free</span>
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                Order Notes / Special Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Ring bell twice, deliver after 2pm, gift package"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3.5 py-2 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
              />
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white border border-[#E6DFD5] p-6 rounded-xs space-y-4 shadow-xs">
            <h2 className="font-serif-luxury text-lg font-bold text-[#1F1D1D] border-b border-[#E6DFD5] pb-2">
              3. Payment Method
            </h2>

            <div className="space-y-3 text-xs">
              {/* COD */}
              <label className={`flex items-start gap-3 p-3.5 border rounded-xs cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-[#6B1724] bg-[#F8F1F2]' : 'border-[#E6DFD5] bg-white'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-0.5 text-[#6B1724] focus:ring-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#6B1724]" />
                    <span className="font-bold text-[#1F1D1D]">Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-[11px] text-[#7E7873] mt-1">
                    Pay with cash directly to the courier representative when your parcel is delivered.
                  </p>
                </div>
              </label>

              {/* Bank Transfer */}
              <label className={`flex items-start gap-3 p-3.5 border rounded-xs cursor-pointer transition-colors ${paymentMethod === 'BANK_TRANSFER' ? 'border-[#6B1724] bg-[#F8F1F2]' : 'border-[#E6DFD5] bg-white'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'BANK_TRANSFER'}
                  onChange={() => setPaymentMethod('BANK_TRANSFER')}
                  className="mt-0.5 text-[#6B1724] focus:ring-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#6B1724]" />
                    <span className="font-bold text-[#1F1D1D]">Direct Bank Transfer (IBFT)</span>
                  </div>
                  <p className="text-[11px] text-[#7E7873] mt-1">
                    Transfer directly to our Meezan Bank corporate account. Account details will be presented upon placement.
                  </p>
                </div>
              </label>

              {/* JazzCash / Easypaisa */}
              <label className={`flex items-start gap-3 p-3.5 border rounded-xs cursor-pointer transition-colors ${paymentMethod === 'JAZZCASH' ? 'border-[#6B1724] bg-[#F8F1F2]' : 'border-[#E6DFD5] bg-white'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'JAZZCASH'}
                  onChange={() => setPaymentMethod('JAZZCASH')}
                  className="mt-0.5 text-[#6B1724] focus:ring-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#6B1724]" />
                    <span className="font-bold text-[#1F1D1D]">JazzCash / Easypaisa Wallet</span>
                  </div>
                  <p className="text-[11px] text-[#7E7873] mt-1">
                    Manual wallet transfer to 0300-8472910 (Syeda Fatima / Artisha).
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Order Review & Placement */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E6DFD5] p-6 rounded-xs space-y-5 shadow-xs sticky top-28">
            <h2 className="font-serif-luxury text-xl font-bold text-[#1F1D1D] border-b border-[#E6DFD5] pb-3">
              Order Items ({items.length})
            </h2>

            {/* Items summary */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-[#F5EFE6]">
              {items.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex gap-3 text-xs">
                  <div className="w-12 h-16 bg-[#F5EFE6] rounded-xs overflow-hidden shrink-0 border border-[#E6DFD5]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#1F1D1D] line-clamp-1">{item.name}</h4>
                    {item.variantName && <span className="text-[10px] text-[#7E7873] block">{item.variantName}</span>}
                    <div className="flex justify-between items-baseline mt-1">
                      <span className="text-[11px] text-[#7E7873]">Qty: {item.quantity}</span>
                      <span className="font-bold text-[#1F1D1D]">
                        Rs. {((item.salePrice || item.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Inline */}
            <div className="pt-3 border-t border-[#E6DFD5]">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#F8F1F2] border border-[#6B1724]/20 p-2 rounded-xs text-xs">
                  <div className="flex items-center gap-1.5 text-[#6B1724] font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{appliedCoupon.code} Applied</span>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-[#7E7873] hover:text-[#6B1724] underline">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-1.5 text-xs uppercase rounded-xs focus:outline-none focus:border-[#6B1724]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-[#1F1D1D] text-white text-xs px-3 py-1.5 hover:bg-[#6B1724] transition-colors rounded-xs font-medium"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponFeedback && (
                <p className={`text-[10px] mt-1 ${couponFeedback.error ? 'text-red-600' : 'text-emerald-700'}`}>
                  {couponFeedback.text}
                </p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-[#4A4644] pt-2 border-t border-[#F5EFE6]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1F1D1D]">Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span>-Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({shippingCity})</span>
                <span className="font-semibold text-[#1F1D1D]">
                  {shippingCost === 0 ? (
                    <span className="text-[#6B1724] font-bold uppercase text-[10px]">Complimentary</span>
                  ) : (
                    `Rs. ${shippingCost.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1F1D1D] pt-3 border-t border-[#E6DFD5]">
                <span>Total Amount Due</span>
                <span className="text-[#6B1724]">Rs. {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full bg-[#6B1724] hover:bg-[#500F1A] text-white py-4 px-6 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors rounded-xs shadow-md disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Confirming Order...' : 'Confirm & Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#7E7873]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real-time inventory deduction &amp; order tracking guarantee</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
