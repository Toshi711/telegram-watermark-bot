function createPreset(ctx,title){
    const id = Math.random()
    ctx.session.presets[id] = {title: title,position: '⏺',text: ctx.message.text, fontSize: 16,opacity: 1, color: 'white', blur: 0, uppercase: true}
    return id
}
 

export default createPreset