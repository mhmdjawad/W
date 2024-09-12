class Webgl2 {
    constructor() {
        this.models = {};
        this.terminate = false;
        this.addModels();
    }
    reset(canvas) {
        let t;
        this.canvas = canvas;
        this.objs = 0;
        this.current = {};
        this.next = {};
        this.textures = {};
        if(canvas == null ) return;
        this.gl = canvas.getContext('webgl2');
        this.gl.blendFunc(770, 771);
        this.gl.activeTexture(33984);
        this.program = this.gl.createProgram();
        this.gl.enable(2884);
        this.gl.shaderSource(t = this.gl.createShader(35633), `#version 300 es
        precision highp float;                        
        in vec4 pos, col, uv, normal;                 
        uniform mat4 pv, eye, m, im;                  
        uniform vec4 bb;                              
        out vec4 v_pos, v_col, v_uv, v_normal;        
        void main() {                                 
        gl_Position = pv * (                        
        v_pos = bb.z > 0.                         
        ? m[3] + eye * (pos * bb)                 
        : m * pos                                 
        );                                          
        v_col = col;                                
        v_uv = uv;
        v_normal = transpose(inverse(m)) * normal;  
        }`);
        this.gl.compileShader(t);
        this.gl.attachShader(this.program, t);
        this.gl.shaderSource(t = this.gl.createShader(35632), `#version 300 es
        precision highp float;                  
        in vec4 v_pos, v_col, v_uv, v_normal;   
        uniform vec3 light;                     
        uniform vec4 o;                         
        uniform sampler2D sampler;              
        out vec4 c;                             
        void main() {
        c = mix(texture(sampler, v_uv.xy), v_col, o[3]);  
        if(o[1] > 0.){                                    
        c = vec4(                                       
            c.rgb * (max(0., dot(light, -normalize(       
            o[0] > 0.                                   
            ? vec3(v_normal.xyz)                        
            : cross(dFdx(v_pos.xyz), dFdy(v_pos.xyz))   
            )))
            + o[2]),                                      
            c.a                                           
        );
        }
        }`);
        this.gl.compileShader(t);
        this.gl.attachShader(this.program, t);
        this.gl.linkProgram(this.program);
        this.gl.useProgram(this.program);
        this.gl.clearColor(1, 1, 1, 1);
        this.clearColor("fff");
        this.gl.enable(2929);
        this.light({
            'y': -1
        });
        this.camera({
            'fov': 30
        });
        setTimeout( () => {
            this.draw();
        }
        , 16);
    }
    clearColor(color) {
        var c = this.col(color);
        this.gl.clearColor(...c);
    }
    getSettingsEmpty(_) {
        var s = {};
        s['w'] = 1;
        s['h'] = 1;
        s['d'] = 1;
        s['x'] = 0;
        s['y'] = 0;
        s['z'] = 0;
        s['rx'] = 0;
        s['ry'] = 0;
        s['rz'] = 0;
        s['b'] = '888';
        s['mode'] = 4;
        s['mix'] = 0;
        return s;
    }
    setState(state, type, texture, i, normal=[], A, B, C, Ai, Bi, Ci, AB, BC) {
        state[`n`] ||= 'o' + this.objs++;
        if (state[`size`])
            state[`w`] = state[`h`] = state[`d`] = state[`size`];
        if (state[`t`] && state[`t`][`width`] && !this.textures[state[`t`][`id`]]) {
            texture = this.gl.createTexture();
            this.gl.pixelStorei(37441, true);
            this.gl.bindTexture(3553, texture);
            this.gl.pixelStorei(37440, 1);
            this.gl.texImage2D(3553, 0, 6408, 6408, 5121, state[`t`]);
            this.gl.generateMipmap(3553);
            this.textures[state[`t`][`id`]] = texture;
        }
        if (state[`fov`]) {
            this.projection = new DOMMatrix([(1 / Math.tan(state[`fov`] * Math.PI / 180)) / (this.canvas.width / this.canvas.height), 0, 0, 0, 0, (1 / Math.tan(state[`fov`] * Math.PI / 180)), 0, 0, 0, 0, -1001 / 999, -1, 0, 0, -2002 / 999, 0]);
        }
        var s = this.getSettingsEmpty();
        state = {
            type,
            ...(this.current[state[`n`]] = this.next[state[`n`]] || s),
            ...state,
            'f': 0
        };
        if (this.models[state[`type`]] && this.models[state[`type`]]['vertices'] && 
                !this.models?.[state[`type`]]['verticesBuffer']) {
            this.gl.bindBuffer(34962, this.models[state[`type`]]['verticesBuffer'] = this.gl.createBuffer());
            this.gl.bufferData(34962, new Float32Array(this.models[state[`type`]]['vertices']), 35044);
            if (!this.models[state[`type`]][`normals`] && this.smooth)
                this.smooth(state);
            if (this.models[state[`type`]][`normals`]) {
                this.gl.bindBuffer(34962, this.models[state[`type`]][`normalsBuffer`] = this.gl.createBuffer());
                this.gl.bufferData(34962, new Float32Array(this.models[state[`type`]][`normals`].flat()), 35044);
            }
        }
        if ((this.models[state[`type`]] && this.models[state[`type`]][`uv`]) && !this.models[state[`type`]]['uvBuffer']) {
            this.gl.bindBuffer(34962, this.models[state[`type`]][`uvBuffer`] = this.gl.createBuffer());
            this.gl.bufferData(34962, new Float32Array(this.models[state[`type`]][`uv`]), 35044);
        }
        if ((this.models[state[`type`]] && this.models[state[`type`]][`indices`]) && !this.models[state[`type`]][`indicesBuffer`]) {
            this.models[state[`type`]][`indicesBuffer`] = this.gl.createBuffer();
            this.gl.bindBuffer(34963, this.models[state[`type`]][`indicesBuffer`]);
            this.gl.bufferData(34963, new Uint16Array(this.models[state[`type`]][`indices`]), 35044);
        }
        if (!state[`t`]) {
            state[`mix`] = 1;
        } else if (state[`t`] && !state[`mix`]) {
            state[`mix`] = 0;
        }
        this.next[state[`n`]] = state;
    }
    draw(now, dt, v, i, transparent=[]) {
        if(this.terminate) return;
        if(this.canvas == null) return;
        dt = now - this.lastFrame;
        this.lastFrame = now;
        requestAnimationFrame( (...t) => {
            this.draw(...t)
        }
        );
        if (this.next['camera']['g']) {
            this.render(this.next[this.next['camera']['g']], dt, 1);
        }
        v = this.animation('camera');
        if (this.next['camera']?.['g']) {
            v.preMultiplySelf(this.next[this.next['camera']['g']][`M`] || this.next[this.next['camera']['g']][`m`]);
        }
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, 'eye'), false, v.toFloat32Array());
        v['invertSelf']();
        v['preMultiplySelf'](this.projection);
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, 'pv'), false, v.toFloat32Array());
        this.gl.clear(16640);
        for (i in this.next) {
            if (this.next[i]['type'] == undefined)
                continue;
            if (this.next[i][`b`] == undefined) {
                debugger ;
            }
            if (!this.next[i][`t`] && this.col(this.next[i][`b`])[3] == 1) {
                if (this.next[i]['type'] == undefined) {
                    debugger ;
                }
                this.render(this.next[i], dt);
            } else {
                transparent.push(this.next[i]);
            }
        }
        transparent.sort( (a, b) => {
            return this.dist(b) - this.dist(a);
        }
        );
        this.gl.enable(3042);
        for (i of transparent) {
            if (["plane", "billboard"].includes(i[`type`]))
                this.gl.depthMask(0);
            this.render(i, dt);
            this.gl.depthMask(1);
        }
        this.gl.disable(3042);
        this.gl.uniform3f(this.gl.getUniformLocation(this.program, 'light'), this.lerp('light', 'x'), this.lerp('light', 'y'), this.lerp('light', 'z'));
    }
    render(object, dt, just_compute=['camera', 'light', 'group'].includes(object[`type`]), buffer) {

        if (object[`t`]) {
            this.gl.bindTexture(3553, this.textures[object[`t`][`id`]]);
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'sampler'), 0);
        }
        if (object[`f`] < object[`a`])
            object[`f`] += dt;
        if (object[`f`] > object[`a`])
            object[`f`] = object[`a`];
        this.next[object[`n`]][`m`] = this.animation(object['n']);
        if (this.next[object[`g`]]) {
            this.next[object[`n`]][`m`].preMultiplySelf(this.next[object[`g`]][`M`] || this.next[object[`g`]][`m`]);
        }
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, 'm'), false, (this.next[object[`n`]][`M`] || this.next[object[`n`]][`m`]).toFloat32Array());
        try {
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, 'im'), false, (new DOMMatrix(this.next[object[`n`]][`M`] || this.next[object[`n`]][`m`]))['invertSelf']().toFloat32Array());
        } catch (e) {
            console.log(e,this.next[object[`n`]]);
        }
        if (!just_compute) {
            if (this.models[object[`type`]] == undefined) {
                debugger ;
            }
            this.gl.bindBuffer(34962, this.models[object[`type`]][`verticesBuffer`]);
            this.gl.vertexAttribPointer(buffer = this.gl.getAttribLocation(this.program, 'pos'), 3, 5126, false, 0, 0)
            this.gl.enableVertexAttribArray(buffer);
            if (this.models[object[`type`]][`uvBuffer`]) {
                this.gl.bindBuffer(34962, this.models[object[`type`]][`uvBuffer`]);
                this.gl.vertexAttribPointer(buffer = this.gl.getAttribLocation(this.program, 'uv'), 2, 5126, false, 0, 0);
                this.gl.enableVertexAttribArray(buffer);
            }
            if ((object[`s`] || this.models[object[`type`]][`customNormals`]) && this.models[object[`type`]][`normalsBuffer`]) {
                this.gl.bindBuffer(34962, this.models[object[`type`]][`normalsBuffer`]);
                this.gl.vertexAttribPointer(buffer = this.gl.getAttribLocation(this.program, 'normal'), 3, 5126, false, 0, 0);
                this.gl.enableVertexAttribArray(buffer);
            }
            this.gl.uniform4f(this.gl.getUniformLocation(this.program, 'o'), object[`s`], ((object[`mode`] > 3) || (this.gl[object[`mode`]] > 3)) && !object[`ns`] ? 1 : 0, this.ambientLight || 0.2, object[`mix`]);
            this.gl.uniform4f(this.gl.getUniformLocation(this.program, 'bb'), object[`w`], object[`h`], object[`type`] == 'billboard', 0);
            if (this.models[object[`type`]][`indicesBuffer`]) {
                this.gl.bindBuffer(34963, this.models[object['type']][`indicesBuffer`]);
            }
            this.gl.vertexAttrib4fv(this.gl.getAttribLocation(this.program, 'col'), this.col(object['b']));
            if (this.models[object[`type`]][`indicesBuffer`]) {
                this.gl.drawElements(+object[`mode`] || this.gl[object[`mode`]], this.models[object[`type`]][`indices`].length, 5123, 0);
            } else {
                this.gl.drawArrays(+object[`mode`] || this.gl[object[`mode`]], 0, this.models[object[`type`]][`vertices`].length / 3);
            }
        }
    }
    lerp(item, property) {
        try {
            if (this.next[item] && this.next[item][`a`]) {
                return this.current[item][property] + (this.next[item][property] - this.current[item][property]) * (this.next[item][`f`] / this.next[item][`a`]);
            } else {
                return this.next[item][property];
            }
        } catch (e) {
            return 0;
        }
    }
    animation(item, m=new DOMMatrix) {
        var xitem = this.next[item];
        if (!xitem)
            return m;
        var x = this.lerp(item, 'x');
        var y = this.lerp(item, 'y');
        var z = this.lerp(item, 'z');
        var rx = this.lerp(item, 'rx');
        var ry = this.lerp(item, 'ry');
        var rz = this.lerp(item, 'rz');
        var w = this.lerp(item, 'w');
        var h = this.lerp(item, 'h');
        var d = this.lerp(item, 'd');
        var m2 = m.translateSelf(x, y, z).rotateSelf(rx, ry, rz).scaleSelf(w, h, d);
        return m2;
    }
    dist(a, b=null) {
        if (b == null)
            b = this.next.camera;
        return (a && a[`m`]) && (b && b[`m`]) ? (b[`m`][`m41`] - a[`m`][`m41`]) ** 2 + (b[`m`][`m42`] - a[`m`][`m42`]) ** 2 + (b[`m`][`m43`] - a[`m`][`m43`]) ** 2 : 0
    }
    ambient(a) {
        this.ambientLight = a
    }
    col(c) {
        return [...c.replace("#", "").match(c.length < 5 ? /./g : /../g).map(a => ('0x' + a) / (c.length < 5 ? 15 : 255)), 1]
    }
    add(name, objects) {
        this.models[name] = objects;
        if (objects['normals']) {
            this.models[name]['customNormals'] = 1;
        }
        this[name] = (settings) => {
            this.setState(settings, name);
        }
    }
    group(t) {
        this.setState(t, 'group')
    }
    move(t, delay) {
        return setTimeout( () => {
            this.setState(t)
        }
        , delay || 1);
    }
    delete(t, delay) {
        return setTimeout( () => {
            delete this.next[t]
        }
        , delay || 1);
    }
    camera(t, delay) {
        return setTimeout( () => {
            this.setState(t, t[`n`] = 'camera')
        }
        , delay || 1);
    }
    light(t, delay) {
        return delay ? setTimeout( () => {
            this.setState(t, t[`n`] = 'light')
        }
        , delay) : this.setState(t, t[`n`] = 'light');
    }
    smooth(state, dict={}, vertices=[], iterate, iterateSwitch, i, j, A, B, C, Ai, Bi, Ci, normal) {
        this.models[state[`type`]][`normals`] = [];
        for (i = 0; i < this.models[state[`type`]][`vertices`].length; i += 3) {
            vertices.push(this.models[state[`type`]][`vertices`].slice(i, i + 3));
        }
        if (iterate = this.models[state[`type`]][`indices`])
            iterateSwitch = 1;
        else
            iterate = vertices,
            iterateSwitch = 0;
        for (i = 0; i < iterate.length * 2; i += 3) {
            j = i % iterate.length;
            A = vertices[Ai = iterateSwitch ? this.models[state[`type`]][`indices`][j] : j];
            B = vertices[Bi = iterateSwitch ? this.models[state[`type`]][`indices`][j + 1] : j + 1];
            C = vertices[Ci = iterateSwitch ? this.models[state[`type`]][`indices`][j + 2] : j + 2];
            let AB = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
            let BC = [C[0] - B[0], C[1] - B[1], C[2] - B[2]];
            normal = i > j ? [0, 0, 0] : [AB[1] * BC[2] - AB[2] * BC[1], AB[2] * BC[0] - AB[0] * BC[2], AB[0] * BC[1] - AB[1] * BC[0]];
            dict[A[0] + "_" + A[1] + "_" + A[2]] ||= [0, 0, 0];
            dict[B[0] + "_" + B[1] + "_" + B[2]] ||= [0, 0, 0];
            dict[C[0] + "_" + C[1] + "_" + C[2]] ||= [0, 0, 0];
            this.models[state[`type`]][`normals`][Ai] = dict[A[0] + "_" + A[1] + "_" + A[2]] = dict[A[0] + "_" + A[1] + "_" + A[2]].map( (a, i) => a + normal[i]);
            this.models[state[`type`]][`normals`][Bi] = dict[B[0] + "_" + B[1] + "_" + B[2]] = dict[B[0] + "_" + B[1] + "_" + B[2]].map( (a, i) => a + normal[i]);
            this.models[state[`type`]][`normals`][Ci] = dict[C[0] + "_" + C[1] + "_" + C[2]] = dict[C[0] + "_" + C[1] + "_" + C[2]].map( (a, i) => a + normal[i]);
        }
    }
    addModels() {
        var plane_settings = {};
        var pyramid_settings = {};
        var cube_settings = {};
        plane_settings['vertices'] = [.5, .5, 0, -.5, .5, 0, -.5, -.5, 0, .5, .5, 0, -.5, -.5, 0, .5, -.5, 0];
        plane_settings['uv'] = [1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0];
        cube_settings['vertices'] = [.5, .5, .5, -.5, .5, .5, -.5, -.5, .5, .5, .5, .5, -.5, -.5, .5, .5, -.5, .5, .5, .5, -.5, .5, .5, .5, .5, -.5, .5, .5, .5, -.5, .5, -.5, .5, .5, -.5, -.5, .5, .5, -.5, -.5, .5, -.5, -.5, .5, .5, .5, .5, -.5, -.5, .5, .5, .5, .5, .5, -.5, .5, .5, -.5, .5, -.5, -.5, -.5, -.5, -.5, .5, .5, -.5, -.5, -.5, -.5, -.5, .5, -.5, .5, -.5, .5, .5, -.5, .5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, .5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, -.5, .5, -.5, -.5];
        cube_settings['uv'] = [1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0];
        pyramid_settings['vertices'] = [-.5, -.5, .5, .5, -.5, .5, 0, .5, 0, .5, -.5, .5, .5, -.5, -.5, 0, .5, 0, .5, -.5, -.5, -.5, -.5, -.5, 0, .5, 0, -.5, -.5, -.5, -.5, -.5, .5, 0, .5, 0, .5, -.5, .5, -.5, -.5, .5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, -.5, .5, -.5, -.5];
        pyramid_settings['uv'] = [0, 0, 1, 0, .5, 1, 0, 0, 1, 0, .5, 1, 0, 0, 1, 0, .5, 1, 0, 0, 1, 0, .5, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0];
        this.add("plane", plane_settings);
        this.add("billboard", this.models['plane']);
        this.add("cube", cube_settings);
        this.add("pyramid", pyramid_settings);
    }
    deleteAll() {
        this.terminate = true;
        var keys = Object.keys(this.current).filter(x => x!= 'camera' && x != 'light');
        for(let i = 0 ; i < keys.length;i++){
            var n = keys[i];
            this.delete(n,0);
        }
        var numTextureUnits = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
        for (var unit = 0; unit < numTextureUnits; ++unit) {
            this.gl.activeTexture(this.gl.TEXTURE0 + unit);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        for(let i in this.textures){
            this.gl.deleteTexture(this.textures[i]);
        }
    }
}
