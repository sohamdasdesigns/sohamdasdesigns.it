import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { WireframeGeometry } from 'three'
import gsap from 'gsap'

/**
 * Debug
 */
// const gui = new dat.GUI()

const parameters = {
    materialColor: '#252525'
}

// gui
//     .addColor(parameters, 'materialColor')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// Material
// const material = new THREE.MeshToonMaterial({ 
//     color: parameters.materialColor,
//     gradientMap: gradientTexture
// })

const material = new THREE.MeshBasicMaterial( { 
    color: 0x000000,
    //antialias: true,
    wireframe: true, 
} );

const material2 = new THREE.MeshBasicMaterial( { 
    color: 0xffffff,
    //antialias: true,
    wireframe: true, 
} );

// Meshes
//  Soham Das - Title Object
const mesh1 = new THREE.Mesh(
    new THREE.IcosahedronGeometry( .75 , 0),
    material
)

// Il Bosco Non c`e
const mesh6 = new THREE.Mesh(
    new THREE.OctahedronGeometry( .75, 0),
    material
)

// Il Bosco Non c`e
const mesh2 = new THREE.Mesh(
    new THREE.OctahedronGeometry( .75, 0),
    material
)

// const points = [];
// for ( let i = 0; i < 10; i ++ ) {
// 	points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
// }
// const mesh2 = new THREE.Mesh(
//     new THREE.LatheGeometry( points ),
//     material2
// )
//mesh2.position.z = -80

// getLife
const mesh3 = new THREE.Mesh(
        new THREE.BoxGeometry( .2, 1.2, .8 ),
    material
)
// Through Time in Hell
const mesh4 = new THREE.Mesh(
    new THREE.SphereGeometry( .75, 15, 8 ),
    material
)
// Quarantine Colours
const mesh5 = new THREE.Mesh(
    new THREE.PlaneGeometry( 1, 1, 4, 4 ),
    material
)

const meshBackGround = new THREE.Mesh(
    new THREE.TorusKnotGeometry( 8 , .1, 100, 39),
    material2
)

scene.add(mesh1, mesh6, mesh2, mesh3, mesh4, mesh5, meshBackGround)

// var loader = new THREE.FontLoader();

// loader.load( 'https://unpkg.com/three@0.77.0/examples/fonts/gentilis_bold.typeface.json', function ( font ) {

//     var textGeo = new THREE.TextGeometry( "My Text", {

//         font: font,

//         size: 200,
//         height: 50,
//         curveSegments: 12,

//         bevelThickness: 2,
//         bevelSize: 5,
//         bevelEnabled: true

//     } );

//     var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } );

//     var mesh5 = new THREE.Mesh( textGeo, textMaterial );
//     mesh.position.set( x, y, z );

//     scene.add( mesh5 );

// } );

//Mesh Positions

const objectsDistance = 4

mesh1.position.x = 2
mesh6.position.x = 2
mesh2.position.x = 2
mesh3.position.x = 2
mesh4.position.x = 2
mesh5.position.x = 2

mesh1.position.y = - objectsDistance * 0
mesh6.position.y = - objectsDistance * 1
mesh2.position.y = - objectsDistance * 2
mesh3.position.y = - objectsDistance * 3
mesh4.position.y = - objectsDistance * 4
mesh5.position.y = - objectsDistance * 5

meshBackGround.position.x = - 3
meshBackGround.position.y = - 20

const sectionMeshes = [ mesh1, mesh6, mesh2, mesh3, mesh4, mesh5, meshBackGround ]

/**
 * Particles
 */
// Geometry
const particlesCount = 400
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Particles Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Lights
 */
 const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
 directionalLight.position.set(1, 1, 0)
 scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Scroll
 */
 let scrollY = window.scrollY
 let currentSection = 0

 window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
    //console.log(scrollY)

    //const newSection = scrollY / sizes.height
    const newSection = Math.round(scrollY / sizes.height)

    if(newSection != currentSection)
    {
        currentSection = newSection
        //console.log('changed', currentSection)

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5'
            }
        )
    }


})

/**
 * Cursor
 */
 const cursor = {}
 cursor.x = 0
 cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5

    //console.log(cursor)
})

/**
 * Camera
 */

// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//renderer.setClearAlpha(0)

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()