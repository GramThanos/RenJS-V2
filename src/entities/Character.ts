import {Sprite,Sound} from 'phaser-ce';

export interface CharacterInterface {
    keyName: string
    config: {
        displayName: string,
        color: string,
        voice: string,
        nameBox: string,
        messageBox: string
    }
    voice: Sound;
    currentLook: Sprite;
    usePortraits: boolean;

    createLook(props: {look?: string,position?: {x:number,y:number},flipped?:any}): Sprite;
}

export default class Character implements CharacterInterface {
    config = {
        displayName: "",
        color: "#FFFFFF",
        voice: "none",
        nameBox: "default",
        messageBox: "default"
    }

    currentLook = null;
    usePortraits = false;
    voice = null;
    constructor(private game,public keyName,config,hasPortrait?:boolean) {
        Object.assign(this.config,config);
        if (this.config.voice != 'none'){
            this.voice = this.game.add.audio(this.config.voice);
            // play silently once so the duration set
            this.voice.play();
            this.voice.stop();
        }
        this.usePortraits = (hasPortrait == true)
    }

    createLook(props: {look?: string,position?: {x:number,y:number},flipped?:any} = {}): Sprite {
        let data = this.currentLook ? this.getLookData() : {
            look: "normal",
            position: this.game.storyConfig.positions.DEFAULT,
            flipped: false
        }
        Object.assign(data,props);
        const imgKey = this.keyName+'_'+data.look;

        const look: Sprite = this.game.managers.story.characterSprites.create(data.position.x, data.position.y, imgKey);
        look.name = data.look;
        if (props.flipped == "flip"){
            if (this.currentLook){
                data.flipped = !(this.currentLook.scale.x == -1);
            } else {
                data.flipped = true
            }
        }
        look.scale.x = data.flipped ? -1 : 1;
        // character looks have anchor point at their feet
        look.anchor.set(0.5,1);
        look.alpha = 0;
        this.currentLook = look;
        return look;
    }

    // destroys look and resets properties
    resetLook(){
        this.currentLook.destroy();
        this.currentLook = null;
    }

    getLookData() : {look: string, position: {x:number,y:number}, flipped: boolean}{
        if (!this.currentLook) return null
        return {look:this.currentLook.name,position: {x: this.currentLook.x, y: this.currentLook.y}, flipped: (this.currentLook.scale.x == -1)};
    }

}
