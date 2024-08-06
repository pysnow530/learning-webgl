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

    // TODO: 不是用参数传值，直接在子类指定
    createAndLinkProgram(vertexShaderSrc, fragmentShaderSrc) {
        this.vertexShaderSrc = vertexShaderSrc
        this.fragmentShaderSrc = fragmentShaderSrc
        this.program = createProgram(this.vertexShaderSrc, this.fragmentShaderSrc)
    }
}