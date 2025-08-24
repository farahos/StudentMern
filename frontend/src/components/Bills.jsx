import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { format, isValid } from "date-fns";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  // const [monthFilter, setMonthFilter] = useState(format(new Date(), "yyyy-MM"));
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all bills
  const fetchBills = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("https://studentmern.onrender.com/api/student/students-with-bills");
      setBills(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bills:", error);
      toast.error("Failed to fetch bills");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Mark as Paid
  const markAsPaid = async (billId) => {
    try {
      await axios.put(`https://studentmern.onrender.com/api/bills/${billId}/pay`);
      toast.success("Marked as Paid");
      fetchBills();
    } catch (error) {
      console.error("Error updating bill:", error);
      toast.error("Failed to update bill");
    }
  };

  // Filtered bills
  const filteredBills = bills
    .filter((bill) => {
      if (statusFilter === "All") return true;
      return bill.status === statusFilter;
    })
    // .filter((bill) => {
    //   if (!monthFilter) return true;
    //   const date = new Date(bill.createdAt);
    //   if (!bill.createdAt || !isValid(date)) return false; // safe check
    //   const billMonth = format(date, "yyyy-MM");
    //   return billMonth === monthFilter;
    // })
    .filter((bill) =>
      bill.student?.studentName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  // Total amount
  const totalAmount = filteredBills.reduce((acc, bill) => acc + bill.amount, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Bills List</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by student..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-60"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
        {/* <input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="border p-2 rounded"
        /> */}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Student</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr
                  key={bill._id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="border p-2">{bill.student?.studentName}</td>
                  <td className="border p-2">{bill.student?.studentClass}</td>
                  <td className="border p-2">${bill.amount}</td>
                  <td
                    className={`border p-2 font-semibold ${
                      bill.status === "Paid" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {bill.status}
                  </td>
                  <td className="border p-2">
                    {bill.status === "Unpaid" ? (
                      <button
                        onClick={() => markAsPaid(bill._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Mark Paid
                      </button>
                    ) : (
                      <span className="text-gray-500">Already Paid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div className="mt-4 font-semibold text-lg">
            Total Amount: ${totalAmount}
          </div>
        </>
      )}
    </div>
  );
};

export default Bills;
