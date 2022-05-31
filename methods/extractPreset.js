import connection from "../database/index.js"
function extractPreset(ctx){

    return new Promise((resolve,reject) => {
        connection.query(`SELECT preset_name, preset_id FROM presets WHERE id = ${ctx.from.id}`, (error,results) => {

            
            if(!error && results.length > 0) {
            
            
                resolve(results)   
            }

            resolve(false)
        })

    })  
    
}
export default extractPreset