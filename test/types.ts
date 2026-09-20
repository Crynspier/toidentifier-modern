import toIdentifier, { toIdentifier as named } from '../src/index.js'

const a: string = toIdentifier('Bad Request')
const b: string = named('Bad Request')
const same: typeof toIdentifier = named

void a
void b
void same
