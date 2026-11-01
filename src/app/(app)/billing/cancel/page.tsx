import type { Metadata } from "next";
import { BillingResult } from "../result";

export const metadata: Metadata = { title: "Cancelled" };

export default function BillingCancelPage() {
  return <BillingResult status="cancelled" />;
}
