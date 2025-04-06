import React from "react";
import { DollarSign } from "lucide-react";
import { formatCurrency, getRecommendedPrice } from "@/utils/analysisUtils";

type PricingRangeProps = {
  marketValueRange: {
    low: number | string;
    average: number | string;
    high: number | string;
  };
  recommendedPrice: number | string;
};

const PricingRange: React.FC<PricingRangeProps> = ({
  marketValueRange,
  recommendedPrice,
}) => {
  const removeFormat = (str) => {
    return parseInt(
      String(str).replace(new RegExp(",", "g"), "").replace("₹", "")
    );
  };
  const getPercentage = (x, a, b, c) =>
    x <= a
      ? 0
      : x >= c
      ? 100
      : x <= b
      ? ((x - a) / (b - a)) * 50
      : 50 + ((x - b) / (c - b)) * 50;

  const getPercentPosition = () => {
    // return recommend price position
    let rprice = removeFormat(recommendedPrice);
    let low = removeFormat(marketValueRange.low);
    let average = removeFormat(marketValueRange.average);
    let high = removeFormat(marketValueRange.high);
    const res = getPercentage(rprice, low, average, high);
    return Math.floor(res);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-car-blue" /> Market Value Range
      </h3>
      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
        <span>Low</span>
        <span>Average</span>
        <span>High</span>
      </div>
      <div className="relative h-10 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 rounded-md mb-3">
        <div
          className="absolute w-5 h-10 bg-black transform -translate-x-1/2 rounded-full border-2 border-white shadow-lg"
          style={{
            left: `${getPercentPosition()}%`,
            top: "0",
          }}
        />
      </div>
      <div className="flex items-center justify-between font-medium">
        <span>{marketValueRange.low}</span>
        <span>{marketValueRange.average}</span>
        <span>{marketValueRange.high}</span>
      </div>
    </div>
  );
};

export default PricingRange;
