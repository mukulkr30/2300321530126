export async function Log(level, packageName, message) {
  try {
    const token = import.meta.env.VITE_TOKEN

    const response = await fetch(
      "http://4.224.186.213/evaluation-service/logs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stack: "frontend",
          level,
          package: packageName,
          message,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Logging failed:", data);
    }

    return data;
  } catch (error) {
    console.error("Logger Error:", error);
  }
}