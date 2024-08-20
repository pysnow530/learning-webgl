const createProgram = (vertexShaderSrc, fragmentShaderSrc) => {
    // 顶点着色器
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vertexShaderSrc)
    gl.compileShader(vertexShader)
    const vertexShaderInfoLog = gl.getShaderInfoLog(vertexShader)
    console.log(`vertexShaderInfoLog: ${vertexShaderInfoLog}`)

    // 片元着色器
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, fragmentShaderSrc)
    gl.compileShader(fragmentShader)
    const fragmentShaderInfoLog = gl.getShaderInfoLog(fragmentShader)
    console.log(`fragmentShaderInfoLog: ${fragmentShaderInfoLog}`)

    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    return shaderProgram
}

class GameObject {
    vertexShaderSrc = ''
    fragmentShaderSrc = ''
    program = null

    data = []

    // TODO: 不是用参数传值，直接在子类指定
    init() {
        this.program = createProgram(this.vertexShaderSrc, this.fragmentShaderSrc)
    }

    setUniform(name, list) {
        if (list.length === 4) {
            gl.uniform4fv(gl.getUniformLocation(this.program, name), list)
        } else if (list.length === 3) {
            gl.uniform3fv(gl.getUniformLocation(this.program, name), list)
        } else if (list.length === 2) {
            gl.uniform2fv(gl.getUniformLocation(this.program, name), list)
        } else {
            gl.uniform1f(gl.getUniformLocation(this.program, name), list[0])
        }
    }
}

const genGrid = (length, gap) => {
    let lst = [
        -length / 2, 0, 0,
        length / 2, 0, 0,
        0, 0, -length / 2,
        0, 0, length / 2,
    ]
    for (let delta = gap; delta <= length / 2; delta += gap) {
        lst = lst.concat([
            -length / 2, 0, delta,
            length / 2, 0, delta,
            -length / 2, 0, -delta,
            length / 2, 0, -delta,
            delta, 0, -length / 2,
            delta, 0, length / 2,
            -delta, 0, -length / 2,
            -delta, 0, length / 2,
        ])
    }
    return lst
}

const colorTextToList = (color) => {
    const r = parseInt(color.substr(1, 2), 16) / 255
    const g = parseInt(color.substr(3, 2), 16) / 255
    const b = parseInt(color.substr(5, 2), 16) / 255
    return [r, g, b]
}