import {
    NearestFilter,
    RGBAFormat,
    FloatType,
    WebGLRenderTarget,
    Scene,
    OrthographicCamera,
    DataTexture,
    Vector2,
    BufferGeometry,
    BufferAttribute,
    Points
} from "three"

export default class RenderTarget {

    constructor(width, height, material, pos, uvs, data=null) {

        this.width = width,
        this.height = height;
        let w = width;
        let h = height;
        let options = {
            minFilter: NearestFilter,
            magFilter: NearestFilter,
            format: RGBAFormat,
            type: FloatType
        }

        let rt = new WebGLRenderTarget(this.width, this.height, options)
        this.rt = rt

        if( data == null){
            data = new Float32Array(w*h*4)
        }
        let tex = new DataTexture(data, w, h, RGBAFormat, FloatType)
        tex.needsUpdate = true;
        rt.texture = tex;

        this.material = material        
        this.material.uniforms["input_texture"] = {value: this.texture};
        this.material.uniforms["resolution"] = {value : new Vector2(w,h)};
        this.material.uniforms["time"] = {value : 0};
        this.material.transparent = true;

        let pg = new BufferGeometry();
        pg.addAttribute("position", new BufferAttribute(pos, 3, false))
        pg.addAttribute("uv", new BufferAttribute(uvs, 2, true))
        this.mesh = new Points(pg, this.material)
        this.mesh.scale.set(w, h, 1)
        
        this.scene = new Scene();
        this.camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 100);
        this.camera.position.z = 1
        this.scene.add(this.mesh)

    }
    
    render(renderer, time=0) {
        
        this.mesh.visible = true;
        
        this.material.uniforms.time.value = time;

        renderer.setSize( this.width, this.height )
        renderer.setRenderTarget(this.rt)
        renderer.render(this.scene, this.camera)
        renderer.setRenderTarget(null)
        this.mesh.visible = false;
        
    }

    get texture () {
        return this.rt.texture
    }

}