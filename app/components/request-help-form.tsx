"use client";

import { FormEvent, useState } from "react";

type RequestHelpFormProps = {
  labels: {
    name: string;
    phone: string;
    email: string;
    comments: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
  };
};

export default function RequestHelpForm({ labels }: RequestHelpFormProps) {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setMessage(null);

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("/api/request", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(data?.message ?? labels.error);
      }

      formElement.reset();
      setMessage({ type: "success", text: labels.success });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : labels.error,
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        className="field-dark"
        name="fullName"
        placeholder={labels.name}
        required
      />
      <input
        className="field-dark"
        name="phoneNumber"
        type="tel"
        placeholder={labels.phone}
        required
      />
      <input
        className="field-dark"
        name="email"
        type="email"
        placeholder={labels.email}
      />
      <textarea
        className="field-dark min-h-20 resize-y"
        name="comments"
        placeholder={labels.comments}
      />
      <button
        disabled={sending}
        className="w-full bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
      >
        {sending ? labels.sending : labels.submit}
      </button>
      {message ? (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {message.text}
        </p>
      ) : null}
    </form>
  );
}
