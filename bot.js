import {Telegraf, session, Scenes} from 'telegraf'
import {createScene} from './Scenes/create.js'
import {watermark} from './Scenes/watermark.js'
import {MenuTemplate, MenuMiddleware} from 'telegraf-inline-menu'
import TelegrafI18n from 'telegraf-i18n'
import path from 'path'
import slicer from './methods/slicer.js'
import extractPreset from './methods/extractPreset.js'
const dirname = path.resolve();

const i18n = new TelegrafI18n({
    defaultLanguage: 'en',
    allowMissing: false, // Default true
    directory: path.resolve(dirname, 'locales')
  })
 
  

const bot = new Telegraf('5143243912:AAHxxR6Ak4HHVzpKsKAFra6xXWxDxk4VWWo')
const stage = new Scenes.Stage([createScene, watermark])

bot.use(session())
bot.use(i18n.middleware())
bot.use(async (ctx,next) => {

    if(!ctx.session) ctx.session = {presetPage: 1, presets: {}}

    await next()
})
bot.use(stage.middleware())


bot.hears(/^\/create/, ctx => {
     
    if(ctx.message.text.split(' ').length > 1){
        return ctx.scene.enter('create_scene')
    } 
    return ctx.reply(ctx.i18n.t('error_args'))

})

bot.command('mywatermarks', async ctx => {

    const kb = new MenuTemplate(ctx => ctx.i18n.t('yours_watermarks'))


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
bot.on('photo', async (ctx) => {

    
    ctx.scene.enter('watermark')

}); 
bot.launch()