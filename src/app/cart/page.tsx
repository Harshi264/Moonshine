'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Trash2, ArrowRight, Sparkles, Truck, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountTotal,
    shippingFee,
    total,
    remainingForFreeShipping,
    freeShippingThreshold,
  } = useCart();

  const [customerNotes, setCustomerNotes] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-[#f5eee6] rounded-full mx-auto flex items-center justify-center text-[#b87333]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#3b2d24]">Your Cart is Empty</h1>
        <p className="text-sm text-[#7a6858] max-w-sm mx-auto">
          Explore our collection of handcrafted soy candles, resin coasters, and custom hampers to add warmth to your cart.
        </p>
        <Link
          href="/catalogue"
          className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#4a3b32] hover:bg-[#b87333] text-white font-semibold text-sm rounded-full shadow transition-all"
        >
          <span>Explore Studio Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#ebdcd0] pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#3b2d24]">
            Shopping Bag ({cart.length} items)
          </h1>
          <p className="text-xs text-[#7a6858] mt-1">
            Review your selected candles and resin crafts before placing your order request.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-[#d9534f] hover:underline mt-2 sm:mt-0 font-medium"
        >
          Empty Cart
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-[#f5eee6] border border-[#ebdcd0] p-4 rounded-2xl flex items-center space-x-3 text-xs sm:text-sm text-[#4a3b32]">
        <Truck className="w-5 h-5 text-[#b87333] shrink-0" />
        {remainingForFreeShipping === 0 ? (
          <span className="font-bold text-[#2e7d32]">
            🎉 Congratulations! You qualify for FREE shipping across India!
          </span>
        ) : (
          <span>
            Add <strong className="text-[#b87333]">₹{remainingForFreeShipping}</strong> more of products to get <strong>FREE Express Shipping</strong>!
          </span>
        )}
      </div>

      {/* Main Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ebdcd0] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-[#ebdcd0] shrink-0"
                />
                <div className="space-y-1">
                  <Link
                    href={`/product/${item.product.slug || item.product.id}`}
                    className="font-serif text-base font-bold text-[#3b2d24] hover:text-[#b87333] transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  {item.variant && (
                    <p className="text-xs text-[#8c7868] font-medium">Option: {item.variant.name}</p>
                  )}
                  {item.customizationDetails && Object.keys(item.customizationDetails).length > 0 && (
                    <div className="text-[11px] text-[#b87333] bg-[#faf7f2] p-2 rounded-lg border border-[#ebdcd0] mt-1 space-y-0.5">
                      {Object.entries(item.customizationDetails).map(([k, v]) => (
                        <div key={k}>
                          <strong>{k}:</strong> {v}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-sm font-bold text-[#4a3b32]">
                    ₹{item.unitPrice} <span className="text-xs text-[#8c7868] font-normal">each</span>
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 border-t sm:border-t-0 border-[#f2e8de] pt-3 sm:pt-0">
                <div className="flex items-center border border-[#d6c8b8] bg-[#faf7f2] rounded-full p-1">
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-white text-[#4a3b32] font-bold text-xs flex items-center justify-center shadow-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#4a3b32]">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-white text-[#4a3b32] font-bold text-xs flex items-center justify-center shadow-sm"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <div className="font-serif text-base font-bold text-[#4a3b32]">
                    ₹{item.unitPrice * item.quantity}
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="p-2 text-[#8c7868] hover:text-[#d9534f] transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}

          {/* Continue Shopping Link */}
          <div className="pt-2">
            <Link
              href="/catalogue"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#b87333] hover:text-[#4a3b32] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right Summary Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-6 h-fit">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24] border-b border-[#ebdcd0] pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-[#5c4a3e]">
            <div className="flex justify-between">
              <span>Subtotal ({cart.length} items)</span>
              <span className="font-bold text-[#3b2d24]">₹{subtotal}</span>
            </div>

            {discountTotal > 0 && (
              <div className="flex justify-between text-[#2e7d32]">
                <span>Discount Savings</span>
                <span className="font-bold">-₹{discountTotal}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-bold text-[#3b2d24]">
                {shippingFee === 0 ? <span className="text-[#2e7d32]">FREE</span> : `₹${shippingFee}`}
              </span>
            </div>

            <div className="pt-3 border-t border-[#ebdcd0] flex justify-between items-center text-lg font-bold text-[#3b2d24]">
              <span>Total Amount</span>
              <span className="font-serif text-2xl text-[#4a3b32]">₹{total}</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            className="w-full py-4 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-sm rounded-full shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Proceed to Checkout / Submit Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-[#8c7868] text-center italic">
            * No online payment required right now. The studio owner will personally confirm your order via Phone/WhatsApp.
          </p>
        </div>

      </div>
    </div>
  );
}
