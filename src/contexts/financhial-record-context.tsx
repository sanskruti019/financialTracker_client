import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";

export interface FinanchialRecord {
  _id?: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface FinanchialRecordsContextType {
  records: FinanchialRecord[];
  addRecord: (record: FinanchialRecord) => void;
  updateRecord: (id: string, newRecord: FinanchialRecord) => void;
  deleteRecord: (id: string) => void;
}

export const FinanchialRecordsContext = createContext<
  FinanchialRecordsContextType | undefined
>(undefined);

export const FinanchialRecordsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [records, setRecords] = useState<FinanchialRecord[]>([]);
  const { user } = useUser();

  const fetchRecords = async () => {
    if (!user) return;
    const response = await fetch(
      `https://financialtracker-server.onrender.com/financhial-records/getAllByUserID/${user.id}`
    );

    if (response.ok) {
      const records = await response.json();
      console.log(records);
      setRecords(records);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const addRecord = async (record: FinanchialRecord) => {
    const response = await fetch("https://financialtracker-server.onrender.com/financhial-records", {
      method: "POST",
      body: JSON.stringify(record),
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) => [...prev, newRecord]);
      }
    } catch (err) {}
  };

  const updateRecord = async (id: string, newRecord: FinanchialRecord) => {
    const response = await fetch(
      `https://financialtracker-server.onrender.com/financhial-records/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(newRecord),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    try {
      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) =>
          prev.map((record) => {
            if (record._id === id) {
              return newRecord;
            } else {
              return record;
            }
          })
        );
      }
    } catch (err) {}
  };

  const deleteRecord = async (id: string) => {
    const response = await fetch(
      `https://financialtracker-server.onrender.com/financhial-records/${id}`,
      {
        method: "DELETE",
      }
    );

    try {
      if (response.ok) {
        const deletedRecord = await response.json();
        setRecords((prev) =>
          prev.filter((record) => record._id !== deletedRecord._id)
        );
      }
    } catch (err) {}
  };

  return (
    <FinanchialRecordsContext.Provider
      value={{ records, addRecord, updateRecord, deleteRecord }}
    >
      {children}
    </FinanchialRecordsContext.Provider>
  );
};

export const useFinanchialRecords = () => {
  const context = useContext<FinanchialRecordsContextType | undefined>(
    FinanchialRecordsContext
  );

  if (!context) {
    throw new Error(
      "useFinanchialRecords must be used within a FinanchialRecordsProvider"
    );
  }

  return context;
};