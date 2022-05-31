import connection from './database/index.js'

class Preset{
    constructor(id,options){
        this.id = id
        this.presetId = new Date().getTime() / 1000
        this.title = options.title
        this.options = options
    }

    write(){

        return new Promise((resolve,reject) => {

            connection.query(`INSERT INTO presets(id, preset_id, preset_name, options) VALUES (${this.id},${this.presetId},"${this.title}",'${JSON.stringify(this.options)}')`, (error) => {
    
                if(error) reject('error')

                resolve(true)
            })

        })
    }
}

export default Preset