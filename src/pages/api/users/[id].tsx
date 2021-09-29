import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  console.log(id);

  const users = [
    {id: 1, name: 'Gabriel'},
    {id: 2, name: 'Maria'},
    {id: 3, name: 'João'},
    {id: 4, name: 'Stephanie'},
  ]

  return res.json(users);
}