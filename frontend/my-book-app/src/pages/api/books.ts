import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, method, body } = req;

  const baseUrl = 'http://localhost:8000'; // URL вашего FastAPI сервера

  if (method === 'GET') {
    const { skip, limit } = query;
    const response = await fetch(`${baseUrl}/books?skip=${skip}&limit=${limit}`);
    const data = await response.json();
    return res.status(200).json(data);
  }

  if (method === 'POST') {
    const response = await fetch(`${baseUrl}/books, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }`);
    const data = await response.json();
    return res.status(201).json(data);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
};