"use client";
import React from "react";

export default function Response() {
  const [responses, setResponses] = React.useState<any>(null);
  const [loading, isLoading] = React.useState<boolean>(true);
  React.useEffect(() => {
    async function loadResponses() {
      const response = await fetch("/api/getAnalytics", {
        cache: "no-store",
        method: "GET",
      });
      const data = await response.json();
      setResponses(data.response);
      isLoading(false);
    }
    loadResponses();
  }, []);

  if (loading) {
    return (
      <div className="w-screen min-h-screen p-2 bg-slate-950">
        {" "}
        <p className="text-white">loading...</p>
      </div>
    );
  }
  return (
    <pre className="w-[160%] md:w-full rounded-md bg-slate-950 p-4">
      <code className="text-white w-full">
        {JSON.stringify(responses, null, 2)}
      </code>
    </pre>
  );
}
