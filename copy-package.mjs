import { copyFile } from 'fs/promises';
import { resolve } from 'path';

const source = resolve('package.json');
const destination = resolve('build/package.json');

try {
  await copyFile(source, destination);
  console.log('package.json copiado para o diretório build.');
} catch (err) {
  console.error('Erro ao copiar package.json:', err);
}
