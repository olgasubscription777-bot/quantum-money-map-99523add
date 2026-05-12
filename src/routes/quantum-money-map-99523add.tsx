import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/quantum-money-map-99523add")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});