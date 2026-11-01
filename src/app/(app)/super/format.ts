/** ₹ amounts as the legacy views show them (number_format, no decimals). */
export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export const tone = (status: string) => (status === "active" ? "success" : "neutral") as "success" | "neutral";
