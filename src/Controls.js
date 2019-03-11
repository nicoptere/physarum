import {
    Vector2
} from "three"
let isDown = false;
let pid = 0
export default class Controls {

    constructor(renderer, agents) {

        this.renderer = renderer
        this.agents = agents
        this.size = new Vector2()
        
        this.radius = .025;
        this.count = 50;

        let container = renderer.domElement;
        container.addEventListener("mouseup", this.onUp.bind(this))
        container.addEventListener("mousedown", this.onDown.bind(this))
        container.addEventListener("mousemove", this.onMove.bind(this))
        container.addEventListener("dblclick", this.onDoubleClick.bind(this))

    }

    onDown(e) {
        isDown = true
        this.addParticles(e)
    }

    onDoubleClick(e) {
        
        let c = this.count
        this.count = -1
        this.addParticles(e )
        this.count = c
        
    }

    onUp(e) {
        isDown = false
    }

    onMove(e) {
        if (isDown) {
            this.addParticles(e, 50)
        }
    }

    addParticles(e) {

        let count = this.count
        if(this.count == -1 ){
            count = this.agents.texture.image.data.length / 4
        }

        this.renderer.getSize(this.size)
        let w = this.size.width
        let h = this.size.height
        let radius = this.radius
        let u = e.clientX / w
        let v = 1 - e.clientY / h
        let tex = this.agents.next.texture
        let arr = tex.image.data
        let max = arr.length / 4;
        let ratio = w / h,
            a, r, id;
        for (let i = pid; i < pid + count; i++) {

            id = (i % max) * 4
            a = Math.random() * Math.PI * 2
            r = ( Math.random() * radius )
            arr[id++] = u + Math.cos(a) * r
            arr[id++] = v + Math.sin(a) * r * ratio
            arr[id++] = Math.random()

        }
        pid += count
        this.renderer.copyTextureToTexture(new Vector2(0, 0), tex, tex);
    }

    random() {
        pid = 0;
        let tex = this.agents.texture
        let arr = tex.image.data
        let max = arr.length / 4;
        let id;
        for (let i = 0; i < max; i++) {
            id = i * 4
            arr[id++] = Math.random()
            arr[id++] = Math.random()
            arr[id++] = Math.random()
        }
        this.renderer.copyTextureToTexture(new Vector2(0, 0), tex, tex);
        this.renderer.copyTextureToTexture(new Vector2(0, 0), tex, this.agents.next.texture);
    }

}