"use client";

import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";

export default function Home() {
  const [response, setResponse] = useState<
    undefined | { results: string[]; duration: number }
  >(undefined);
  const [query, setQuery] = useState<string>("in");

  useEffect(() => {
    console.log("running...");
    async function fetchData() {
      console.log(query);
      if (!query) return setResponse(undefined);
      const body = {
        query: query,
      };

      const res = await fetch(`/api/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res || !res.ok || res.status !== 200) return setResponse(undefined);

      const data = await res.json();

      console.log(data);

      if (data.results.length > 0) {
        setResponse(() => ({
          duration: data.duration,
          results: data.results,
        }));
      }
    }

    fetchData();
  }, [query]);

  return (
    <div className="w-full h-[100vh] bg-slate-50 text-slate-900">
      <div className="w-full px-4 flex flex-col items-center">
        <div className="mt-20 max-w-[550px] w-full">
          <h1 className="text-3xl font-bold text-center mb-3">FastAPI 🏍🏍</h1>
          <h3 className="text-base font-semibold text-slate-400 text-center mb-5">
            This is the Fast Api that we have build using Hono Redis and
            Postgresql
          </h3>
          <div className="w-full grid bg-white">
            <div className="grid w-full relative">
              <SearchIcon className="absolute h-full ml-2 text-slate-600" />
              <input
                type="text"
                onChange={({ target }) => setQuery(target.value)}
                className="pl-10 py-2 pr-2 border rounded-md border-slate-200"
              />
            </div>
            {response ? (
              <div className="grid border border-slate-200 border-t-0">
                <div className="grid border-b max-h-[50vh] overflow-y-scroll">
                  {response.results.map((country) => (
                    <span
                      key={country}
                      className="hover:bg-slate-200 py-2 px-4 text-sm"
                    >
                      {country}
                    </span>
                  ))}
                </div>
                <div className="px-4 py-2">
                  <h2 className="text-sm text-slate-500">
                    {response.duration}
                  </h2>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
