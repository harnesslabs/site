import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Harness Labs | Playground",
  description: "Try out Harness Labs",
};

export default function Playground() {
  return redirect("/playground/cova");
}
