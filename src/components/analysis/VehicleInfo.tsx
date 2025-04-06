import React from "react";
import { FullAnalysisResult } from "@/types/analysis";

type VehicleInfoProps = {
  fullAnalysisResult?: FullAnalysisResult;
};

const VehicleInfo: React.FC<VehicleInfoProps> = ({ fullAnalysisResult }) => {
  if (!fullAnalysisResult) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <p className="text-base font-bold mb-2">Vehicle Info</p>
      <ul className="space-y-2 text-sm">
        <li className="flex justify-between">
          <span className="text-gray-500">Make:</span>
          <span className="font-medium">{fullAnalysisResult.vehicle.make}</span>
        </li>
        <li className="flex justify-between">
          <span className="text-gray-500">Model:</span>
          <span className="font-medium">
            {fullAnalysisResult.vehicle.model}
          </span>
        </li>
        <li className="flex justify-between">
          <span className="text-gray-500">Color:</span>
          <span className="font-medium">
            {fullAnalysisResult.vehicle.color}
          </span>
        </li>
        <li className="flex justify-between">
          <span className="text-gray-500">Market Price:</span>
          <span className="font-medium">
            {fullAnalysisResult.vehicle.price}
          </span>
        </li>
        {fullAnalysisResult.plate_number && (
          <li className="flex justify-between">
            <span className="text-gray-500">Number Plate:</span>
            <span className="font-medium">
              {fullAnalysisResult.plate_number}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default VehicleInfo;
