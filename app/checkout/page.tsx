"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { submitOrderAction } from "@/lib/actions";
import { account } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postal: "",
      payment: "mpesa",
      mpesaNumber: "",
      cardNumber: "",
      cardExpiry: "",
      cardCVV: "",
    },
  });

  const paymentMethod = useWatch({ control: form.control, name: "payment" });

  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
    }
  }, [items, router]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const result = await submitOrderAction(data, items, total);

      if (result.success) {
        toast.success(`Order placed via ${data.payment.toUpperCase()}!`);
        clearCart();

        const user = await account.get().catch(() => null);
        if (user) {
          router.push(`/profile/${user.$id}`);
        }

        if (user) {
          router.push(`/profile/${user.$id}`);
        } else {
          const proceed = window.confirm(
            "Would you like to create an account to track your order?"
          );
          if (proceed) {
            router.push("/auth/register");
          } else {
            router.push("/");
          }
        }
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-black text-white py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Cart Summary */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-neutral-900 rounded p-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-neutral-400">
                        {item.quantity} × KSh {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold">
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-neutral-700 pt-4 flex justify-between text-lg font-medium">
              <span>Total:</span>
              <span>KSh {total.toLocaleString()}</span>
            </div>
            <button
              onClick={() => router.push("/")}
              className="mt-6 text-sm underline hover:text-neutral-300"
            >
              ← Back to shop
            </button>
          </div>

          {/* Checkout Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Details</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Personal Info */}
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Full Name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="John Doe"
                          className="bg-neutral-800 border-neutral-600 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="john@example.com"
                          className="bg-neutral-800 border-neutral-600 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="0712345678"
                          className="bg-neutral-800 border-neutral-600 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address Info */}
                <FormField
                  control={form.control}
                  name="address"
                  rules={{ required: "Address is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="123 Main Street"
                          className="bg-neutral-800 border-neutral-600 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    rules={{ required: "City is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nairobi"
                            className="bg-neutral-800 border-neutral-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postal"
                    rules={{ required: "Postal Code is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="00100"
                            className="bg-neutral-800 border-neutral-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Payment Method */}
                <FormField
                  control={form.control}
                  name="payment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <RadioGroup
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mpesa" id="mpesa" />
                          <Label htmlFor="mpesa">M-Pesa</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card">Card</Label>
                        </div>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {paymentMethod === "mpesa" && (
                  <FormField
                    control={form.control}
                    name="mpesaNumber"
                    rules={{ required: "Enter M-Pesa number" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>M-Pesa Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="0712345678"
                            className="bg-neutral-800 border-neutral-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {paymentMethod === "card" && (
                  <>
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      rules={{ required: "Card number required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="1234 5678 9012 3456"
                              className="bg-neutral-800 border-neutral-600 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cardExpiry"
                        rules={{ required: "Expiry date required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="MM/YY"
                                className="bg-neutral-800 border-neutral-600 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cardCVV"
                        rules={{ required: "CVV required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="123"
                                className="bg-neutral-800 border-neutral-600 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>placing order</span>
                    </div>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
