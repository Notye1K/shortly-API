import bcrypt from 'bcrypt';
import { connection } from '../database.js';

export async function createUser(req, res) {
  const user = req.body;

  try {
    const existingUsers = await connection.query('SELECT * FROM users WHERE email=$1', [user.email])
    if (existingUsers.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await connection.query(`
      INSERT INTO 
        users(name, email, password) 
      VALUES ($1, $2, $3)
    `, [user.name, user.email, passwordHash])

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUser(req, res) {
  const { user } = res.locals;

  try {
    res.send(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUserId (req, res) {
  try {
    const id = req.params.id

    const {rows} = await connection.query(`
    SELECT u.id AS "uId", u.name, urls.*, urls.id AS "urlId"
    FROM users u
    JOIN urls ON u.id=urls."userId"
    WHERE u.id = $1
    GROUP BY u.id, urls.id
    `, [id])

    const obj = {
      id: rows[0].uId,
      name: rows[0].name,
      visitCount: rows.reduce((acc, curr) => acc + curr.visitCount,0),
      shortenedUrls: rows.map(v => {
        return {
          id: v.urlId,
          shortUrl: v.identifier,
          url: v.url,
          visitCount: v.visitCount
        }
      })
    }

    if(rows.length === 0){
      res.sendStatus(404)
    }else{
      res.send(obj)
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}