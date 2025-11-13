"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import { useGlobalStore } from "@/store/globalStore";

export type JourneysItem = {
  id: number;
  vehicle: VehicleItem;
  country: string;
  description: string;
  departure: string;
  capacity: null;
  pictureUrl: string;
};

export type VehicleItem = {
  id: number;
  type: string;
};

export default function JourneysPage() {
  const [journeys, setJourneys] = useState<JourneysItem[]>([]);

  const router = useRouter();

  // GlobalStore elérése:
  // const { setId } = useGlobalStore();

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("http://localhost:3000/api/journeys");
      setJourneys(res.data);
    }
    fetchData();
  });

  function handleClick(id: number) {
    // setId(id); // GlobalStore id mezőjének beállítása
    router.push(`/registration?id=${id}`);
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <h1 className="p-4 text-center text-3xl font-bold">Kínálatunk</h1>
      <table className="mx-auto w-[95%] min-w-[600px] border border-gray-400 bg-white">
        <thead>
          <tr className="border-b border-gray-400">
            <td className="p-2">Ország</td>
            <td className="p-2">Utazási mód</td>
            <td className="w-30 p-2">Indulás</td>
            <td className="p-2">Max. létszám</td>
            <td className="p-2">Leírás</td>
            <td className="p-2">Fénykép</td>
          </tr>
        </thead>
        <tbody>
          {journeys.map((journey) => (
            <tr className="border-b border-gray-400" key={journey.id}>
              <td className="p-2">{journey.country}</td>
              <td className="p-2">{journey.vehicle.type}</td>
              <td className="p-2">{journey.departure}</td>
              <td className="p-2">{journey.capacity}</td>
              <td className="p-2">
                {journey.description}
                <button className="btn ml-2 btn-primary" onClick={() => handleClick(journey.id)}>
                  Érdekel
                </button>
              </td>
              <td className="min-w-[200px] p-2">
                <Image
                  alt="kép"
                  className="mx-auto h-[100px] w-auto rounded-xl"
                  height={100}
                  src={journey.pictureUrl}
                  width={200}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* {JSON.stringify(journeys)} */}
    </div>
  );
}
