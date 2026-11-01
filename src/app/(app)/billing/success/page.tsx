import type { Metadata } from "next";
import { BillingResult } from "../result";

export const metadata: Metadata = { title: "Payment Successful" };

export default function BillingSuccessPage() {
  return <BillingResult status="success" />;
}
