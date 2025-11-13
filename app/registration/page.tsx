"use client";

import axios, { isAxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import { useGlobalStore } from "@/store/globalStore";

export type DestinationItem = {
  id: number;
  destination: string;
};

export type ReserveItem = {
  journeyId: number;
  name: string;
  email: string;
  numberOfParticipants: number;
  lastCovidVaccineDate: string;
  acceptedConditions: boolean;
};

export default function RegistrationPage() {
  const router = useRouter();
  // const { id, setId } = useGlobalStore();
  const searchParams = useSearchParams();
  const id: number | null = Number(searchParams.get("id")) || null;

  const [destination, setDestination] = useState<DestinationItem[]>([]);
  const [newReserve, setNewReserve] = useState<ReserveItem>({
    acceptedConditions: false,
    journeyId: id || 0,
    lastCovidVaccineDate: new Date().toISOString().split("T")[0], // Formátum az inputhoz "2025-11-13"
  } as ReserveItem);

  

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("http://localhost:3000/api/journeys/short");
      setDestination(res.data);
    }
    fetchData();
    // setId(null);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Alapértelmezett viselkedés (form újratöltése) letíltása
    try {
      const res = await axios.post("http://localhost:3000/api/reserve", newReserve);
      toast.success(`Regisztációját ${res.data.id}-s azonosítószámon rögzítettük.`);
      router.push("/journeys");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(`Hiba: ${error.response?.data.message || error.message}`);
      } else toast.error("Ismeretlen hiba!");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-200">
      <form
        className="flex w-[90%] max-w-[500px] flex-col gap-4 rounded-md bg-white p-4 shadow-xl"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-3xl font-bold">Regisztáció</h1>
        <div>
          <label htmlFor="dest">Utazás:</label>
          <select
            className="select w-full select-primary"
            id="dest"
            value={newReserve.journeyId}
            onChange={(e) => setNewReserve({ ...newReserve, journeyId: Number(e.target.value) })}
          >
            <option disabled value="0">
              Válasszon!
            </option>
            {destination.map((dest) => (
              <option key={dest.id} value={dest.id}>
                {dest.destination}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="nev">Az ön neve:</label>
          <input
            className="input w-full input-primary"
            defaultValue={newReserve.name}
            id="nev"
            type="text"
            onChange={(e) => setNewReserve({ ...newReserve, name: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="email">Az Ön e-mail címe:</label>
          <input
            className="input w-full input-primary"
            defaultValue={newReserve.email}
            id="email"
            type="email"
            onChange={(e) => setNewReserve({ ...newReserve, email: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="fo">Résztvevők száma:</label>
          <input
            className="input w-full input-primary"
            defaultValue={newReserve.numberOfParticipants}
            id="fo"
            max={53}
            min={1}
            type="number"
            onChange={(e) =>
              setNewReserve({ ...newReserve, numberOfParticipants: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <label htmlFor="covid">utolsó COVID oltásának dátuma:</label>
          <input
            className="input w-full input-primary"
            defaultValue={newReserve.lastCovidVaccineDate}
            type="date"
            onChange={(e) => setNewReserve({ ...newReserve, lastCovidVaccineDate: e.target.value })}
          />
        </div>
        <div>
          <input
            checked={newReserve.acceptedConditions}
            className="mr-2"
            id="accept"
            type="checkbox"
            onChange={(e) => setNewReserve({ ...newReserve, acceptedConditions: e.target.checked })}
          />
          <label htmlFor="accept">Felhasználási feltételeket elfogadom</label>
        </div>
        <div>
          <input className="btn mx-auto block shadow-xl btn-primary" type="submit" value="Küldés" />
        </div>
      </form>
      {/* {JSON.stringify(destination)} */}
      {/* {JSON.stringify(newReserve)} */}
    </div>
  );
}
