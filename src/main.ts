import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import {
  BATWING_BOX_DIMENSIONS,
  type BatwingSettings,
  type QuadFace,
  buildBatwingQuadMeshData,
  createBatwingBoxGuideGeometry,
} from './batwingGeometry'
import { subdivideCatmullClark, type QuadMeshData } from './catmullClark'
import { InfiniteFadingGrid } from './infiniteGrid'

type BatwingControlKey = keyof BatwingSettings

type SliderBinding = {
  key: BatwingControlKey
  fallback: number
  slider: HTMLInputElement
  valueInput: HTMLInputElement
}

type BatwingArraySettings = {
  lengthCount: number
  widthCount: number
  heightCount: number
  subdivisions: number
}

type ArrayControlKey = keyof BatwingArraySettings

type ArraySliderBinding = {
  key: ArrayControlKey
  fallback: number
  min: number
  max: number
  slider: HTMLInputElement
  valueInput: HTMLInputElement
}

type BatwingGeometrySet = {
  meshGeometry: THREE.BufferGeometry
  wireGeometry: THREE.BufferGeometry
}

type BatwingAppState = {
  settings: BatwingSettings
  arraySettings: BatwingArraySettings
  showWireframe: boolean
  reflectionsEnabled: boolean
  showBoxGuide: boolean
}

type BatwingMaterialStyle = {
  color: number
  metalness: number
  roughness: number
  clearcoat: number
  clearcoatRoughness: number
  envMapIntensity: number
  iridescence: number
  iridescenceIOR: number
  iridescenceThicknessRange: [number, number]
  reflectivity: number
  specularIntensity: number
  sheen: number
  sheenRoughness: number
  sheenColor: number
  eggIridescence: number
  eggIridescenceFrequency: number
}

type EggIridescenceState = {
  strength: number
  frequency: number
  uniforms:
    | null
    | {
        uEggIridescence: { value: number }
        uEggIridescenceFrequency: { value: number }
      }
}

declare global {
  interface Window {
    __batwingDebug?: {
      getStats: () => {
        vertexCount: number
        indexCount: number
        hasNormals: boolean
        finitePositions: boolean
      }
      setSettings: (settings: BatwingSettings) => void
    }
  }
}

document.title = '260428_BatwingGyroid'

const EXPORT_BASE_NAME = '260428_BatwingGyroid'
const MAX_HISTORY_STATES = 100
const MAX_ARRAY_COUNT = 20
const MAX_SUBDIVISIONS = 3
const WELD_EPSILON = 1e-5
const DEFAULT_SETTINGS: BatwingSettings = {
  t0: 0.5,
  t1: 0.5,
  t2: 0.5,
  t3: 0.5,
}
const DEFAULT_ARRAY_SETTINGS: BatwingArraySettings = {
  lengthCount: 1,
  widthCount: 1,
  heightCount: 1,
  subdivisions: 0,
}

const FOIL_MATERIAL_STYLE: BatwingMaterialStyle = {
  color: 0xf1f5ff,
  metalness: 1,
  roughness: 0.28,
  clearcoat: 1,
  clearcoatRoughness: 0.24,
  envMapIntensity: 1.9,
  iridescence: 0.72,
  iridescenceIOR: 1.22,
  iridescenceThicknessRange: [140, 460],
  reflectivity: 1,
  specularIntensity: 1,
  sheen: 0.1,
  sheenRoughness: 0.5,
  sheenColor: 0xe7eeff,
  eggIridescence: 1.05,
  eggIridescenceFrequency: 1.25,
}

const MATTE_MATERIAL_STYLE: BatwingMaterialStyle = {
  color: 0xc2d5f2,
  metalness: 0.04,
  roughness: 0.86,
  clearcoat: 0,
  clearcoatRoughness: 0,
  envMapIntensity: 0,
  iridescence: 0.18,
  iridescenceIOR: 1.22,
  iridescenceThicknessRange: [140, 460],
  reflectivity: 0.18,
  specularIntensity: 0.22,
  sheen: 0,
  sheenRoughness: 1,
  sheenColor: 0xffffff,
  eggIridescence: 0.42,
  eggIridescenceFrequency: 1.1,
}

const REFLECTION_ACCENT_INTENSITIES = {
  magenta: 6.2,
  cyan: 7.8,
  amber: 6.9,
} as const

const app = document.querySelector<HTMLDivElement>('#app') ?? (() => {
  throw new Error('App root was not found.')
})()

app.innerHTML = `
  <div class="app-shell">
    <canvas class="viewport" aria-label="Batwing mesh viewport"></canvas>
    <section id="ui-panel" class="apple-panel" aria-label="Batwing mesh controls">
      <div id="ui-handle" class="panel-drag-handle">
        <button
          id="collapseToggle"
          class="collapse-button panel-collapse-toggle"
          type="button"
          aria-label="Collapse controls"
          aria-expanded="true"
        >
          <span class="collapse-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="ui-body panel-sections">
        <div class="control-hint">Wheel = Zoom, MMB = Pan, RMB = Orbit</div>
        <section class="panel-section">
          <button class="panel-section-header" type="button" aria-expanded="true">
            <span class="panel-section-label">Batwing</span>
          </button>
          <div class="panel-section-content panel-controls-stack">
            <label class="control" for="t0Slider">
              <div class="control-row">
                <span>Vert Positions 1</span>
                <input id="t0-value" class="value-pill value-input" type="number" inputmode="decimal" min="0" max="1" step="0.01" value="0.50" />
              </div>
              <input id="t0Slider" type="range" min="0" max="1" value="0.50" step="0.01" />
            </label>
            <label class="control" for="t1Slider">
              <div class="control-row">
                <span>Vert Positions 2</span>
                <input id="t1-value" class="value-pill value-input" type="number" inputmode="decimal" min="0" max="1" step="0.01" value="0.50" />
              </div>
              <input id="t1Slider" type="range" min="0" max="1" value="0.50" step="0.01" />
            </label>
            <label class="control" for="t2Slider">
              <div class="control-row">
                <span>Vert Positions 3</span>
                <input id="t2-value" class="value-pill value-input" type="number" inputmode="decimal" min="0" max="1" step="0.01" value="0.50" />
              </div>
              <input id="t2Slider" type="range" min="0" max="1" value="0.50" step="0.01" />
            </label>
            <label class="control" for="t3Slider">
              <div class="control-row">
                <span>Vert Positions 4</span>
                <input id="t3-value" class="value-pill value-input" type="number" inputmode="decimal" min="0" max="1" step="0.01" value="0.50" />
              </div>
              <input id="t3Slider" type="range" min="0" max="1" value="0.50" step="0.01" />
            </label>
          </div>
        </section>
        <section class="panel-section">
          <button class="panel-section-header" type="button" aria-expanded="true">
            <span class="panel-section-label">Array</span>
          </button>
          <div class="panel-section-content panel-controls-stack">
            <label class="control" for="lengthCountSlider">
              <div class="control-row">
                <span>Length Count</span>
                <input id="length-count-value" class="value-pill value-input" type="number" inputmode="numeric" min="1" max="20" step="1" value="1" />
              </div>
              <input id="lengthCountSlider" type="range" min="1" max="20" value="1" step="1" />
            </label>
            <label class="control" for="widthCountSlider">
              <div class="control-row">
                <span>Width Count</span>
                <input id="width-count-value" class="value-pill value-input" type="number" inputmode="numeric" min="1" max="20" step="1" value="1" />
              </div>
              <input id="widthCountSlider" type="range" min="1" max="20" value="1" step="1" />
            </label>
            <label class="control" for="heightCountSlider">
              <div class="control-row">
                <span>Height Count</span>
                <input id="height-count-value" class="value-pill value-input" type="number" inputmode="numeric" min="1" max="20" step="1" value="1" />
              </div>
              <input id="heightCountSlider" type="range" min="1" max="20" value="1" step="1" />
            </label>
            <label class="control" for="subdivisionsSlider">
              <div class="control-row">
                <span>Subdivisions</span>
                <input id="subdivisions-value" class="value-pill value-input" type="number" inputmode="numeric" min="0" max="3" step="1" value="0" />
              </div>
              <input id="subdivisionsSlider" type="range" min="0" max="3" value="0" step="1" />
            </label>
          </div>
        </section>
        <section class="panel-section">
          <button class="panel-section-header" type="button" aria-expanded="true">
            <span class="panel-section-label">Display</span>
          </button>
          <div class="panel-section-content panel-controls-stack">
            <label class="toggle-control" for="wireToggle">
              <span>Mesh Wires</span>
              <input id="wireToggle" type="checkbox" checked />
            </label>
            <label class="toggle-control" for="reflectionToggle">
              <span>Foil Material</span>
              <input id="reflectionToggle" type="checkbox" checked />
            </label>
            <label class="toggle-control" for="boxGuideToggle">
              <span>Box Guide</span>
              <input id="boxGuideToggle" type="checkbox" checked />
            </label>
          </div>
        </section>
        <section class="panel-section">
          <button class="panel-section-header" type="button" aria-expanded="true">
            <span class="panel-section-label">Export</span>
          </button>
          <div class="panel-section-content panel-controls-stack">
            <div class="control">
              <button id="exportObjButton" class="pill-button control-button-wide" type="button">Export OBJ</button>
            </div>
            <div class="control">
              <button id="exportGlbButton" class="pill-button control-button-wide" type="button">Export GLB</button>
            </div>
            <div class="control">
              <button id="exportScreenshotButton" class="pill-button control-button-wide" type="button">Export Screenshot</button>
            </div>
          </div>
        </section>
      </div>
      <div id="ui-handle-bottom"></div>
    </section>
  </div>
`

function requireElement<T extends Element>(selector: string): T {
  const element = app.querySelector<T>(selector)
  if (!element) {
    throw new Error(`Missing UI element: ${selector}`)
  }

  return element
}

function addWrappedGlow(
  context: CanvasRenderingContext2D,
  width: number,
  x: number,
  y: number,
  radius: number,
  stops: readonly [number, string][],
): void {
  for (const offset of [-width, 0, width]) {
    const gradient = context.createRadialGradient(x + offset, y, 0, x + offset, y, radius)
    for (const [position, color] of stops) {
      gradient.addColorStop(position, color)
    }
    context.fillStyle = gradient
    context.fillRect(x + offset - radius, y - radius, radius * 2, radius * 2)
  }
}

function createStudioReflectionEnvironment(renderer: THREE.WebGLRenderer): THREE.WebGLRenderTarget {
  const pmremGenerator = new THREE.PMREMGenerator(renderer)
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Could not create environment canvas context.')
  }

  const width = canvas.width
  const height = canvas.height
  const baseGradient = context.createLinearGradient(0, 0, 0, height)
  baseGradient.addColorStop(0, '#172241')
  baseGradient.addColorStop(0.24, '#35538b')
  baseGradient.addColorStop(0.52, '#9aa8e2')
  baseGradient.addColorStop(0.76, '#ebf1ff')
  baseGradient.addColorStop(1, '#c8f3ff')
  context.fillStyle = baseGradient
  context.fillRect(0, 0, width, height)

  addWrappedGlow(context, width, width * 0.18, height * 0.5, width * 0.24, [
    [0, 'rgba(255, 92, 223, 0.62)'],
    [0.42, 'rgba(255, 92, 223, 0.18)'],
    [1, 'rgba(255, 92, 223, 0)'],
  ])

  addWrappedGlow(context, width, width * 0.82, height * 0.52, width * 0.24, [
    [0, 'rgba(255, 207, 103, 0.82)'],
    [0.4, 'rgba(255, 207, 103, 0.24)'],
    [1, 'rgba(255, 207, 103, 0)'],
  ])

  addWrappedGlow(context, width, width * 0.5, height * 0.84, width * 0.34, [
    [0, 'rgba(79, 230, 255, 0.72)'],
    [0.38, 'rgba(79, 230, 255, 0.24)'],
    [1, 'rgba(79, 230, 255, 0)'],
  ])

  addWrappedGlow(context, width, width * 0.5, height * 0.2, width * 0.26, [
    [0, 'rgba(255, 255, 255, 0.82)'],
    [0.48, 'rgba(255, 255, 255, 0.18)'],
    [1, 'rgba(255, 255, 255, 0)'],
  ])

  addWrappedGlow(context, width, width * 0.58, height * 0.58, width * 0.18, [
    [0, 'rgba(255, 255, 255, 0.34)'],
    [0.55, 'rgba(255, 255, 255, 0.08)'],
    [1, 'rgba(255, 255, 255, 0)'],
  ])

  const environmentTexture = new THREE.CanvasTexture(canvas)
  environmentTexture.colorSpace = THREE.SRGBColorSpace
  environmentTexture.mapping = THREE.EquirectangularReflectionMapping

  const environmentTarget = pmremGenerator.fromEquirectangular(environmentTexture)
  environmentTexture.dispose()
  pmremGenerator.dispose()
  return environmentTarget
}

const canvas = requireElement<HTMLCanvasElement>('.viewport')
const uiPanel = requireElement<HTMLDivElement>('#ui-panel')
const uiHandleTop = requireElement<HTMLDivElement>('#ui-handle')
const collapseToggle = requireElement<HTMLButtonElement>('#collapseToggle')
const exportObjButton = requireElement<HTMLButtonElement>('#exportObjButton')
const exportGlbButton = requireElement<HTMLButtonElement>('#exportGlbButton')
const exportScreenshotButton = requireElement<HTMLButtonElement>('#exportScreenshotButton')
const wireToggle = requireElement<HTMLInputElement>('#wireToggle')
const reflectionToggle = requireElement<HTMLInputElement>('#reflectionToggle')
const boxGuideToggle = requireElement<HTMLInputElement>('#boxGuideToggle')

const sliderBindings: SliderBinding[] = [
  {
    key: 't0',
    fallback: DEFAULT_SETTINGS.t0,
    slider: requireElement<HTMLInputElement>('#t0Slider'),
    valueInput: requireElement<HTMLInputElement>('#t0-value'),
  },
  {
    key: 't1',
    fallback: DEFAULT_SETTINGS.t1,
    slider: requireElement<HTMLInputElement>('#t1Slider'),
    valueInput: requireElement<HTMLInputElement>('#t1-value'),
  },
  {
    key: 't2',
    fallback: DEFAULT_SETTINGS.t2,
    slider: requireElement<HTMLInputElement>('#t2Slider'),
    valueInput: requireElement<HTMLInputElement>('#t2-value'),
  },
  {
    key: 't3',
    fallback: DEFAULT_SETTINGS.t3,
    slider: requireElement<HTMLInputElement>('#t3Slider'),
    valueInput: requireElement<HTMLInputElement>('#t3-value'),
  },
]

const arraySliderBindings: ArraySliderBinding[] = [
  {
    key: 'lengthCount',
    fallback: DEFAULT_ARRAY_SETTINGS.lengthCount,
    min: 1,
    max: MAX_ARRAY_COUNT,
    slider: requireElement<HTMLInputElement>('#lengthCountSlider'),
    valueInput: requireElement<HTMLInputElement>('#length-count-value'),
  },
  {
    key: 'widthCount',
    fallback: DEFAULT_ARRAY_SETTINGS.widthCount,
    min: 1,
    max: MAX_ARRAY_COUNT,
    slider: requireElement<HTMLInputElement>('#widthCountSlider'),
    valueInput: requireElement<HTMLInputElement>('#width-count-value'),
  },
  {
    key: 'heightCount',
    fallback: DEFAULT_ARRAY_SETTINGS.heightCount,
    min: 1,
    max: MAX_ARRAY_COUNT,
    slider: requireElement<HTMLInputElement>('#heightCountSlider'),
    valueInput: requireElement<HTMLInputElement>('#height-count-value'),
  },
  {
    key: 'subdivisions',
    fallback: DEFAULT_ARRAY_SETTINGS.subdivisions,
    min: 0,
    max: MAX_SUBDIVISIONS,
    slider: requireElement<HTMLInputElement>('#subdivisionsSlider'),
    valueInput: requireElement<HTMLInputElement>('#subdivisions-value'),
  },
]

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance',
  preserveDrawingBuffer: true,
})
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.18
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)
const reflectionEnvironment = createStudioReflectionEnvironment(renderer)
scene.environment = reflectionEnvironment.texture

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200)
camera.position.set(6.4, 4.8, 6.4)

const groundGrid = new InfiniteFadingGrid({
  width: 200,
  height: 200,
  sectionSize: 5,
  sectionThickness: 1.02,
  cellSize: 1,
  cellThickness: 0.46,
  cellColor: '#656b71',
  sectionColor: '#52585f',
  fadeDistance: 140,
  fadeStrength: 1.35,
  infiniteGrid: true,
  followCamera: true,
  y: -BATWING_BOX_DIMENSIONS.height / 2 - 0.002,
  opacity: 0.9,
})
scene.add(groundGrid.mesh)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 0, 0)
controls.minDistance = 3
controls.maxDistance = Number.POSITIVE_INFINITY
controls.maxPolarAngle = Math.PI - 0.01
controls.mouseButtons.LEFT = -1 as THREE.MOUSE
controls.mouseButtons.MIDDLE = THREE.MOUSE.PAN
controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE

const ambientLight = new THREE.HemisphereLight(0xf9fbff, 0x8b96a4, 1.2)
scene.add(ambientLight)

const keyLight = new THREE.DirectionalLight(0xffffff, 1.5)
keyLight.position.set(6, 11, 4)
keyLight.castShadow = true
keyLight.shadow.mapSize.set(2048, 2048)
keyLight.shadow.bias = -0.00015
keyLight.shadow.normalBias = 0.045
keyLight.shadow.camera.near = 0.5
keyLight.shadow.camera.far = 40
keyLight.shadow.camera.left = -12
keyLight.shadow.camera.right = 12
keyLight.shadow.camera.top = 12
keyLight.shadow.camera.bottom = -12
scene.add(keyLight)

const fillLight = new THREE.DirectionalLight(0xd7ebff, 0.55)
fillLight.position.set(-9, 6, -8)
scene.add(fillLight)

const magentaAccentLight = new THREE.PointLight(
  0xff4cc8,
  REFLECTION_ACCENT_INTENSITIES.magenta,
  30,
  2,
)
magentaAccentLight.position.set(-7.5, 4.5, 4.8)
scene.add(magentaAccentLight)

const cyanAccentLight = new THREE.PointLight(0x4fe6ff, REFLECTION_ACCENT_INTENSITIES.cyan, 28, 2)
cyanAccentLight.position.set(6.5, 2.4, 7.5)
scene.add(cyanAccentLight)

const amberAccentLight = new THREE.PointLight(
  0xffc857,
  REFLECTION_ACCENT_INTENSITIES.amber,
  28,
  2,
)
amberAccentLight.position.set(7.8, 5.2, -4.8)
scene.add(amberAccentLight)

const eggIridescenceState: EggIridescenceState = {
  strength: FOIL_MATERIAL_STYLE.eggIridescence,
  frequency: FOIL_MATERIAL_STYLE.eggIridescenceFrequency,
  uniforms: null,
}

const batwingMaterial = new THREE.MeshPhysicalMaterial({
  color: FOIL_MATERIAL_STYLE.color,
  metalness: FOIL_MATERIAL_STYLE.metalness,
  roughness: FOIL_MATERIAL_STYLE.roughness,
  clearcoat: FOIL_MATERIAL_STYLE.clearcoat,
  clearcoatRoughness: FOIL_MATERIAL_STYLE.clearcoatRoughness,
  envMapIntensity: FOIL_MATERIAL_STYLE.envMapIntensity,
  iridescence: FOIL_MATERIAL_STYLE.iridescence,
  iridescenceIOR: FOIL_MATERIAL_STYLE.iridescenceIOR,
  iridescenceThicknessRange: FOIL_MATERIAL_STYLE.iridescenceThicknessRange,
  reflectivity: FOIL_MATERIAL_STYLE.reflectivity,
  specularIntensity: FOIL_MATERIAL_STYLE.specularIntensity,
  sheen: FOIL_MATERIAL_STYLE.sheen,
  sheenRoughness: FOIL_MATERIAL_STYLE.sheenRoughness,
  sheenColor: new THREE.Color(FOIL_MATERIAL_STYLE.sheenColor),
  side: THREE.DoubleSide,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1,
})
installEggIridescenceShader(batwingMaterial, eggIridescenceState)

const initialGeometrySet = buildBatwingGeometrySet(DEFAULT_SETTINGS, DEFAULT_ARRAY_SETTINGS)
const batwingMesh = new THREE.Mesh(initialGeometrySet.meshGeometry, batwingMaterial)
batwingMesh.castShadow = true
batwingMesh.receiveShadow = true
batwingMesh.frustumCulled = false
scene.add(batwingMesh)

const wireOverlay = new THREE.LineSegments(
  initialGeometrySet.wireGeometry,
  new THREE.LineBasicMaterial({
    color: 0x37506c,
    transparent: true,
    opacity: 0.46,
    depthWrite: false,
    toneMapped: false,
  }),
)
wireOverlay.visible = wireToggle.checked
wireOverlay.frustumCulled = false
wireOverlay.renderOrder = 3
scene.add(wireOverlay)

const boxGuide = new THREE.LineSegments(
  buildArrayBoxGuideGeometry(DEFAULT_ARRAY_SETTINGS),
  new THREE.LineBasicMaterial({
    color: 0xffd47a,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    toneMapped: false,
  }),
)
boxGuide.visible = boxGuideToggle.checked
boxGuide.renderOrder = 2
scene.add(boxGuide)

const exportCounters = {
  obj: 0,
  glb: 0,
  png: 0,
}

const panelDragOffset = { x: 0, y: 0 }
let panelDragging = false
let animationFrameId = 0
let pendingControlHistoryState: BatwingAppState | null = null
let isApplyingHistoryState = false
const undoHistory: BatwingAppState[] = []
const redoHistory: BatwingAppState[] = []

app.addEventListener(
  'contextmenu',
  (event) => {
    event.preventDefault()
  },
  { capture: true },
)

function readSliderNumber(input: HTMLInputElement, fallback: number): number {
  const value = Number.parseFloat(input.value)
  return Number.isFinite(value) ? value : fallback
}

function readArraySliderNumber(binding: ArraySliderBinding): number {
  const value = Math.round(readSliderNumber(binding.slider, binding.fallback))
  return clampNumber(value, binding.min, binding.max)
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function getSliderStep(slider: HTMLInputElement): number | null {
  if (slider.step === 'any') {
    return null
  }

  const step = Number.parseFloat(slider.step)
  return Number.isFinite(step) && step > 0 ? step : null
}

function getDecimalPlaces(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  const valueText = value.toString().toLowerCase()
  if (valueText.includes('e-')) {
    const [, exponentText] = valueText.split('e-')
    const exponent = Number.parseInt(exponentText ?? '0', 10)
    const decimalSection = valueText.split('.')[1]?.split('e')[0] ?? ''
    return decimalSection.length + exponent
  }

  return valueText.split('.')[1]?.length ?? 0
}

function snapValueToSlider(value: number, slider: HTMLInputElement): number {
  const min = Number.parseFloat(slider.min)
  const max = Number.parseFloat(slider.max)
  let nextValue = value

  if (Number.isFinite(min) && Number.isFinite(max)) {
    nextValue = clampNumber(nextValue, min, max)
  }

  const step = getSliderStep(slider)
  if (step === null) {
    return nextValue
  }

  const base = Number.isFinite(min) ? min : 0
  const snapped = Math.round((nextValue - base) / step) * step + base
  const decimals = getDecimalPlaces(step)
  return Number.parseFloat(snapped.toFixed(decimals))
}

function formatSliderValue(value: number): string {
  return value.toFixed(2)
}

function updateRangeProgress(input: HTMLInputElement): void {
  const min = Number.parseFloat(input.min)
  const max = Number.parseFloat(input.max)
  const value = Number.parseFloat(input.value)
  const progress =
    Number.isFinite(min) && Number.isFinite(max) && Number.isFinite(value) && max !== min
      ? ((value - min) / (max - min)) * 100
      : 0
  input.style.setProperty('--range-progress', `${clampNumber(progress, 0, 100)}%`)
}

function getCurrentSettings(): BatwingSettings {
  return sliderBindings.reduce<BatwingSettings>(
    (settings, binding) => {
      settings[binding.key] = readSliderNumber(binding.slider, binding.fallback)
      return settings
    },
    { ...DEFAULT_SETTINGS },
  )
}

function getCurrentArraySettings(): BatwingArraySettings {
  return arraySliderBindings.reduce<BatwingArraySettings>(
    (settings, binding) => {
      settings[binding.key] = readArraySliderNumber(binding)
      return settings
    },
    { ...DEFAULT_ARRAY_SETTINGS },
  )
}

function cloneSettings(settings: BatwingSettings): BatwingSettings {
  return {
    t0: settings.t0,
    t1: settings.t1,
    t2: settings.t2,
    t3: settings.t3,
  }
}

function cloneArraySettings(settings: BatwingArraySettings): BatwingArraySettings {
  return {
    lengthCount: settings.lengthCount,
    widthCount: settings.widthCount,
    heightCount: settings.heightCount,
    subdivisions: settings.subdivisions,
  }
}

function cloneAppState(state: BatwingAppState): BatwingAppState {
  return {
    settings: cloneSettings(state.settings),
    arraySettings: cloneArraySettings(state.arraySettings),
    showWireframe: state.showWireframe,
    reflectionsEnabled: state.reflectionsEnabled,
    showBoxGuide: state.showBoxGuide,
  }
}

function captureAppState(): BatwingAppState {
  return {
    settings: getCurrentSettings(),
    arraySettings: getCurrentArraySettings(),
    showWireframe: wireToggle.checked,
    reflectionsEnabled: reflectionToggle.checked,
    showBoxGuide: boxGuideToggle.checked,
  }
}

function appStatesEqual(a: BatwingAppState, b: BatwingAppState): boolean {
  return (
    a.settings.t0 === b.settings.t0 &&
    a.settings.t1 === b.settings.t1 &&
    a.settings.t2 === b.settings.t2 &&
    a.settings.t3 === b.settings.t3 &&
    a.arraySettings.lengthCount === b.arraySettings.lengthCount &&
    a.arraySettings.widthCount === b.arraySettings.widthCount &&
    a.arraySettings.heightCount === b.arraySettings.heightCount &&
    a.arraySettings.subdivisions === b.arraySettings.subdivisions &&
    a.showWireframe === b.showWireframe &&
    a.reflectionsEnabled === b.reflectionsEnabled &&
    a.showBoxGuide === b.showBoxGuide
  )
}

function pushUndoHistoryState(state: BatwingAppState): void {
  undoHistory.push(cloneAppState(state))
  if (undoHistory.length > MAX_HISTORY_STATES) {
    undoHistory.shift()
  }
}

function commitHistoryCheckpoint(previousState: BatwingAppState): void {
  if (isApplyingHistoryState) {
    return
  }

  const currentState = captureAppState()
  if (appStatesEqual(previousState, currentState)) {
    return
  }

  pushUndoHistoryState(previousState)
  redoHistory.length = 0
}

function beginControlHistoryEdit(): void {
  if (isApplyingHistoryState || pendingControlHistoryState) {
    return
  }

  pendingControlHistoryState = captureAppState()
}

function finishControlHistoryEdit(): void {
  if (!pendingControlHistoryState) {
    return
  }

  commitHistoryCheckpoint(pendingControlHistoryState)
  pendingControlHistoryState = null
}

function clearControlHistoryEdit(): void {
  pendingControlHistoryState = null
}

function applyAppState(state: BatwingAppState): void {
  isApplyingHistoryState = true
  applySettings(state.settings)
  applyArraySettings(state.arraySettings)
  wireToggle.checked = state.showWireframe
  wireOverlay.visible = state.showWireframe
  reflectionToggle.checked = state.reflectionsEnabled
  applyMaterialStyle(state.reflectionsEnabled ? FOIL_MATERIAL_STYLE : MATTE_MATERIAL_STYLE)
  boxGuideToggle.checked = state.showBoxGuide
  boxGuide.visible = state.showBoxGuide
  isApplyingHistoryState = false
}

function undoHistoryState(): void {
  finishControlHistoryEdit()
  const previousState = undoHistory.pop()
  if (!previousState) {
    return
  }

  redoHistory.push(captureAppState())
  applyAppState(previousState)
}

function redoHistoryState(): void {
  finishControlHistoryEdit()
  const nextState = redoHistory.pop()
  if (!nextState) {
    return
  }

  pushUndoHistoryState(captureAppState())
  applyAppState(nextState)
}

function applySettings(settings: BatwingSettings): void {
  for (const binding of sliderBindings) {
    const nextValue = snapValueToSlider(settings[binding.key], binding.slider)
    binding.slider.value = `${nextValue}`
    binding.valueInput.value = formatSliderValue(nextValue)
    updateRangeProgress(binding.slider)
  }

  rebuildBatwing()
}

function applyArraySettings(settings: BatwingArraySettings): void {
  for (const binding of arraySliderBindings) {
    const nextValue = Math.round(snapValueToSlider(settings[binding.key], binding.slider))
    binding.slider.value = `${nextValue}`
    binding.valueInput.value = `${nextValue}`
    updateRangeProgress(binding.slider)
  }

  rebuildBatwing()
}

function commitValueInput(binding: SliderBinding): void {
  const parsedValue = Number.parseFloat(binding.valueInput.value)
  const nextValue = snapValueToSlider(
    Number.isFinite(parsedValue) ? parsedValue : binding.fallback,
    binding.slider,
  )
  binding.slider.value = `${nextValue}`
  binding.valueInput.value = formatSliderValue(nextValue)
  updateRangeProgress(binding.slider)
  rebuildBatwing()
}

function commitArrayValueInput(binding: ArraySliderBinding): void {
  const parsedValue = Number.parseFloat(binding.valueInput.value)
  const nextValue = Math.round(
    snapValueToSlider(Number.isFinite(parsedValue) ? parsedValue : binding.fallback, binding.slider),
  )
  binding.slider.value = `${nextValue}`
  binding.valueInput.value = `${nextValue}`
  updateRangeProgress(binding.slider)
  rebuildBatwing()
}

function bindSlider(binding: SliderBinding): void {
  const syncFromSlider = (): void => {
    beginControlHistoryEdit()
    const value = readSliderNumber(binding.slider, binding.fallback)
    binding.valueInput.value = formatSliderValue(value)
    updateRangeProgress(binding.slider)
    rebuildBatwing()
  }

  binding.slider.addEventListener('pointerdown', beginControlHistoryEdit)
  binding.slider.addEventListener('pointerup', finishControlHistoryEdit)
  binding.slider.addEventListener('pointercancel', finishControlHistoryEdit)
  binding.slider.addEventListener('keydown', (event) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
      beginControlHistoryEdit()
    }
  })
  binding.slider.addEventListener('input', syncFromSlider)
  binding.slider.addEventListener('change', finishControlHistoryEdit)
  binding.valueInput.addEventListener('focus', beginControlHistoryEdit)
  binding.valueInput.addEventListener('change', () => {
    commitValueInput(binding)
    finishControlHistoryEdit()
  })
  binding.valueInput.addEventListener('blur', () => {
    commitValueInput(binding)
    finishControlHistoryEdit()
  })
  binding.valueInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      commitValueInput(binding)
      finishControlHistoryEdit()
      binding.valueInput.blur()
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      binding.valueInput.value = formatSliderValue(readSliderNumber(binding.slider, binding.fallback))
      clearControlHistoryEdit()
      binding.valueInput.blur()
    }
  })
}

function bindArraySlider(binding: ArraySliderBinding): void {
  const syncFromSlider = (): void => {
    beginControlHistoryEdit()
    const value = readArraySliderNumber(binding)
    binding.slider.value = `${value}`
    binding.valueInput.value = `${value}`
    updateRangeProgress(binding.slider)
    rebuildBatwing()
  }

  binding.slider.addEventListener('pointerdown', beginControlHistoryEdit)
  binding.slider.addEventListener('pointerup', finishControlHistoryEdit)
  binding.slider.addEventListener('pointercancel', finishControlHistoryEdit)
  binding.slider.addEventListener('keydown', (event) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
      beginControlHistoryEdit()
    }
  })
  binding.slider.addEventListener('input', syncFromSlider)
  binding.slider.addEventListener('change', finishControlHistoryEdit)
  binding.valueInput.addEventListener('focus', beginControlHistoryEdit)
  binding.valueInput.addEventListener('change', () => {
    commitArrayValueInput(binding)
    finishControlHistoryEdit()
  })
  binding.valueInput.addEventListener('blur', () => {
    commitArrayValueInput(binding)
    finishControlHistoryEdit()
  })
  binding.valueInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      commitArrayValueInput(binding)
      finishControlHistoryEdit()
      binding.valueInput.blur()
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      binding.valueInput.value = `${readArraySliderNumber(binding)}`
      clearControlHistoryEdit()
      binding.valueInput.blur()
    }
  })
}

function rebuildBatwing(): void {
  const settings = getCurrentSettings()
  const arraySettings = getCurrentArraySettings()
  const nextGeometrySet = buildBatwingGeometrySet(settings, arraySettings)

  batwingMesh.geometry.dispose()
  batwingMesh.geometry = nextGeometrySet.meshGeometry

  wireOverlay.geometry.dispose()
  wireOverlay.geometry = nextGeometrySet.wireGeometry

  boxGuide.geometry.dispose()
  boxGuide.geometry = buildArrayBoxGuideGeometry(arraySettings)
  updateGeometryDataset()
}

function getArrayInstanceCount(settings: BatwingArraySettings): number {
  return settings.lengthCount * settings.widthCount * settings.heightCount
}

function getWeldKey(x: number, y: number, z: number): string {
  const qx = Math.round(x / WELD_EPSILON)
  const qy = Math.round(y / WELD_EPSILON)
  const qz = Math.round(z / WELD_EPSILON)
  return `${qx},${qy},${qz}`
}

function getArrayOffset(
  lengthIndex: number,
  widthIndex: number,
  heightIndex: number,
  settings: BatwingArraySettings,
): THREE.Vector3 {
  return new THREE.Vector3(
    (widthIndex - (settings.widthCount - 1) / 2) * BATWING_BOX_DIMENSIONS.width,
    heightIndex * BATWING_BOX_DIMENSIONS.height,
    (lengthIndex - (settings.lengthCount - 1) / 2) * BATWING_BOX_DIMENSIONS.depth,
  )
}

function forEachArrayOffset(
  settings: BatwingArraySettings,
  callback: (
    offset: THREE.Vector3,
    instanceIndex: number,
    lengthIndex: number,
    widthIndex: number,
    heightIndex: number,
  ) => void,
): void {
  let instanceIndex = 0

  for (let heightIndex = 0; heightIndex < settings.heightCount; heightIndex += 1) {
    for (let widthIndex = 0; widthIndex < settings.widthCount; widthIndex += 1) {
      for (let lengthIndex = 0; lengthIndex < settings.lengthCount; lengthIndex += 1) {
        callback(
          getArrayOffset(lengthIndex, widthIndex, heightIndex, settings),
          instanceIndex,
          lengthIndex,
          widthIndex,
          heightIndex,
        )
        instanceIndex += 1
      }
    }
  }
}

function buildArrayLineGeometry(baseGeometry: THREE.BufferGeometry, settings: BatwingArraySettings): THREE.BufferGeometry {
  const basePosition = baseGeometry.getAttribute('position') as THREE.BufferAttribute
  const instanceCount = getArrayInstanceCount(settings)
  const positions = new Float32Array(basePosition.count * instanceCount * 3)

  forEachArrayOffset(settings, (offset, instanceIndex) => {
    const instanceOffset = instanceIndex * basePosition.count * 3
    for (let vertexIndex = 0; vertexIndex < basePosition.count; vertexIndex += 1) {
      const targetIndex = instanceOffset + vertexIndex * 3
      positions[targetIndex + 0] = basePosition.getX(vertexIndex) + offset.x
      positions[targetIndex + 1] = basePosition.getY(vertexIndex) + offset.y
      positions[targetIndex + 2] = basePosition.getZ(vertexIndex) + offset.z
    }
  })

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.computeBoundingSphere()
  return geometry
}

function buildBatwingGeometrySet(
  settings: BatwingSettings,
  arraySettings: BatwingArraySettings,
): BatwingGeometrySet {
  const quadMesh = buildSubdividedWeldedArrayQuadMesh(settings, arraySettings)
  return {
    meshGeometry: buildGeometryFromQuadMesh(quadMesh, arraySettings),
    wireGeometry: buildQuadWireGeometry(quadMesh),
  }
}

function buildSubdividedWeldedArrayQuadMesh(
  settings: BatwingSettings,
  arraySettings: BatwingArraySettings,
): QuadMeshData {
  const weldedMesh = buildWeldedArrayQuadMesh(settings, arraySettings)
  const subdividedMesh = weldQuadMeshByPosition(subdivideCatmullClark(weldedMesh, arraySettings.subdivisions))
  return polishQuadMeshContinuity(subdividedMesh, arraySettings.subdivisions)
}

function buildWeldedArrayQuadMesh(
  settings: BatwingSettings,
  arraySettings: BatwingArraySettings,
): QuadMeshData {
  const baseMesh = buildBatwingQuadMeshData(settings)
  const weldedVertices: THREE.Vector3[] = []
  const quadFaces: QuadFace[] = []
  const vertexLookup = new Map<string, number>()
  const sourceToWelded = new Array<number>(baseMesh.vertices.length)
  const translatedPosition = new THREE.Vector3()

  forEachArrayOffset(arraySettings, (offset, _instanceIndex, lengthIndex, widthIndex, heightIndex) => {
    for (let vertexIndex = 0; vertexIndex < baseMesh.vertices.length; vertexIndex += 1) {
      translatedPosition.copy(baseMesh.vertices[vertexIndex]).add(offset)
      const key = getWeldKey(translatedPosition.x, translatedPosition.y, translatedPosition.z)
      let weldedIndex = vertexLookup.get(key)

      if (weldedIndex === undefined) {
        weldedIndex = weldedVertices.length
        vertexLookup.set(key, weldedIndex)
        weldedVertices.push(translatedPosition.clone())
      }

      sourceToWelded[vertexIndex] = weldedIndex
    }

    const flipWinding = shouldFlipArrayCellWinding(lengthIndex, widthIndex, heightIndex)
    for (const [a, b, c, d] of baseMesh.quadFaces) {
      if (flipWinding) {
        quadFaces.push([sourceToWelded[a], sourceToWelded[d], sourceToWelded[c], sourceToWelded[b]])
      } else {
        quadFaces.push([sourceToWelded[a], sourceToWelded[b], sourceToWelded[c], sourceToWelded[d]])
      }
    }
  })

  return {
    vertices: weldedVertices,
    quadFaces,
  }
}

function shouldFlipArrayCellWinding(
  lengthIndex: number,
  widthIndex: number,
  heightIndex: number,
): boolean {
  return (lengthIndex + widthIndex + heightIndex) % 2 === 1
}

function buildGeometryFromQuadMesh(
  quadMesh: QuadMeshData,
  arraySettings: BatwingArraySettings,
): THREE.BufferGeometry {
  validateFiniteVertices(quadMesh.vertices)

  const positions = new Float32Array(quadMesh.vertices.length * 3)
  for (let index = 0; index < quadMesh.vertices.length; index += 1) {
    const position = quadMesh.vertices[index]
    positions[index * 3 + 0] = position.x
    positions[index * 3 + 1] = position.y
    positions[index * 3 + 2] = position.z
  }

  const indices = triangulateQuadFaces(quadMesh.quadFaces)
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  applyContinuousReflectionNormals(geometry, quadMesh, arraySettings.subdivisions)
  geometry.computeBoundingSphere()
  geometry.userData.batwing = {
    welded: true,
    rawVertexCount: getArrayInstanceCount(arraySettings) * 33,
    vertexCount: quadMesh.vertices.length,
    indexCount: indices.length,
    quadCount: quadMesh.quadFaces.length,
    instanceCount: getArrayInstanceCount(arraySettings),
    subdivisions: arraySettings.subdivisions,
  }
  return geometry
}

function weldQuadMeshByPosition(quadMesh: QuadMeshData): QuadMeshData {
  const weldedVertices: THREE.Vector3[] = []
  const vertexLookup = new Map<string, number>()
  const sourceToWelded = new Array<number>(quadMesh.vertices.length)

  for (let vertexIndex = 0; vertexIndex < quadMesh.vertices.length; vertexIndex += 1) {
    const vertex = quadMesh.vertices[vertexIndex]
    const key = getWeldKey(vertex.x, vertex.y, vertex.z)
    let weldedIndex = vertexLookup.get(key)

    if (weldedIndex === undefined) {
      weldedIndex = weldedVertices.length
      vertexLookup.set(key, weldedIndex)
      weldedVertices.push(vertex.clone())
    }

    sourceToWelded[vertexIndex] = weldedIndex
  }

  return {
    vertices: weldedVertices,
    quadFaces: quadMesh.quadFaces.map(([a, b, c, d]) => [
      sourceToWelded[a],
      sourceToWelded[b],
      sourceToWelded[c],
      sourceToWelded[d],
    ]),
  }
}

function applyContinuousReflectionNormals(
  geometry: THREE.BufferGeometry,
  quadMesh: QuadMeshData,
  subdivisions: number,
): void {
  const computedNormals = geometry.getAttribute('normal') as THREE.BufferAttribute | undefined
  const normalSourceVertices = buildReflectionNormalSourceVertices(quadMesh, subdivisions)
  const normals = Array.from({ length: quadMesh.vertices.length }, (_value, index) => {
    if (!computedNormals) {
      return new THREE.Vector3()
    }

    return new THREE.Vector3(
      computedNormals.getX(index),
      computedNormals.getY(index),
      computedNormals.getZ(index),
    )
  })
  const quadNormalSums = Array.from({ length: quadMesh.vertices.length }, () => new THREE.Vector3())

  for (const quadFace of quadMesh.quadFaces) {
    const quadNormal = computeQuadNormal(normalSourceVertices, quadFace)
    if (quadNormal.lengthSq() <= 1e-12) {
      continue
    }

    for (const vertexIndex of quadFace) {
      quadNormalSums[vertexIndex].add(quadNormal)
    }
  }

  for (let index = 0; index < normals.length; index += 1) {
    if (quadNormalSums[index].lengthSq() > 1e-12) {
      normals[index].copy(quadNormalSums[index]).normalize()
    } else if (normals[index].lengthSq() > 1e-12) {
      normals[index].normalize()
    } else {
      normals[index].set(0, 1, 0)
    }
  }

  averageNormalsByPosition(normals, quadMesh.vertices)

  if (subdivisions > 0) {
    relaxNormalsAcrossQuadEdges(normals, quadMesh.quadFaces, 4 + subdivisions * 2, 0.62)
  }

  const normalValues = new Float32Array(normals.length * 3)
  for (let index = 0; index < normals.length; index += 1) {
    normalValues[index * 3 + 0] = normals[index].x
    normalValues[index * 3 + 1] = normals[index].y
    normalValues[index * 3 + 2] = normals[index].z
  }

  geometry.setAttribute('normal', new THREE.BufferAttribute(normalValues, 3))
}

function polishQuadMeshContinuity(quadMesh: QuadMeshData, subdivisions: number): QuadMeshData {
  if (subdivisions <= 0) {
    return quadMesh
  }

  return {
    vertices: relaxQuadMeshVertices(quadMesh.vertices, quadMesh.quadFaces, 1 + subdivisions, 0.09, true),
    quadFaces: quadMesh.quadFaces,
  }
}

function buildReflectionNormalSourceVertices(
  quadMesh: QuadMeshData,
  subdivisions: number,
): THREE.Vector3[] {
  if (subdivisions <= 0) {
    return quadMesh.vertices
  }

  return relaxQuadMeshVertices(quadMesh.vertices, quadMesh.quadFaces, 5 + subdivisions * 3, 0.22, false)
}

function computeQuadNormal(vertices: readonly THREE.Vector3[], quadFace: QuadFace): THREE.Vector3 {
  const normal = new THREE.Vector3()

  for (let index = 0; index < quadFace.length; index += 1) {
    const current = vertices[quadFace[index]]
    const next = vertices[quadFace[(index + 1) % quadFace.length]]
    normal.x += (current.y - next.y) * (current.z + next.z)
    normal.y += (current.z - next.z) * (current.x + next.x)
    normal.z += (current.x - next.x) * (current.y + next.y)
  }

  if (normal.lengthSq() > 1e-12) {
    return normal.normalize()
  }

  const [a, b, c] = quadFace
  return new THREE.Vector3()
    .subVectors(vertices[b], vertices[a])
    .cross(new THREE.Vector3().subVectors(vertices[c], vertices[a]))
    .normalize()
}

function averageNormalsByPosition(normals: THREE.Vector3[], vertices: readonly THREE.Vector3[]): void {
  const normalSums = new Map<string, THREE.Vector3>()

  for (let index = 0; index < vertices.length; index += 1) {
    const vertex = vertices[index]
    const key = getWeldKey(vertex.x, vertex.y, vertex.z)
    const normalSum = normalSums.get(key)
    if (normalSum) {
      normalSum.add(normals[index])
    } else {
      normalSums.set(key, normals[index].clone())
    }
  }

  for (let index = 0; index < vertices.length; index += 1) {
    const vertex = vertices[index]
    const normalSum = normalSums.get(getWeldKey(vertex.x, vertex.y, vertex.z))
    if (normalSum && normalSum.lengthSq() > 1e-12) {
      normals[index].copy(normalSum).normalize()
    }
  }
}

function relaxNormalsAcrossQuadEdges(
  normals: THREE.Vector3[],
  quadFaces: readonly QuadFace[],
  iterations: number,
  amount: number,
): void {
  const neighbors = buildQuadVertexNeighbors(normals.length, quadFaces)

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const relaxedNormals = normals.map((normal, vertexIndex) => {
      const neighborIndices = neighbors[vertexIndex]
      if (neighborIndices.size === 0) {
        return normal.clone()
      }

      const neighborAverage = new THREE.Vector3()
      for (const neighborIndex of neighborIndices) {
        neighborAverage.add(normals[neighborIndex])
      }
      neighborAverage.multiplyScalar(1 / neighborIndices.size)

      return normal.clone().lerp(neighborAverage.normalize(), amount).normalize()
    })

    for (let index = 0; index < normals.length; index += 1) {
      normals[index].copy(relaxedNormals[index])
    }
  }
}

function relaxQuadMeshVertices(
  vertices: readonly THREE.Vector3[],
  quadFaces: readonly QuadFace[],
  iterations: number,
  amount: number,
  preserveBoundary: boolean,
): THREE.Vector3[] {
  const neighbors = buildQuadVertexNeighbors(vertices.length, quadFaces)
  const boundaryVertices = preserveBoundary ? buildBoundaryVertexSet(quadFaces) : new Set<number>()
  let relaxedVertices = vertices.map((vertex) => vertex.clone())

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const nextVertices = relaxedVertices.map((vertex, vertexIndex) => {
      const neighborIndices = neighbors[vertexIndex]
      if (neighborIndices.size === 0 || boundaryVertices.has(vertexIndex)) {
        return vertex.clone()
      }

      const neighborAverage = new THREE.Vector3()
      for (const neighborIndex of neighborIndices) {
        neighborAverage.add(relaxedVertices[neighborIndex])
      }
      neighborAverage.multiplyScalar(1 / neighborIndices.size)

      return vertex.clone().lerp(neighborAverage, amount)
    })

    relaxedVertices = nextVertices
  }

  return relaxedVertices
}

function buildBoundaryVertexSet(quadFaces: readonly QuadFace[]): Set<number> {
  const edgeUseCounts = new Map<string, { a: number; b: number; count: number }>()

  const addEdge = (a: number, b: number): void => {
    const min = Math.min(a, b)
    const max = Math.max(a, b)
    const key = `${min},${max}`
    const existingEdge = edgeUseCounts.get(key)
    if (existingEdge) {
      existingEdge.count += 1
      return
    }

    edgeUseCounts.set(key, { a, b, count: 1 })
  }

  for (const [a, b, c, d] of quadFaces) {
    addEdge(a, b)
    addEdge(b, c)
    addEdge(c, d)
    addEdge(d, a)
  }

  const boundaryVertices = new Set<number>()
  for (const edge of edgeUseCounts.values()) {
    if (edge.count === 1) {
      boundaryVertices.add(edge.a)
      boundaryVertices.add(edge.b)
    }
  }

  return boundaryVertices
}

function buildQuadVertexNeighbors(vertexCount: number, quadFaces: readonly QuadFace[]): Set<number>[] {
  const neighbors = Array.from({ length: vertexCount }, () => new Set<number>())

  const addNeighborPair = (a: number, b: number): void => {
    if (a === b) {
      return
    }

    neighbors[a].add(b)
    neighbors[b].add(a)
  }

  for (const [a, b, c, d] of quadFaces) {
    addNeighborPair(a, b)
    addNeighborPair(b, c)
    addNeighborPair(c, d)
    addNeighborPair(d, a)
  }

  return neighbors
}

function buildQuadWireGeometry(quadMesh: QuadMeshData): THREE.BufferGeometry {
  const edgePairs = buildUniqueQuadEdges(quadMesh.quadFaces)
  const positions = new Float32Array(edgePairs.length * 2 * 3)

  for (let edgeIndex = 0; edgeIndex < edgePairs.length; edgeIndex += 1) {
    const [a, b] = edgePairs[edgeIndex]
    const start = quadMesh.vertices[a]
    const end = quadMesh.vertices[b]
    const offset = edgeIndex * 6
    positions[offset + 0] = start.x
    positions[offset + 1] = start.y
    positions[offset + 2] = start.z
    positions[offset + 3] = end.x
    positions[offset + 4] = end.y
    positions[offset + 5] = end.z
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.computeBoundingSphere()
  return geometry
}

function triangulateQuadFaces(quadFaces: readonly QuadFace[]): number[] {
  const indices: number[] = []
  for (const [a, b, c, d] of quadFaces) {
    indices.push(a, b, c, a, c, d)
  }

  return indices
}

function buildUniqueQuadEdges(quadFaces: readonly QuadFace[]): [number, number][] {
  const edges: [number, number][] = []
  const seen = new Set<string>()

  const addEdge = (a: number, b: number): void => {
    const min = Math.min(a, b)
    const max = Math.max(a, b)
    const key = `${min},${max}`
    if (seen.has(key)) {
      return
    }

    seen.add(key)
    edges.push([a, b])
  }

  for (const [a, b, c, d] of quadFaces) {
    addEdge(a, b)
    addEdge(b, c)
    addEdge(c, d)
    addEdge(d, a)
  }

  return edges
}

function validateFiniteVertices(vertices: readonly THREE.Vector3[]): void {
  for (let index = 0; index < vertices.length; index += 1) {
    const vertex = vertices[index]
    if (!Number.isFinite(vertex.x) || !Number.isFinite(vertex.y) || !Number.isFinite(vertex.z)) {
      throw new Error(`Batwing geometry produced a non-finite vertex at index ${index}.`)
    }
  }
}

function buildArrayBoxGuideGeometry(arraySettings: BatwingArraySettings): THREE.BufferGeometry {
  const baseGeometry = createBatwingBoxGuideGeometry()
  const geometry = buildArrayLineGeometry(baseGeometry, arraySettings)
  baseGeometry.dispose()
  return geometry
}

function applyMaterialStyle(style: BatwingMaterialStyle): void {
  batwingMesh.material.color.setHex(style.color)
  batwingMesh.material.metalness = style.metalness
  batwingMesh.material.roughness = style.roughness
  batwingMesh.material.clearcoat = style.clearcoat
  batwingMesh.material.clearcoatRoughness = style.clearcoatRoughness
  batwingMesh.material.envMapIntensity = style.envMapIntensity
  batwingMesh.material.iridescence = style.iridescence
  batwingMesh.material.iridescenceIOR = style.iridescenceIOR
  batwingMesh.material.iridescenceThicknessRange = [...style.iridescenceThicknessRange]
  batwingMesh.material.reflectivity = style.reflectivity
  batwingMesh.material.specularIntensity = style.specularIntensity
  batwingMesh.material.sheen = style.sheen
  batwingMesh.material.sheenRoughness = style.sheenRoughness
  batwingMesh.material.sheenColor.setHex(style.sheenColor)
  eggIridescenceState.strength = style.eggIridescence
  eggIridescenceState.frequency = style.eggIridescenceFrequency
  if (eggIridescenceState.uniforms) {
    eggIridescenceState.uniforms.uEggIridescence.value = style.eggIridescence
    eggIridescenceState.uniforms.uEggIridescenceFrequency.value = style.eggIridescenceFrequency
  }
  batwingMesh.material.needsUpdate = true
}

function installEggIridescenceShader(
  material: THREE.MeshPhysicalMaterial,
  state: EggIridescenceState,
): void {
  material.customProgramCacheKey = () => 'batwing-gyroid-foil-iridescence-v1'
  material.onBeforeCompile = (shader) => {
    const uniforms = {
      uEggIridescence: { value: state.strength },
      uEggIridescenceFrequency: { value: state.frequency },
    }
    state.uniforms = uniforms
    shader.uniforms.uEggIridescence = uniforms.uEggIridescence
    shader.uniforms.uEggIridescenceFrequency = uniforms.uEggIridescenceFrequency

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
varying vec3 vEggIriWorldPosition;
varying vec3 vEggIriWorldNormal;`,
      )
      .replace(
        '#include <worldpos_vertex>',
        `#include <worldpos_vertex>
vEggIriWorldPosition = worldPosition.xyz;
vEggIriWorldNormal = normalize( mat3( modelMatrix ) * normal );`,
      )

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
uniform float uEggIridescence;
uniform float uEggIridescenceFrequency;
varying vec3 vEggIriWorldPosition;
varying vec3 vEggIriWorldNormal;

float eggSaturate01(float value) {
  return clamp(value, 0.0, 1.0);
}

float eggHash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 19.19);
  return fract((p.x + p.y) * p.z);
}

float eggSmoothNoise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);

  float n000 = eggHash13(i + vec3(0.0, 0.0, 0.0));
  float n100 = eggHash13(i + vec3(1.0, 0.0, 0.0));
  float n010 = eggHash13(i + vec3(0.0, 1.0, 0.0));
  float n110 = eggHash13(i + vec3(1.0, 1.0, 0.0));
  float n001 = eggHash13(i + vec3(0.0, 0.0, 1.0));
  float n101 = eggHash13(i + vec3(1.0, 0.0, 1.0));
  float n011 = eggHash13(i + vec3(0.0, 1.0, 1.0));
  float n111 = eggHash13(i + vec3(1.0, 1.0, 1.0));

  float nx00 = mix(n000, n100, u.x);
  float nx10 = mix(n010, n110, u.x);
  float nx01 = mix(n001, n101, u.x);
  float nx11 = mix(n011, n111, u.x);
  float nxy0 = mix(nx00, nx10, u.y);
  float nxy1 = mix(nx01, nx11, u.y);
  return mix(nxy0, nxy1, u.z);
}

vec3 eggBismuthPalette(float t) {
  t = fract(t);
  vec3 c0 = vec3(1.00, 0.84, 0.20);
  vec3 c1 = vec3(1.00, 0.33, 0.77);
  vec3 c2 = vec3(0.18, 0.93, 1.00);
  vec3 c3 = vec3(0.30, 1.00, 0.46);
  if (t < 0.25) {
    return mix(c0, c1, t * 4.0);
  }
  if (t < 0.50) {
    return mix(c1, c2, (t - 0.25) * 4.0);
  }
  if (t < 0.75) {
    return mix(c2, c3, (t - 0.50) * 4.0);
  }
  return mix(c3, c0, (t - 0.75) * 4.0);
}

vec3 applyEggIridescence(vec3 baseColor) {
  float iriStrength = eggSaturate01(uEggIridescence);
  if (iriStrength <= 0.0001) {
    return baseColor;
  }

  vec3 n = normalize(vEggIriWorldNormal);
  vec3 viewDir = normalize(cameraPosition - vEggIriWorldPosition);
  float ndv = eggSaturate01(dot(n, viewDir));
  float jitter = eggSmoothNoise3(vEggIriWorldPosition * 1.5 + vec3(31.4));
  float broadNoise = eggSmoothNoise3(vEggIriWorldPosition * 0.48 + vec3(11.7));
  float bandFreq = max(0.2, uEggIridescenceFrequency);
  float facetBand =
    (vEggIriWorldPosition.y * 1.8 + vEggIriWorldPosition.x * 0.42 - vEggIriWorldPosition.z * 0.31) * bandFreq;
  float stepBand = (abs(vEggIriWorldPosition.x) + abs(vEggIriWorldPosition.z)) * 0.92;
  float swirl =
    0.5 +
    0.5 *
      sin(
        dot(vEggIriWorldPosition, vec3(0.73, 0.51, -0.46)) * bandFreq * 1.25 +
        broadNoise * 4.6 +
        6.283
      );
  float thicknessT = fract(facetBand * 0.123 + stepBand * 0.081 + swirl * 0.39 + jitter * 0.27 + 5.7);
  float thicknessNm = mix(120.0, 980.0, thicknessT);

  vec3 wavelengths = vec3(680.0, 540.0, 440.0);
  vec3 phase = (4.0 * 3.14159265 * 1.65 * thicknessNm * max(ndv, 0.08)) / wavelengths;
  vec3 interference = 0.5 + 0.5 * cos(phase + vec3(0.0, 2.094, 4.188));

  float hueSweep =
    fract(
      thicknessT * (0.55 + uEggIridescenceFrequency * 0.65) +
      dot(n, vec3(0.23, 0.11, -0.37)) * 0.18
    );
  vec3 oxidePalette = eggBismuthPalette(hueSweep);
  vec3 oxideColor = mix(interference, oxidePalette, 0.68);

  float fresnel = pow(1.0 - ndv, 2.2);
  float filmAmount = iriStrength * (0.48 + 0.52 * fresnel);
  vec3 branchTint = mix(vec3(1.0), baseColor, 0.58);
  vec3 metallicBase = vec3(0.92, 0.94, 0.98) * mix(vec3(1.0), branchTint, 0.26);
  vec3 oxideTinted = mix(oxideColor, oxideColor * branchTint, 0.62);
  vec3 blendTint = mix(metallicBase, oxideTinted, eggSaturate01(filmAmount * 0.78));
  vec3 overlayTint = mix(vec3(1.0), blendTint, 0.62 * iriStrength);
  vec3 iridescentBase = baseColor * overlayTint;
  iridescentBase += oxideColor * fresnel * iriStrength * 0.22;
  return mix(baseColor, iridescentBase, 0.85 * iriStrength);
}`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
diffuseColor.rgb = applyEggIridescence(diffuseColor.rgb);`,
      )
  }
}

function getPrimaryMaterialColor(material: THREE.Material): THREE.Color {
  const colorCarrier = material as THREE.Material & { color?: THREE.Color }
  return colorCarrier.color?.clone() ?? new THREE.Color(0xf1f5ff)
}

function buildExportMesh(): THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> {
  batwingMesh.updateWorldMatrix(true, false)
  const exportGeometry = batwingMesh.geometry.clone()
  exportGeometry.applyMatrix4(batwingMesh.matrixWorld)
  exportGeometry.computeVertexNormals()
  exportGeometry.computeBoundingSphere()

  const exportMaterial = new THREE.MeshStandardMaterial({
    color: getPrimaryMaterialColor(batwingMesh.material),
    metalness: batwingMesh.material.metalness,
    roughness: batwingMesh.material.roughness,
    side: THREE.DoubleSide,
  })

  const exportMesh = new THREE.Mesh(exportGeometry, exportMaterial)
  exportMesh.name = EXPORT_BASE_NAME
  return exportMesh
}

function disposeExportMesh(mesh: THREE.Mesh<THREE.BufferGeometry, THREE.Material>): void {
  mesh.geometry.dispose()
  mesh.material.dispose()
}

function nextExportName(type: 'obj' | 'glb' | 'png'): string {
  exportCounters[type] += 1
  const serial = String(exportCounters[type]).padStart(3, '0')
  return `${EXPORT_BASE_NAME}_${serial}.${type}`
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function exportObj(): void {
  const exportMesh = buildExportMesh()
  const position = exportMesh.geometry.getAttribute('position')
  const index = exportMesh.geometry.getIndex()
  let output = `# ${EXPORT_BASE_NAME} OBJ Export\n`
  output += `o ${EXPORT_BASE_NAME}\n`

  for (let vertexIndex = 0; vertexIndex < position.count; vertexIndex += 1) {
    output += `v ${position.getX(vertexIndex)} ${position.getY(vertexIndex)} ${position.getZ(vertexIndex)}\n`
  }

  if (index) {
    for (let faceIndex = 0; faceIndex < index.count; faceIndex += 3) {
      const a = index.getX(faceIndex) + 1
      const b = index.getX(faceIndex + 1) + 1
      const c = index.getX(faceIndex + 2) + 1
      output += `f ${a} ${b} ${c}\n`
    }
  }

  downloadBlob(new Blob([output], { type: 'text/plain;charset=utf-8' }), nextExportName('obj'))
  disposeExportMesh(exportMesh)
}

function exportGlb(): void {
  const exportMesh = buildExportMesh()
  const exporter = new GLTFExporter()
  const exportGroup = new THREE.Group()
  exportGroup.add(exportMesh)

  exporter.parse(
    exportGroup,
    (result) => {
      if (result instanceof ArrayBuffer) {
        downloadBlob(new Blob([result], { type: 'model/gltf-binary' }), nextExportName('glb'))
      }
      disposeExportMesh(exportMesh)
    },
    (error) => {
      console.error('GLB export failed.', error)
      disposeExportMesh(exportMesh)
    },
    { binary: true },
  )
}

function exportScreenshot(): void {
  renderer.render(scene, camera)
  canvas.toBlob((blob) => {
    if (!blob) {
      return
    }

    downloadBlob(blob, nextExportName('png'))
  }, 'image/png')
}

function getCurrentGeometryStats(): {
  vertexCount: number
  indexCount: number
  hasNormals: boolean
  finitePositions: boolean
} {
  const position = batwingMesh.geometry.getAttribute('position')
  const normal = batwingMesh.geometry.getAttribute('normal')
  const index = batwingMesh.geometry.getIndex()
  let finitePositions = true

  for (let vertexIndex = 0; vertexIndex < position.count; vertexIndex += 1) {
    if (
      !Number.isFinite(position.getX(vertexIndex)) ||
      !Number.isFinite(position.getY(vertexIndex)) ||
      !Number.isFinite(position.getZ(vertexIndex))
    ) {
      finitePositions = false
      break
    }
  }

  return {
    vertexCount: position.count,
    indexCount: index?.count ?? 0,
    hasNormals: normal !== undefined && normal.count === position.count,
    finitePositions,
  }
}

function updateGeometryDataset(): void {
  const stats = getCurrentGeometryStats()
  canvas.dataset.vertexCount = `${stats.vertexCount}`
  canvas.dataset.indexCount = `${stats.indexCount}`
  canvas.dataset.hasNormals = `${stats.hasNormals}`
  canvas.dataset.finitePositions = `${stats.finitePositions}`
}

function updatePanelSectionControls(): void {
  const headers = app.querySelectorAll<HTMLButtonElement>('.panel-section-header')
  headers.forEach((header) => {
    header.addEventListener('click', () => {
      const section = header.closest<HTMLElement>('.panel-section')
      if (!section) {
        return
      }

      const collapsed = section.classList.toggle('is-collapsed')
      header.setAttribute('aria-expanded', collapsed ? 'false' : 'true')
    })
  })
}

function onResize(): void {
  const width = window.innerWidth
  const height = window.innerHeight
  camera.aspect = width / Math.max(height, 1)
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height, false)
}

function animate(): void {
  controls.update()
  groundGrid.update(camera)
  renderer.render(scene, camera)
  animationFrameId = window.requestAnimationFrame(animate)
}

function cleanup(): void {
  window.cancelAnimationFrame(animationFrameId)
  controls.dispose()
  batwingMesh.geometry.dispose()
  batwingMesh.material.dispose()
  wireOverlay.geometry.dispose()
  wireOverlay.material.dispose()
  boxGuide.geometry.dispose()
  boxGuide.material.dispose()
  reflectionEnvironment.dispose()
  groundGrid.dispose()
  renderer.dispose()
}

for (const binding of sliderBindings) {
  bindSlider(binding)
  updateRangeProgress(binding.slider)
}

for (const binding of arraySliderBindings) {
  bindArraySlider(binding)
  updateRangeProgress(binding.slider)
}

wireToggle.addEventListener('change', () => {
  const previousState = captureAppState()
  previousState.showWireframe = !wireToggle.checked
  wireOverlay.visible = wireToggle.checked
  commitHistoryCheckpoint(previousState)
})

reflectionToggle.addEventListener('change', () => {
  const previousState = captureAppState()
  previousState.reflectionsEnabled = !reflectionToggle.checked
  applyMaterialStyle(reflectionToggle.checked ? FOIL_MATERIAL_STYLE : MATTE_MATERIAL_STYLE)
  commitHistoryCheckpoint(previousState)
})

boxGuideToggle.addEventListener('change', () => {
  const previousState = captureAppState()
  previousState.showBoxGuide = !boxGuideToggle.checked
  boxGuide.visible = boxGuideToggle.checked
  commitHistoryCheckpoint(previousState)
})

exportObjButton.addEventListener('click', exportObj)
exportGlbButton.addEventListener('click', exportGlb)
exportScreenshotButton.addEventListener('click', exportScreenshot)

collapseToggle.addEventListener('pointerdown', (event) => {
  event.stopPropagation()
})

collapseToggle.addEventListener('click', () => {
  const collapsed = uiPanel.classList.toggle('is-collapsed')
  collapseToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true')
})

uiHandleTop.addEventListener('pointerdown', (event) => {
  if ((event.target as Element).closest('#collapseToggle')) {
    return
  }

  const rect = uiPanel.getBoundingClientRect()
  panelDragging = true
  panelDragOffset.x = event.clientX - rect.left
  panelDragOffset.y = event.clientY - rect.top
  uiHandleTop.setPointerCapture(event.pointerId)
  event.preventDefault()
})

uiHandleTop.addEventListener('pointermove', (event) => {
  if (!panelDragging) {
    return
  }

  const rect = uiPanel.getBoundingClientRect()
  const nextLeft = clampNumber(event.clientX - panelDragOffset.x, 8, window.innerWidth - rect.width - 8)
  const nextTop = clampNumber(event.clientY - panelDragOffset.y, 8, window.innerHeight - rect.height - 8)
  uiPanel.style.left = `${nextLeft}px`
  uiPanel.style.top = `${nextTop}px`
})

uiHandleTop.addEventListener('pointerup', (event) => {
  panelDragging = false
  uiHandleTop.releasePointerCapture(event.pointerId)
})

uiHandleTop.addEventListener('pointercancel', (event) => {
  panelDragging = false
  uiHandleTop.releasePointerCapture(event.pointerId)
})

updatePanelSectionControls()
updateGeometryDataset()
onResize()
window.addEventListener('resize', onResize)
window.addEventListener('beforeunload', cleanup)
window.addEventListener('keydown', (event) => {
  if (!event.ctrlKey || event.altKey) {
    return
  }

  const key = event.key.toLowerCase()
  if (key === 'z') {
    event.preventDefault()
    if (event.shiftKey) {
      redoHistoryState()
    } else {
      undoHistoryState()
    }
    return
  }

  if (key === 'y' && !event.shiftKey) {
    event.preventDefault()
    redoHistoryState()
  }
})

window.__batwingDebug = {
  getStats: getCurrentGeometryStats,
  setSettings: applySettings,
}

requestAnimationFrame(() => {
  document.documentElement.classList.add('ui-ready')
})

animate()
