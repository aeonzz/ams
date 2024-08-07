"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AccountCard, AccountCardBody, AccountCardFooter } from "./AccountCard";

export default function UpdateEmailCard({ email }: { email: string }) {
  // const [state, formAction] = useFormState(updateUser, {
  //   error: '',
  // });

  // useEffect(() => {
  //   if (state.success == true) toast.success('Updated Email');
  //   if (state.error) toast.error('Error', { description: state.error });
  // }, [state]);

  return (
    <AccountCard
      params={{
        header: "Your Email",
        description: "Please enter the email address you want to use with your account.",
      }}
    >
      <form>
        <AccountCardBody>
          <Input defaultValue={email ?? ""} name="email" />
        </AccountCardBody>
        <AccountCardFooter description="We will email vou to verify the change.">
          <Submit />
        </AccountCardFooter>
      </form>
    </AccountCard>
  );
}

const Submit = () => {
  const { pending } = useFormStatus();
  return <Button disabled={pending}>Update Email</Button>;
};
