import { describe, test, expect } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

describe('Infrastructure Tests', () => {
  describe('TypeScript source files', () => {
    test('should have all required source files', () => {
      const srcDir = path.join(process.cwd(), 'src');
      const expectedFiles = ['index.tsx', 'cli.tsx'];

      expect(fs.existsSync(srcDir)).toBe(true);

      expectedFiles.forEach(file => {
        const filePath = path.join(srcDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });

    test('should have correct TypeScript interfaces and exports', () => {
      const indexPath = path.join(process.cwd(), 'src', 'index.tsx');
      const content = fs.readFileSync(indexPath, 'utf8');

      expect(content).toContain('interface TitleBoxProps');
      expect(content).toContain('export const TitleBox');
      expect(content).toContain('export default TitleBox');
    });

    test('should use ES modules syntax in source', () => {
      const indexPath = path.join(process.cwd(), 'src', 'index.tsx');
      const content = fs.readFileSync(indexPath, 'utf8');

      expect(content).toContain('import React from');
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
