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

export async function getShorten (req, res){
    try {
        const url = req.params.shortUrl

        const {rows} = await connection.query(`
        SELECT id, identifier AS "shortUrl", url
        FROM urls
        WHERE identifier = $1
        `, [url])

        if(rows.length === 0){
            res.sendStatus(404)
        }else{
            res.send(rows[0])
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}