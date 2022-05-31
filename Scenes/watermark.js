import {Scenes, Composer} from 'telegraf'
import {MenuTemplate, MenuMiddleware} from 'telegraf-inline-menu'
import connection from './../database/index.js'
import slicer from './../methods/slicer.js'
import axios from 'axios'
import path from 'path'
import Watermark from '../WatermarkCreater.js'
import timer from '../methods/timer.js'
import extractOptions from './../methods/extractOptions.js'
import extractPreset from '../methods/extractPreset.js'
import fs from 'fs'

const watermark = new Scenes.BaseScene('watermark')
const dirname = path.resolve();
watermark.enter(async ctx => {

    var photo = ctx.message.photo[2].file_id
    const kb = new MenuTemplate(ctx => ctx.i18n.t('choice_watermark'))

    const arr = await extractPreset(ctx)

    if(!arr) return await ctx.reply(ctx.i18n.t('error_choice_watermark'))

    const data = slicer(arr,6)

    for(let i = 0; i <= 6; i++){
        const preset_id = data[ctx.session.presetPage - 1][i]?.preset_id
        const preset_name = data[ctx.session.presetPage - 1][i]?.preset_name

        if(!preset_id) break
        kb.toggle('', preset_id, {

            isSet: ctx => preset_name,
            set: async (ctx, newState) => {

                let id = ctx.match[0].replace(/\D+/g,'')
                const options = await extractOptions(ctx,id)
                const json = JSON.parse(options[0].options)

                ctx.telegram.getFileLink(photo).then(({href}) => {    
                    axios({ method: 'get',url: href,responseType: 'stream'}).then(response => {  
                        new Promise(async (resolve, reject) => {
                            var downloadFile = `${dirname}\\imgs\\${ctx.from.id+'_'+Math.random()*18}.jpg`
                            await response.data.pipe(fs.createWriteStream(downloadFile))
                         
                            while(true){
 
                                if (fs.existsSync(downloadFile)) {

                                    var output = await new Watermark(downloadFile, json.text, json).init() 
                                    
                                    await timer(1000)
                                    try{
                                        await ctx.replyWithPhoto({source: output.replace(/\\/g, '/')})
                                        
                                        fs.rmSync(downloadFile.replace(/\\/g, '/'), {
                                            force: true,
                                        });

                                        fs.rmSync(output.replace(/\\/g, '/'), {
                                            force: true,
                                        });
                                    }
                                    catch{
                                        
                                    }
                                    break
                                }

                                await timer(3000)

                            }
                          
                            
                         
                        }) 
                        }) 

             
                })

                return true
            }
        })
    }

    kb.pagination('pagination', {
        getTotalPages: () => data.length,
        getCurrentPage: context => context.session.presetPage,
        setPage: (context, page) => {
            console.log(page)
            context.session.presetPage = page

            return true
        }
    })

     

    const kbMiddleware = new MenuMiddleware('/',kb)

    watermark.use(kbMiddleware.middleware())

    kbMiddleware.replyToContext(ctx)
 

})



export {watermark}