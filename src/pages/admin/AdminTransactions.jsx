import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Transactions
        </h1>

        {loading ? (
          <p className="text-gray-500 text-sm">
            Loading transactions...
          </p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No transactions found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-sky-50">
                <tr>
                  <th className="border px-3 py-2 text-left">
                    Student
                  </th>
                  <th className="border px-3 py-2 text-left">
                    Email
                  </th>
                  <th className="border px-3 py-2 text-left">
                    Amount
                  </th>
                  <th className="border px-3 py-2 text-left">
                    Payment Mode
                  </th>
                  <th className="border px-3 py-2 text-left">
                    Reference ID
                  </th>
                  <th className="border px-3 py-2 text-left">
                    Status
                  </th>
                  <th className="border px-3 py-2 text-left">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="border px-3 py-2">
                      {tx.student?.name || "—"}
                    </td>
                    <td className="border px-3 py-2">
                      {tx.student?.email || "—"}
                    </td>
                    <td className="border px-3 py-2">
                      ₹{tx.amount}
                    </td>
                    <td className="border px-3 py-2 capitalize">
                      {tx.paymentMode}
                    </td>
                    <td className="border px-3 py-2">
                      {tx.referenceId || "—"}
                    </td>
                    <td className="border px-3 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          tx.status === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="border px-3 py-2">
                      {new Date(
                        tx.createdAt
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminTransactions;
