import connection from "../database/index.js"

function extractOptions(ctx, id){
    return new Promise((resolve,reject) => {
                    
        connection.query(`SELECT options FROM presets WHERE id = ${ctx.from.id} AND preset_id = ${id}`, (error, results) => {
            if(!error){
                resolve(results)
            }

            reject('err')
        })
    })

}

export default extractOptions