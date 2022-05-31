import Jimp from 'jimp'
import sharp from 'sharp'
import path from 'path'
class Watermark {

    constructor(path,message ,options){

        this.path = path
        this.position = options.position
        this.message = message
        this.color = options.color || 'white'
        this.uppercase = options.uppercase || false
        this.fontSize = options.fontSize || 64
        this.opacity = options.opacity || 1
        this.blur = options.blur || 0

    }

    async alignmentHandler(){

        // Jimp.HORIZONTAL_ALIGN_LEFT;
        // Jimp.HORIZONTAL_ALIGN_CENTER;
        // Jimp.HORIZONTAL_ALIGN_RIGHT;
        
        // Jimp.VERTICAL_ALIGN_TOP;
        // Jimp.VERTICAL_ALIGN_MIDDLE;
        // Jimp.VERTICAL_ALIGN_BOTTOM;

        console.log(this.position)

        const positionList = {
            '↖️': 'tl',
            '⬆️': 'tc',
            '↗️': 'tr',
            '⬅️': 'ml',
            '⏺': 'mc',
            '➡️': 'mr',
            '↙️': 'bl',
            '⬇️': 'bc',
            '↘️': 'br'
        }

        if(!Object.values(positionList).includes(this.position)){
            
            this.position = positionList[this.position]

        }

    

        if(this.position == 'tl'){

            this.x = Jimp.HORIZONTAL_ALIGN_LEFT
            this.y = Jimp.VERTICAL_ALIGN_TOP;
        }
        else if(this.position == 'tc'){
            this.x = Jimp.HORIZONTAL_ALIGN_CENTER
            this.y = Jimp.VERTICAL_ALIGN_TOP;
        }
        else if(this.position == 'tr'){
            console.log('tr')
            this.x = Jimp.HORIZONTAL_ALIGN_RIGHT
            this.y = Jimp.VERTICAL_ALIGN_TOP;
        }
        else if(this.position == 'ml'){
            this.x = Jimp.HORIZONTAL_ALIGN_LEFT
            this.y = Jimp.VERTICAL_ALIGN_MIDDLE;
        }
        else if(this.position == 'mc'){
            this.x = Jimp.HORIZONTAL_ALIGN_CENTER
            this.y = Jimp.VERTICAL_ALIGN_MIDDLE;
        }

        else if(this.position == 'mr'){
            this.x = Jimp.HORIZONTAL_ALIGN_RIGHT
            this.y = Jimp.VERTICAL_ALIGN_MIDDLE;
        }

        else if(this.position == 'bl'){
            this.x = Jimp.HORIZONTAL_ALIGN_LEFT
            this.y = Jimp.VERTICAL_ALIGN_BOTTOM;
        }
        else if(this.position == 'bc'){
            this.x = Jimp.HORIZONTAL_ALIGN_CENTER
            this.y = Jimp.VERTICAL_ALIGN_BOTTOM;
        }

        else if(this.position == 'br'){
            this.x = Jimp.HORIZONTAL_ALIGN_RIGHT
            this.y = Jimp.VERTICAL_ALIGN_BOTTOM;
        }

        else{
            console.log('nothing')
            this.x = Jimp.HORIZONTAL_ALIGN_CENTER
            this.y = Jimp.VERTICAL_ALIGN_MIDDLE;
        }

        return [this.x,this.y]



    }

    async fontInit(){
        
        return this.fontSize == 8
        ? Jimp.FONT_SANS_8_BLACK
        : this.fontSize == 10
        ? Jimp.FONT_SANS_10_BLACK
        :this.fontSize == 16
        ? Jimp.FONT_SANS_16_BLACK
        :this.fontSize == 32
        ? Jimp.FONT_SANS_32_BLACK
        :this.fontSize == 64
        ? Jimp.FONT_SANS_64_BLACK
        :this.fontSize == 128
        ? Jimp.FONT_SANS_128_BLACK
        :this.fontSize == 64
        

        
    }

    init(callback){
         
         

        return new Promise(async (resolve,reject) => {

            console.log(this.path)
            const [xpos,ypos] = await this.alignmentHandler()
            const metadata = await sharp(this.path).metadata()

            if(this.uppercase) this.message = this.message.toLocaleUpperCase()
            let maxWidth = metadata.width
            let maxHeight = metadata.height

            const font = await this.fontInit()
    


            Jimp.read(this.path, (err, baseImage) => {
    
                    let textImage = new Jimp(maxWidth,maxHeight, 0x0, (err, textImage) => {  
                        if (err) throw err;
                    })
                    Jimp.loadFont(font).then(font => {
                        textImage.print(font, 0, 0,{
                            text: this.message,
                            alignmentX: xpos,
                            alignmentY: ypos
                          },
                          maxWidth,
                          maxHeight)
                         
                        textImage.color([{ apply: 'xor', params: [this.color] }]); 
                        textImage.opacity(this.opacity)
                        if(this.blur > 0) textImage.gaussian(+this.blur) 
    
                        baseImage.blit(textImage, 0, 0)
     
                        let output = path.parse(this.path)
                        output = output.dir+'\\'+output.name+'_modified'+output.ext
    
    
                        baseImage.write(output)

                        resolve(output)
                    });
    
                })



        })
 
    }
}
 


export default Watermark