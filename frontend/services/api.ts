export const BASE_URL = "http://127.0.0.1:5000";

export async function postFormData<T>(
  endpoint: string,
  formData: FormData,
): Promise<T> {
  const response = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    let message = "Request failed.";

    try {
      const error = await response.json();
      message = error.error ?? message;
    } catch {}

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function getJSON<T>(
  endpoint: string,
): Promise<T> {
  const response = await fetch(
    `${BASE_URL}${endpoint}`,
  );

  if (!response.ok) {
    throw new Error("Request failed.");
  }

  return response.json() as Promise<T>;
}