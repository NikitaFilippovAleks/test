import { useEffect, useState } from 'react';

import { apiWrapper } from 'config/api';

interface UseFetchInterface {
  data: unknown,
  errors: string[]
}

// Кастомный хук обработки запроса
export default function useFetch(url: string, method: string, options?: unknown): UseFetchInterface {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState([]);

  useEffect(() => { fetch(); }, [url]);

  // Запрос к серверу, обработка ошибок
  async function fetch() {
    const response = await apiWrapper[method](url, options);
    const { ok, data: responseData } = response;

    if (ok) setData(responseData);
    else setErrors(response);
  }

  return { data, errors };
}
