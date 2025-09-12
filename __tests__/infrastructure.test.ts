import { describe, test, expect } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

describe('Infrastructure Tests', () => {
  describe('TypeScript build outputs', () => {
    test('should have all required build outputs', () => {
      const distDir = path.join(process.cwd(), 'dist');
      const expectedFiles = [
        'index.js',
        'index.d.ts',
        'index.js.map',
        'index.d.ts.map',
      ];

      expect(fs.existsSync(distDir)).toBe(true);

      expectedFiles.forEach(file => {
        const filePath = path.join(distDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });

    test('should have correct TypeScript declaration exports', () => {
      const declarationPath = path.join(process.cwd(), 'dist', 'index.d.ts');
      const content = fs.readFileSync(declarationPath, 'utf8');

      expect(content).toContain('interface TitleBoxProps');
      expect(content).toContain('export declare const TitleBox');
      expect(content).toContain('export default TitleBox');
    });

    test('should use ES modules in compiled JavaScript', () => {
      const jsPath = path.join(process.cwd(), 'dist', 'index.js');
      const content = fs.readFileSync(jsPath, 'utf8');

      expect(content).toContain('import');
      expect(content).toContain('export');
    });
  });

  describe('Configuration files', () => {
    test('should have valid TypeScript configuration', () => {
      const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
      expect(fs.existsSync(tsconfigPath)).toBe(true);

      const config = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      expect(config.compilerOptions).toBeDefined();
      expect(config.compilerOptions.module).toBe('ESNext');
      expect(config.compilerOptions.target).toBe('ES2022');
      expect(config.compilerOptions.strict).toBe(true);
    });

    test('should have correct package.json configuration for TypeScript', () => {
      const packagePath = path.join(process.cwd(), 'package.json');
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

      expect(pkg.type).toBe('module');
      expect(pkg.main).toBe('dist/index.js');
      expect(pkg.types).toBe('dist/index.d.ts');
      expect(pkg.devDependencies.typescript).toBeDefined();
    });

    test('should have Jest configuration', () => {
      const jestConfigPath = path.join(process.cwd(), 'jest.config.ts');
      expect(fs.existsSync(jestConfigPath)).toBe(true);
    });
  });
});
