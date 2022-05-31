import {Scenes, Composer } from 'telegraf'
import {KeyboardMaker, composer} from './../keyboard.js';
import createPreset from '../methods/createPreset.js';
import extractPreset from '../methods/extractPreset.js';
const createScene = new Scenes.BaseScene('create_scene')
 
createScene.enter(async ctx => {
   
    ctx.reply(ctx.i18n.t('create_text_question'))

    const text = ctx.message.text.split(' ')
    text.splice(0,1)

    ctx.scene.state.title = text

    const created = await extractPreset(ctx)
    if(!!created){
 
        ctx.scene.state.title += ' (' + created.length + ')'
    }
     
})

createScene.on('text', ctx => {

    const id = createPreset(ctx, ctx.scene.state.title)
    const kb = KeyboardMaker(id)
    createScene.use(kb.middleware())
    kb.replyToContext(ctx)

})

createScene.on('message', ctx => {

    ctx.reply(ctx.i18n.t('error'))
    ctx.scene.leave()
})

 

export {createScene}