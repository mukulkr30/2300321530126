import React, { useState, useEffect } from "react";

function Notification() {
  const [val, setVal] = useState("");
  const [number, setNumber] = useState(10);
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      console.log("TOKEN:", import.meta.env.VITE_TOKEN);
      console.log("URL:", import.meta.env.VITE_NOTIFICATION);

      const res = await fetch(
        import.meta.env.VITE_NOTIFICATION,
        {
          headers: {
            Authorization: `${import.meta.env.VITE_TOKEN}`,
          },
        }
      );

      const data = await res.json();

      console.log("Status:", res.status);
      console.log("Response:", data);

      if (!res.ok) {
        setError(`API Error: ${res.status}`);
        return;
      }

      const weight = {
        Placement: 3,
        Result: 2,
        Event: 1,
      };

      const notifications = data.notifications || [];

      const sortedNotifications = notifications.sort((a, b) => {
        const weightDiff =
          (weight[b.Type] || 0) - (weight[a.Type] || 0);

        if (weightDiff !== 0) return weightDiff;

        return (
          new Date(b.Timestamp) -
          new Date(a.Timestamp)
        );
      });

      setMails(sortedNotifications);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const num = Number(val);

    if (num > 0) {
      setNumber(num);
    }
  };

  const filteredMails = mails.slice(0, number);

  if (loading) {
    return (
      <div className="text-center mt-10 text-xl">
        Loading notifications...
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="text-center mt-10 text-red-500">
  //       {error}
  //     </div>
  //   );
  // }

  return (
    <div className="mx-4 bg-slate-900 min-h-screen">
      <div className="text-center text-2xl text-white bg-slate-700 py-3">
        <h3>Notification</h3>
      </div>

      <div className="flex justify-center m-5 items-center">
        <form onSubmit={handleSubmit}>
          <label className="text-white mx-4">
            Filter Notification
          </label>

          <input
            type="number"
            placeholder="Enter The Number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="bg-white mx-4 p-2 rounded"
          />

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-400 rounded-2xl px-4 py-2"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="space-y-3 p-4">
        {filteredMails.map((mail) => (
          <div
            key={mail.ID}
            className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-white"
          >
            <div className="flex justify-between">
              <span className="font-bold">
                {mail.Type}
              </span>

              <span className="text-sm text-gray-400">
                {mail.Timestamp}
              </span>
            </div>

            <p className="mt-2">
              {mail.Message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notification;