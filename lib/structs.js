const cot = (angle) => 1 / Math.tan(angle)

// 行优先
class Mat4 extends Float32Array {
    constructor(list) {
        super(list)
    }

    static ZERO() {
        return new Mat4([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }

    static ONE() {
        return new Mat4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    }

    T() {
        return new Mat4([
            this[0], this[4], this[8], this[12],
            this[1], this[5], this[9], this[13],
            this[2], this[6], this[10], this[14],
            this[3], this[7], this[11], this[15]
        ])
    }

    mul(other) {
        const list = []
        for (let row = 0; row < 4; row++)
            for (let col = 0; col < 4; col++)
                list.push([0, 1, 2, 3].map(i => this[row * 4 + i] * other[i * 4 + col]).reduce((x, y) => x + y, 0))
        return new Mat4(list)
    }

    // 乘以列式向量
    mulVec4(vec4) {
        return new Vec4(
            this[0] * vec4.x() + this[1] * vec4.y() + this[2] * vec4.z() + this[3] * vec4.w(),
            this[4] * vec4.x() + this[5] * vec4.y() + this[6] * vec4.z() + this[7] * vec4.w(),
            this[8] * vec4.x() + this[9] * vec4.y() + this[10] * vec4.z() + this[11] * vec4.w(),
            this[12] * vec4.x() + this[13] * vec4.y() + this[14] * vec4.z() + this[15] * vec4.w()
        )
    }

    static TRANSLATE(x, y, z) {
        return new Mat4([
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1,
        ])
    }

    static ROTATE(angle) {
        return new Mat4([
            Math.cos(angle), -Math.sin(angle), 0, 0,
            Math.sin(angle), Math.cos(angle), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ])
    }

    static SCALE(x, y, z) {
        return new Mat4([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1,
        ])
    }

    static ViewMatrix(eye, lookAt) {
        const N = Vec3.sub(lookAt, eye).standardize()
        const U = Vec3.cross(Vec3.UP(), N).standardize()
        const V = Vec3.cross(N, U).standardize()
        return new Mat4([
            U.x(), U.y(), U.z(), -U.innerProduct(eye),
            V.x(), V.y(), V.z(), -V.innerProduct(eye),
            N.x(), N.y(), N.z(), -N.innerProduct(eye),
            0, 0, 0, 1,
        ])
    }

    static ProjMatrix(aspect, fov, near, far) {
        return new Mat4([
            cot(fov / 2) / aspect, 0, 0, 0,
            0, cot(fov / 2), 0, 0,
            0, 0, (far + near) / (far - near), -2 * far * near / (far - near),
            0, 0, 1, 0,
        ])
    }

    static equal(m1, m2) {
        for (let i = 0; i < 16; i++) {
            if (m1[i] !== m2[i]) return false
        }
        return true
    }

    format() {
        return `[
    ${this[0]} ${this[1]} ${this[2]} ${this[3]}
    ${this[4]} ${this[5]} ${this[6]} ${this[7]}
    ${this[8]} ${this[9]} ${this[10]} ${this[11]}
    ${this[12]} ${this[13]} ${this[14]} ${this[15]}
]`
    }
}

class Vec3 extends Float32Array {
    constructor(x, y, z) {
        super([x, y, z]);
    }

    static equal(p1, p2) {
        return p1[0] === p2[0] && p1[1] === p2[1] && p2[2] === p2[2]
    }

    static sub(p1, p2) {
        return new Vec3(p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]);
    }

    static cross(p1, p2) {
        return new Vec3(p1[1] * p2[2] - p1[2] * p2[1], -(p1[0] * p2[2] - p1[2] * p2[0]), p1[0] * p2[1] - p1[1] * p2[0])
    }

    norm() {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2])
    }

    standardize() {
        const l = this.norm()
        return new Vec3(this[0] / l, this[1] / l, this[2] / l)
    }

    static UP() {
        return new Vec3(0, 1, 0)
    }

    x() {
        return this[0]
    }

    y() {
        return this[1]
    }

    z() {
        return this[2]
    }

    static ZERO() {
        return new Vec3(0, 0, 0)
    }

    innerProduct(other) {
        return this[0] * other[0] + this[1] * other[1] + this[2] * other[2]
    }
}

class Vec4 extends Float32Array {
    constructor(x, y, z, w) {
        super([x, y, z, w])
    }

    x() {
        return this[0]
    }

    y() {
        return this[1]
    }

    z() {
        return this[2]
    }

    w() {
        return this[3]
    }
}

// 向量减法
const v1 = new Vec3(6, 5, 4)
const v2 = new Vec3(1, 2, 3)
const v3 = Vec3.sub(v1, v2)
console.assert(Vec3.equal(v3, new Vec3(5, 3, 1)))

// 向量叉积
const v4 = new Vec3(1, 0, 0)
const v5 = new Vec3(0, 1, 0)
const v6 = Vec3.cross(v4, v5)
console.assert(Vec3.equal(v6, new Vec3(0, 0, 1)))

// 向量的模
console.assert(Vec3.equal(v4.norm(), 1))
console.assert(Vec3.equal(v5.norm(), 1))
console.assert(Vec3.equal(v6.norm(), 1))
console.assert(Vec3.equal(new Vec3(1, 1, 0).norm(), Math.sqrt(2)))
console.assert(Vec3.equal(new Vec3(1, 1, 1).norm(), Math.sqrt(3)))

// 向量标准化
const assertFloatEqual = (x, required) => console.assert(Math.abs(x - required) <= 0.000001, `get ${x}, but required ${required}`)
assertFloatEqual(new Vec3(1, 1, 1).standardize().norm(), 1)

// 视图矩阵
// console.log(Mat4.ViewMatrix(Vec3.ZERO(), new Vec3(0, 0, -1)).format())
// console.log(Mat4.ViewMatrix(new Vec3(1, 1, 1), new Vec3(0, 0, 0)).format())
// console.assert(Mat4.ViewMatrix(new Vec3(1, 1, 1), new Vec3(0, 0, 0)).mulVec4(new Vec4(0, 0, 0, 1)))