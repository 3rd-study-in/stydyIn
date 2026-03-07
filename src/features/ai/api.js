const GPT_API_URL = 'https://dev.wenivops.co.kr/services/openai-api';

export async function callGptApi(messages) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(GPT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error('AI 요청에 실패했습니다.');
    const data = await res.json();
    return data.choices[0].message.content;
  } finally {
    clearTimeout(timeoutId);
  }
}
