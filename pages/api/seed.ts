import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  // Placeholder for setup function
  const setup = async () => {
    // Simulate setup process
    return null;
  };

  const message = await setup();

  if (message) {
    res.status(500).json({
      error: { message }
    });
  } else {
    await res.revalidate(`/`);
    res.status(200).send('ok.');
  }
}

export default handler;
