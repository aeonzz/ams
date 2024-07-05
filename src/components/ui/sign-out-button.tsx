"use client";

import { useFormStatus } from "react-dom";

import { signOutAction } from "@/lib/actions/users";

import { Button } from "./button";

export default function SignOutBtn() {
  return (
    <form action={signOutAction} className="w-full text-left">
      <Btn />
    </form>
  );
}

const Btn = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} variant={"destructive"}>
      Sign{pending ? "ing" : ""} out
    </Button>
  );
};
