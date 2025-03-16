import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

// Define types
type RouteInfo = {
  route: string;
  filePath: string;
  type: 'page' | 'layout' | 'loading' | 'error' | 'not-found' | 'route';
  isDirectory: boolean;
  hasParams?: boolean;
  paramName?: string;
  namespace?: string;
  methods?: string[];
};

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Root directory of the Next.js app
const APP_DIR = path.join(__dirname, '..', 'app');
const API_DIR = path.join(APP_DIR, 'api');

// Files to look for
const ROUTE_FILES = [
  'page.tsx', 'page.js', 
  'layout.tsx', 'layout.js', 
  'loading.tsx', 'loading.js', 
  'error.tsx', 'error.js', 
  'not-found.tsx', 'not-found.js',
  'route.tsx', 'route.js', 'route.ts'
];

// Debug flag - set to true to see more detailed logs
const DEBUG = true;

// Function to check if a path exists
function pathExists(p: string): boolean {
  try {
    fs.accessSync(p);
    return true;
  } catch (e) {
    return false;
  }
}

// Function to get the type of route file
function getRouteType(filename: string): 'page' | 'layout' | 'loading' | 'error' | 'not-found' | 'route' {
  const baseName = path.basename(filename, path.extname(filename));
  return baseName as 'page' | 'layout' | 'loading' | 'error' | 'not-found' | 'route';
}

// Function to recursively list all files
function getAllFiles(dir: string): string[] {
  try {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...getAllFiles(fullPath));
      } else if (ROUTE_FILES.includes(entry.name)) {
        files.push(fullPath);
      }
    }
    
    return files;
  } catch (e) {
    console.error(`Error reading directory ${dir}:`, e);
    return [];
  }
}

// Function to read file content and extract HTTP methods for route handlers
async function extractHttpMethods(filePath: string): Promise<string[]> {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    const methods = [];
    
    // More comprehensive check for HTTP method exports
    const methodRegex = /export\s+(async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/gi;
    let match;
    while ((match = methodRegex.exec(content)) !== null) {
      methods.push(match[2].toUpperCase());
    }
    
    // Check for handler functions that may handle multiple methods
    if (methods.length === 0) {
      // Check for NextJS API route handler patterns
      if (content.includes('export default') || 
          content.includes('export const handler') ||
          content.includes('NextApiHandler') ||
          content.includes('NextApiRequest') ||
          content.includes('NextResponse')) {
        
        // Check for specific method handling inside the code
        const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
        for (const method of httpMethods) {
          const methodPattern = new RegExp(`(req|request)\\.method\\s*===?\\s*['"]${method}['"]`, 'i');
          if (methodPattern.test(content)) {
            methods.push(method.toUpperCase());
          }
        }
        
        // If still no methods found, it's likely a general handler
        if (methods.length === 0) {
          methods.push('GET');
          // API routes often handle POST as well if they're general handlers
          methods.push('POST');
        }
      } else {
        // Fallback to GET if we can't determine
        methods.push('GET');
      }
    }
    
    if (DEBUG) {
      console.log(`      Methods for ${filePath}: ${methods.join(', ')}`);
    }
    
    return [...new Set(methods)]; // Remove duplicates
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return ['GET']; // Default to GET if there's an error
  }
}

// Function to perform a comprehensive scan of all files in the API directory
async function scanApiDirectory(): Promise<RouteInfo[]> {
  console.log('📡 Scanning API routes with detailed directory traversal...');
  
  const apiRoutes: RouteInfo[] = [];
  
  // Check if API directory exists
  if (!pathExists(API_DIR)) {
    console.log('   API directory not found');
    return apiRoutes;
  }
  
  // Use both find command and JavaScript methods to ensure we catch all API routes
  let routeFiles: string[] = [];
  
  // Try using find command first for better performance and reliability
  try {
    const findCommand = `find ${API_DIR} -type f \\( -name "route.js" -o -name "route.tsx" -o -name "route.ts" \\)`;
    console.log(`   Running command: ${findCommand}`);
    
    const result = execSync(findCommand, { encoding: 'utf8' });
    routeFiles = result.trim().split('\n').filter(Boolean);
    
    console.log(`   Found ${routeFiles.length} API route files with find command`);
  } catch (error) {
    console.error('   Error using find command:', error);
    console.log('   Falling back to JavaScript-based file scanning...');
  }
  
  // Fallback or supplement with JavaScript-based file scanning
  if (routeFiles.length === 0) {
    routeFiles = getAllFiles(API_DIR);
    console.log(`   Found ${routeFiles.length} API route files with JavaScript scanning`);
  }
  
  // Process each file to extract route information
  for (const filePath of routeFiles) {
    const relativeFilePath = path.relative(APP_DIR, filePath);
    
    if (DEBUG) {
      console.log(`   Processing: ${relativeFilePath}`);
    }
    
    // Skip if not a route file
    if (!path.basename(filePath).startsWith('route.')) {
      continue;
    }
    
    const type = getRouteType(path.basename(filePath));
    
    // Build the API route path from the file path
    const relativeDirPath = path.dirname(relativeFilePath);
    let routePath = '/' + relativeDirPath.replace(/\\/g, '/');
    
    // Handle dynamic segments - convert [param] to :param
    routePath = routePath.replace(/\[([^\]]+)\]/g, ':$1');
    
    // Extract HTTP methods
    let methods: string[] = ['GET']; // Default
    if (type === 'route') {
      methods = await extractHttpMethods(filePath);
    }
    
    apiRoutes.push({
      route: routePath,
      filePath: relativeFilePath,
      type,
      isDirectory: false,
      namespace: 'api',
      methods,
    });
  }
  
  console.log(`   Found ${apiRoutes.length} API routes total`);
  return apiRoutes;
}

// Function to scan directories recursively and find route files
async function scanRoutes(dir: string, baseRoute: string = ''): Promise<RouteInfo[]> {
  if (!pathExists(dir)) {
    return [];
  }

  const routes: RouteInfo[] = [];
  const items = fs.readdirSync(dir);

  // Skip API directory - we handle it separately
  if (dir === APP_DIR && items.includes('api')) {
    console.log('   Skipping API directory in main scan (handled separately)');
  }

  // Check for route files in this directory
  for (const file of items) {
    // Skip API directory in the main scan - we handle it separately
    if (dir === APP_DIR && file === 'api') {
      continue;
    }
    
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isFile() && ROUTE_FILES.includes(file)) {
      // Determine route type
      const type = getRouteType(file);
      
      // Get route path
      let routePath = baseRoute;
      
      // For API routes, extract HTTP methods
      let methods: string[] = ['GET']; // Default for pages
      
      if (type === 'route') {
        methods = await extractHttpMethods(fullPath);
      }
      
      routes.push({
        route: routePath,
        filePath: path.relative(APP_DIR, fullPath),
        type,
        isDirectory: false,
        namespace: getNamespace(baseRoute),
        methods,
      });
    } else if (stat.isDirectory()) {
      // Skip certain directories that shouldn't be part of routes
      if (['components', 'hooks', 'lib', 'models', 'utils', 'styles', 'controllers', 'services'].includes(file)) {
        continue;
      }
      
      // Check if it's a dynamic route parameter
      const isDynamicSegment = file.startsWith('[') && file.endsWith(']');
      const paramName = isDynamicSegment ? file.slice(1, -1) : undefined;
      
      // Determine the route path for this directory
      let routeSegment = isDynamicSegment ? `:${paramName}` : file;
      
      // Check if the directory contains route files
      const dirRoutes = await scanRoutes(
        fullPath,
        baseRoute ? `${baseRoute}/${routeSegment}` : `/${routeSegment}`
      );
      
      // Only add routes from the subdirectory, don't add the directory itself as a route
      routes.push(...dirRoutes);
    }
  }

  return routes;
}

// Helper function to get namespace from route path
function getNamespace(routePath: string): string {
  const segments = routePath.split('/').filter(Boolean);
  
  if (segments.length === 0) {
    return 'root';
  }
  
  // Check if this is an API route
  if (segments[0] === 'api') {
    return 'api';
  }
  
  // Check for app routes
  if (segments[0] === 'app') {
    if (segments.length > 1) {
      return `app/${segments[1]}`;
    }
    return 'app';
  }
  
  // First path segment is the namespace
  return segments[0];
}

// Format the route path for display
function formatRoutePath(route: RouteInfo): string {
  let path = route.route;
  
  // Clean up route path
  if (!path) {
    path = '/';
  }
  
  // For route.js/ts files, keep the path as is
  // For other files like page.js/ts, we make sure it's the actual URL path
  if (route.type !== 'route') {
    // Remove trailing /page for page routes
    if (path.endsWith('/page')) {
      path = path.slice(0, -5);
    }
    
    // Root page
    if (path === '') {
      path = '/';
    }
  }
  
  return path;
}

// Main function to generate routes
async function generateRoutes() {
  console.log('📝 Generating Next.js routes map...');
  
  // Scan for normal routes first
  console.log('🔍 Scanning app routes...');
  const appRoutes = await scanRoutes(APP_DIR);
  console.log(`   Found ${appRoutes.length} app routes`);
  
  // Scan for API routes with the enhanced scanner
  const apiRoutes = await scanApiDirectory();
  
  // Combine all routes
  const routes = [...appRoutes, ...apiRoutes];
  console.log(`📊 Total routes found: ${routes.length}`);
  
  // Create mapping of unique routes with their HTTP methods
  const uniqueRoutes: Record<string, {methods: string[], filePath: string, type: string}> = {};
  
  for (const route of routes) {
    // Skip non-endpoint files (like layouts, loading, etc.)
    if (!['page', 'route'].includes(route.type)) {
      continue;
    }
    
    const path = formatRoutePath(route);
    
    // If this path doesn't exist yet, add it
    if (!uniqueRoutes[path]) {
      uniqueRoutes[path] = {
        methods: route.methods || ['GET'],
        filePath: route.filePath,
        type: route.type
      };
    } else {
      // If it exists, merge the methods
      uniqueRoutes[path].methods = [
        ...new Set([...uniqueRoutes[path].methods, ...(route.methods || ['GET'])])
      ];
    }
  }
  
  // Convert to array for easier manipulation
  let routesArray = Object.entries(uniqueRoutes).map(([path, info]) => ({
    path,
    methods: info.methods,
    filePath: info.filePath
  }));
  
  // Group routes by namespace for display
  const routesByNamespace: Record<string, {path: string, methods: string[], filePath: string}[]> = {};
  
  for (const route of routesArray) {
    const path = route.path;
    const namespace = path.split('/').filter(Boolean)[0] || 'root';
    
    if (!routesByNamespace[namespace]) {
      routesByNamespace[namespace] = [];
    }
    
    // Check if this exact route already exists in the namespace
    const existingRouteIndex = routesByNamespace[namespace].findIndex(r => 
      r.path === route.path && JSON.stringify(r.methods.sort()) === JSON.stringify(route.methods.sort())
    );
    
    if (existingRouteIndex === -1) {
      routesByNamespace[namespace].push(route);
    } else if (route.filePath.includes('middleware')) {
      // Replace the existing route with the middleware version if it's more specific
      routesByNamespace[namespace][existingRouteIndex] = route;
    }
  }
  
  // Create output string
  let output = '# Next.js Routes Map\n';
  output += '# Generated on ' + new Date().toISOString() + '\n\n';
  output += '> Note: Routes marked with "via middleware" are rewritten or redirected by middleware.ts\n\n';
  
  // Add routes by namespace
  for (const [namespace, namespaceRoutes] of Object.entries(routesByNamespace)) {
    output += `## Namespace: ${namespace}\n\n`;
    
    // Sort routes by path
    namespaceRoutes.sort((a, b) => a.path.localeCompare(b.path));
    
    // Add each route
    for (const route of namespaceRoutes) {
      for (const method of route.methods) {
        output += `${method.padEnd(7)} ${route.path.padEnd(40)} # ${route.filePath}\n`;
      }
    }
    
    output += '\n';
  }
  
  // Write to file
  const outputPath = path.join(__dirname, '..', 'routes.md');
  fs.writeFileSync(outputPath, output);
  
  console.log(`✅ Routes map generated at ${outputPath}`);
}

// Run the script
generateRoutes()
  .catch((error) => {
    console.error('Error generating routes:', error);
    process.exit(1);
  }); 