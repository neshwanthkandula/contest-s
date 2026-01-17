"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface MyRankProps {
  contestId: number;
  refreshInterval?: number; // seconds
}

const MyRank: React.FC<MyRankProps> = ({
  contestId,
  refreshInterval = 5,
}) => {
  const [rank, setRank] = useState<number | null>(null);
  const [points, setPoints] = useState<number | null>(null);

  const Base_URL= process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    let mounted = true;

    const fetchRank = async () => {
      try {
        const res = await axios.get(
          `${Base_URL}/leaderboard/${contestId}/me`,
          { withCredentials: true }
        );

        if (!mounted) return;

        if (res.data) {
          setRank(res.data.rank);
          setPoints(res.data.points);
        } else {
          setRank(null);
          setPoints(null);
        }
      } catch {
        setRank(null);
        setPoints(null);
      }
    };

    fetchRank();

    const interval = setInterval(fetchRank, refreshInterval * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [contestId, refreshInterval]);

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md">
      <span className="text-sm uppercase tracking-wide">
        Your Rank
      </span>

      {rank !== null ? (
        <span className="text-lg font-mono">
          #{rank} ({points})
        </span>
      ) : (
        <span className="text-sm italic opacity-80">
           ___
        </span>
      )}
    </div>
  );
};

export default MyRank;
