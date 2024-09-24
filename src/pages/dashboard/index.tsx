import { useUser } from "@clerk/clerk-react";
import { FinanchialRecordForm } from "./financhial-record-form";
import { FinanchialRecordList } from "./financhial-record-list";
import "./financhial-record.css";
import { useFinanchialRecords } from "../../contexts/financhial-record-context";
import { useMemo } from "react";
export const Dashboard = () => {
  const { user } = useUser();
  const { records } = useFinanchialRecords();

  const totalMonthly = useMemo(() => {
    let totalAmount = 0;
    records.forEach((record) => {
      totalAmount += record.amount;
    });

    return totalAmount;
  }, [records]);

  return (
    <div className="dashboard-container">
      <h1> Welcome {user?.firstName}! Here Are Your Finances:</h1>
      <FinanchialRecordForm />
      <div>Total Monthly: Rs.{totalMonthly}</div>
      <FinanchialRecordList />
    </div>
  );
};