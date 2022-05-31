import { MenuMiddleware,MenuTemplate } from 'telegraf-inline-menu';
import {Composer} from 'telegraf'
import TelegrafStatelessQuestion from 'telegraf-stateless-question';
import Preset from './Preset.js'
const composer = new Composer()

const color = new TelegrafStatelessQuestion('color', ctx => {
	const id = ctx.session.currentId
	const color = ctx.message.text
	ctx.session.presets[id].color = color
	ctx.reply(ctx.i18n.t('success_color_changed'))

})

const newText = new TelegrafStatelessQuestion('newText', ctx => {
	const id = ctx.session.currentId
	const text = ctx.message.text.split(' ')
    text.splice(0,1)
 
	ctx.session.presets[id].text = text
	ctx.reply(ctx.i18n.t('success_changed'))


	delete ctx.session.currentId
})

composer.use(color.middleware())
composer.use(newText.middleware())

 
function KeyboardMaker(id){


	const menu = new MenuTemplate(ctx => ctx.i18n.t('create_watermark'))
	menu.interact(ctx => ctx.i18n.t('change_button'),'change_text', {
		do: (ctx,path) => {
			console.log(ctx.session.presets[id])

			ctx.session.currentId = id
			newText.replyWithMarkdown(ctx, ctx.i18n.t('create_watermark'))
			

			return false
		}
	})

	const font = new MenuTemplate(ctx => ctx.i18n.t('font_button'))
	font.select('fontSize', ['8pt','10pt','16pt','32pt','64pt','128pt'], {
		columns: 3,
		isSet: (ctx, key) => {
			return ctx.session.presets[id].fontSize === parseInt(key)
		},
		set: (ctx, key) => {
			ctx.session.position = key
            ctx.session.presets[id].fontSize = parseInt(key)
			return true
		},
	})   
	font.interact(ctx => ctx.i18n.t('back_button'), 'back', {
		do: () => {return '..'}
	})


	const positionMenu = new MenuTemplate(ctx => ctx.i18n.t('position_button'))
	positionMenu.select('position', ['↖️','⬆️','↗️','⬅️','⏺','➡️','↙️','⬇️','↘️'], {
		columns: 3,
		maxRows: 3,
		isSet: (ctx, key) => ctx.session.presets[id].position === key,
		set: (ctx, key) => {
			ctx.session.presets[id].position = key
			return true
		}
	})   
	positionMenu.interact(ctx => ctx.i18n.t('back_button'), 'back', {
		do: () => {return '..'}
	})


	const opacityMenu = new MenuTemplate(ctx => ctx.i18n.t('opacity_button'))

	opacityMenu.interact('-', 'opacityminus', {
		do: (ctx) => {

			if(ctx.session.presets[id].opacity !== 0) ctx.session.presets[id].opacity -= 0.1
			return true
		}
	})
	opacityMenu.interact(ctx => (ctx.session.presets[id].opacity * 100).toFixed(0) +'%','opacitycounter', {
		joinLastRow: true,
		do: () => {
			return true
		}
	})
	opacityMenu.interact('+', 'opacityplus', {
		joinLastRow: true,
		do: (ctx) => {

			if(ctx.session.presets[id].opacity !== 1) ctx.session.presets[id].opacity += 0.1
			return true
		}
	})



	opacityMenu.interact(ctx => ctx.i18n.t('back_button'), 'back', {
		do: () => {return '..'}
	})


	const colorMenu = new MenuTemplate(ctx => ctx.i18n.t('color_button'))
	colorMenu.select('color', ['white','black','red'], {
		isSet: (ctx, key) => ctx.session.presets[id].color === key,
		set: (ctx, key) => {
			ctx.session.presets[id].color = key
			return true
		}
	})
	colorMenu.interact(ctx => ctx.i18n.t('own_color_button'), 'ownColor', {
		do: async (ctx) => {
	
			ctx.session.currentId = id
			console.log(ctx.session.currentId)
			await color.replyWithMarkdown(ctx, ctx.i18n.t('color_question'))
		
			return false
		}
	})
	colorMenu.interact(ctx => ctx.i18n.t('back_button'), 'back', {
		do: () => {return '..'}
	})



	const blurMenu = new MenuTemplate(ctx => ctx.i18n.t('blur_button'))
 
	blurMenu.interact('-', 'minus', {
		do: (ctx) => {

			if(ctx.session.presets[id].blur !== 0) ctx.session.presets[id].blur -= 1
			return true
		}
	})
	blurMenu.interact(ctx => ctx.session.presets[id].blur,'blurcounter', {
		joinLastRow: true,
		do: () => {
			return true
		}
	})
	blurMenu.interact('+', 'plus', {
		joinLastRow: true,
		do: (ctx) => {

			if(ctx.session.presets[id].blur !== 10) ctx.session.presets[id].blur += 1
			return true
		}
	})
	blurMenu.interact(ctx => ctx.i18n.t('back_button'), 'back', {
		do: () => {return '..'}
	})



	const settings = new MenuTemplate(ctx => ctx.i18n.t('create_watermark'))
	settings.submenu(ctx => ctx.i18n.t('position_button'), 'position', positionMenu)
	settings.submenu(ctx => ctx.i18n.t('font_button'), 'font', font)
	settings.submenu(ctx => ctx.i18n.t('color_button'), 'color', colorMenu, {joinLastRow: true})
	settings.submenu(ctx => ctx.i18n.t('blur_button'), 'blur', blurMenu)
	settings.submenu(ctx => ctx.i18n.t('opacity_button'), 'opacity', opacityMenu, {joinLastRow: true})
	settings.toggle(ctx => ctx.i18n.t('uppercase_button'), 'isUppercase', {
		isSet: ctx => ctx.session.presets[id].uppercase,
		set: (ctx, newState) => {
			ctx.session.presets[id].uppercase = newState
			return true
		}
	})
	settings.interact(ctx => ctx.i18n.t('back_button'), 'back', {
		do: () => {return '..'}
	})
	menu.submenu(ctx => ctx.i18n.t('settings_button'), 'settings', settings)
	menu.interact(ctx => ctx.i18n.t('create_button'), 'creating', {
		do: async ctx => {
 
			const preset = new Preset(ctx.from.id, ctx.session.presets[id])
			 
			preset.write()
				.then(data => {
 
					ctx.reply(ctx.i18n.t('success_created'))
				})
				.catch(data => {
		
					ctx.reply(ctx.i18n.t('success_created'))
				})


			ctx.scene.leave()
			ctx.answerCbQuery()
			return false
			
		} 
	})

	const menuMiddleware = new MenuMiddleware('/',menu)


	return menuMiddleware

}
export {composer, KeyboardMaker}

	