import {
    NearestFilter,
    RGBAFormat,
    FloatType,
    WebGLRenderTarget,
    Scene,
    OrthographicCamera,
    PlaneBufferGeometry,
    Mesh,
    DataTexture,
    Vector2
} from "three"

export default class PingpongRenderTarget {

    /*
    constructor(width, height, material, tex) {

        this.width = width;
        this.height = height;
        this.material = material

        let w = width;
        let h = height;

        this.scene = new Scene();
        this.camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 100);
        this.camera.position.z = 1

        this.mesh = new Mesh(new PlaneBufferGeometry(), material)
        this.mesh.scale.set( w,h,1)
        this.scene.add(this.mesh)

        let options = {
            minFilter: NearestFilter,
            magFilter: NearestFilter,
            format: RGBAFormat,
            type: FloatType,
            depthBuffer: false,
            stencilBuffer: false,
        }
        
        let rt_a = new WebGLRenderTarget(this.width, this.height, options)
        let rt_b = new WebGLRenderTarget(this.width, this.height, options)

        let id = 0;
        let data = new Float32Array( w * h * 4)
        for (let i = 0; i < w*h; i++) {

            data[id++] = ~~(i / w) / w//Math.random();
            data[id++] = ~~(i % w) / w//Math.random();
            data[id++] = .5; //~~(i/w) / w;
            data[id++] = Math.random();
        }
        let tex_a = new DataTexture( data, w, h, RGBAFormat, FloatType);

        id=0;
        data = new Float32Array(w * h * 4)
        for (let i = 0; i < w * h; i++) {

            data[id++] = 0
            data[id++] = 0
            data[id++] = 0
            data[id++] = 1.;//Math.random();
        }
        let tex_b = new DataTexture( data, w, h, RGBAFormat, FloatType);
        
        tex_a.needsUpdate = true
        tex_b.needsUpdate = true
        
        rt_a.texture = tex_a
        rt_b.texture = tex_b


        rt_a.name = "rt_a";
        rt_b.name = "rt_b";
        tex_a.name = "tex_a";
        tex_b.name = "tex_b";

        this.rt_a = rt_a;
        this.tex_a = tex_a;
        this.rt_b = rt_b;
        this.tex_b = tex_b;

        this.id = 0;
        this.switch()

        this.test = new Mesh(new PlaneBufferGeometry(), new MeshBasicMaterial({
            color: 0xFFFFFF,
            map: this.texture,
            transparent:true,
            // opacity:.25

        }))
        this.test.scale.set(w * .5, h * .5, 1)
        this.test.position.set(-w * .25, -h * .25, .1)
        this.scene.add(this.test)
        
    }

    get texture() {
        
        return (this.id % 2 == 1) ? this.tex_a : this.tex_b;
        // return this.target.texture;
    }

    switch() {
        
        this.id++;
        this.source = (this.id % 2 == 0) ? this.tex_a : this.tex_b;
        this.target = (this.id % 2 == 1) ? this.rt_a : this.rt_b;
        this.setUniform("input_texture", this.source)

    }
    
    setUniform(name, value) {
        return this.material.uniforms[name].value = value;
    }
    
    getUniform(name) {
        return this.material.uniforms[name].value;
    }
    render(renderer) {

        this.test.visible = false;

        // console.log(this.source.name, this.target.name,
        // this.mesh.material.uniforms.time.value)

        this.switch()
        renderer.setSize(this.width, this.height)
        renderer.setRenderTarget(this.target)
        renderer.render(this.scene, this.camera)

        this.rt_a.needsUpdate = true
        this.rt_b.needsUpdate = true

        this.rt_a.texture.needsUpdate = true
        this.rt_b.texture.needsUpdate = true

        renderer.setRenderTarget(null)

        this.test.visible = true;
        this.test.material.map = this.texture;
        renderer.clear()
        // renderer.setClearColor(0xFF00FF, 1)
        renderer.render(this.scene, this.camera)

    }
    //*/
    constructor(width, height, material, data = null) {

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

        let rt_a = new WebGLRenderTarget(this.width, this.height, options)
        let rt_b = new WebGLRenderTarget(this.width, this.height, options)

        this.rt_a = rt_a
        this.rt_b = rt_b
        this.current = this.rt_a
        this.next = this.rt_b

        if( data == null){
            data = new Float32Array(w*h*4)
        }

        let tex = new DataTexture(data, w, h, RGBAFormat, FloatType)
        tex.needsUpdate = true;
        // tex.wrapS = tex.wrapT = RepeatWrapping
        rt_a.texture = tex.clone()
        rt_b.texture = tex;


        this.material = material        
        this.material.uniforms["input_texture"] = {value: this.texture};
        this.material.uniforms["resolution"] = {value : new Vector2(w,h)};
        this.material.uniforms["time"] = {value : 0};
        this.material.transparent = true;

        this.mesh = new Mesh(new PlaneBufferGeometry(), this.material)
        this.mesh.scale.set(w, h, 1)

        this.scene = new Scene();
        this.camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 100);
        this.camera.position.z = 1
        this.scene.add(this.mesh)

    }
    
    switch () {
        this.current = this.current == this.rt_a ? this.rt_b : this.rt_a,
        this.next = this.current == this.rt_a ? this.rt_b : this.rt_a
    }
    
    render(renderer, time=0) {
        
        this.switch()
        this.mesh.visible = true;
        
        this.material.uniforms.input_texture.value = this.texture;
        this.material.uniforms.time.value = time;

        renderer.setSize( this.width, this.height )
        renderer.setRenderTarget(this.next)
        renderer.render(this.scene, this.camera)
        renderer.setRenderTarget(null)
        this.mesh.visible = false;
        
    }

    get texture () {
        return this.current.texture
    }

}