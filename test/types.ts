import toIdentifier, {
  isValidIdentifier,
  toIdentifierLegacy,
  type ToIdentifierOptions,
} from '../src/index.js'

const a: string = toIdentifier('Bad Request')
const b: string = toIdentifier('Bad Request', { style: 'camel' })
const c: boolean = isValidIdentifier(a)
const d: string = toIdentifierLegacy('Bad Request')
const options: ToIdentifierOptions = { style: 'pascal', normalize: true }

void a
void b
void c
void d
void options
