import {Vec3} from "../Vec3";

describe("Base Vector setting", ()=>{
    test('Creating vector from constructor', ()=>{
        const vec3 = new Vec3(1,2,3);
        expect(vec3.x).toBe(1);
        expect(vec3.y).toBe(2);
        expect(vec3.z).toBe(3);
    });
    test('Creating empty vector from constructor', ()=>{
        const vec3 = new Vec3();
        expect(vec3.x).toBe(0);
        expect(vec3.y).toBe(0);
        expect(vec3.z).toBe(0);
    });
    test('Creating empty vector and filling it using set()', ()=>{
        const vec3 = new Vec3();
        expect(vec3.x).toBe(0);
        expect(vec3.y).toBe(0);
        expect(vec3.z).toBe(0);
        vec3.set(2,5,7);
        expect(vec3.x).toBe(2);
        expect(vec3.y).toBe(5);
        expect(vec3.z).toBe(7);
    });
})

describe("Base Vector non-math operations", ()=>{
    let vec3 = new Vec3(1,2,3);
    beforeEach(()=>{
        vec3 = new Vec3(1,2,3);
    });

    test('Copying vector', ()=>{
        let tmp = vec3.copy();
        expect(tmp.x).toBe(vec3.x);
        expect(tmp.y).toBe(vec3.y);
        expect(tmp.z).toBe(vec3.z);
    });
    test('Vector length', ()=>{
        let tmp = vec3.len();
        expect(tmp).toBe(3.7416573867739413);
    });
})

describe("Base Vector math operations", ()=>{
    let vec3_test1 = new Vec3(3,5,7);
    let vec3_test2 = new Vec3(-1,2,3);
    beforeEach(()=>{
        vec3_test1 = new Vec3(3,5,7);
        vec3_test2 = new Vec3(-1,2,3);
    });
    test('Vector addition', ()=>{
        let tmp = vec3_test1.add(vec3_test2);
        expect(tmp.x).toBe(2);
        expect(tmp.y).toBe(7);
        expect(tmp.z).toBe(10);
    });
    test('Vector subtraction', ()=>{
        let tmp = vec3_test1.sub(vec3_test2);
        expect(tmp.x).toBe(4);
        expect(tmp.y).toBe(3);
        expect(tmp.z).toBe(4);
    });
    test('Vector scale by number', ()=>{
        let tmp = vec3_test1.scale(5);
        expect(tmp.x).toBe(15);
        expect(tmp.y).toBe(25);
        expect(tmp.z).toBe(35);
    });
    test('Vector scalar multiplication', ()=>{
        let tmp = vec3_test1.dot(vec3_test2);
        expect(tmp).toBe(28);
    });
    test('Vector vector multiplication', ()=>{
        let tmp = vec3_test1.cross(vec3_test2);
        expect(tmp.x).toBe(1);
        expect(tmp.y).toBe(-16);
        expect(tmp.z).toBe(11);
    });
    test('Vector negation', ()=>{
        let tmp = vec3_test2.negate();
        expect(tmp.x).toBe(1);
        expect(tmp.y).toBe(-2);
        expect(tmp.z).toBe(-3);
    });
})


