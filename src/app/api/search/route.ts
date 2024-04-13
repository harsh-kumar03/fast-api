import { NextRequest, NextResponse } from "next/server";
import { redis } from "../../../lib/redis";

export const POST = async (req: NextRequest) => {
  try {
    let { query } = await req.json();
    query = query.toUpperCase();

    const starting = performance.now();

    if (!query) {
      return new Response(JSON.stringify({ message: "Invalid search query" }), {
        status: 400,
      });
    }

    if (!redis) {
      return new Response(JSON.stringify({ message: "DB Error" }), {
        status: 500,
      });
    }

    const results = [];
    const rank = await redis.zrank("terms", query);

    // console.log("Rank: " + rank + " Query: " + query);

    if (rank !== null && rank !== undefined) {
      const temp = await redis.zrange<string[]>("terms", rank, rank + 100); // results that starts with query
      // console.log("TEMP : " + temp);

      for (const match of temp) {
        if (!match.startsWith(query)) {
          break;
        } else if (match.endsWith("*")) {
          // console.log("MATCH : " + match);
          // if the match is a country name
          results.push(match.substring(0, match.length - 1)); // push the country name without *
        }
      }
    }

    const ended = performance.now();

    return new Response(
      JSON.stringify({ duration: ended - starting, results: results }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
};
