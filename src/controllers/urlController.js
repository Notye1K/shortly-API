import { connection } from "../database.js";
import { v4 as uuid } from 'uuid';

export async function postShorten (req, res){
    try {
        const url = req.body
        const {id} = res.locals.user
        const identifier = uuid().split('-')[0]

        await connection.query(`INSERT INTO urls ("userId", url, identifier)
            VALUES (${id}, $1, '${identifier}')`,[url])        
        res.status(201).send({ shortUrl: identifier })
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}