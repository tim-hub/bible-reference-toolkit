import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

export const generateOrdinalNameVariations = (
  startNumber: number,
  names: string[]
): string[] => {
  const variations: string[] = [];
  let numerals: string[];
  if (startNumber === 1) {
    numerals = ['1', 'I', 'First'];
  } else if (startNumber === 2) {
    numerals = ['2', 'II', 'Second'];
  } else if (startNumber === 3) {
    numerals = ['3', 'III', 'Third'];
  }
  names.forEach((name) => {
    numerals.forEach(function (numeral: string) {
      variations.push(numeral + name);
      variations.push(numeral + ' ' + name);
    });
  });
  return variations;
};

const readdirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);

export const readJSONFilesInDirectory = async (directoryPath: string) => {
  try {
    const files: string[] = (await readdirAsync(
      directoryPath
    )) as unknown as string[];

    // Filter the files to only include JSON files
    const jsonFiles = files.filter(
      (file: string) => path.extname(file) === '.json'
    );

    return Promise.all(
      jsonFiles.map(async (jsonFile: string) => {
        const filePath = path.join(directoryPath, jsonFile);
        const data = await readFileAsync(filePath);
        return JSON.parse(data.toString());
      })
    );
  } catch (err) {
    console.error('Error reading JSON files:', err);
    throw err;
  }
};