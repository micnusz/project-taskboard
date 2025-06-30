"use client";

import { createPost } from "@/actions/actions";
import { useActionState } from "react";

const initialState = { message: "" };

export default function Form() {
  const [state, formAction, pending] = useActionState(createPost, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-y-2 border-1">
      <input name="title" required placeholder="title" />
      <textarea name="content" required placeholder="content" />
      <button disabled={pending}>Create</button>
      <p>{state.message}</p>
    </form>
  );
}
