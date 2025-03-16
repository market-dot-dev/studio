import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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

// Files to look for
const ROUTE_FILES = [
  'page.tsx', 'page.js', 
  'layout.tsx', 'layout.js', 
  'loading.tsx', 'loading.js', 
  'error.tsx', 'error.js', 
  'not-found.tsx', 'not-found.js',
  'route.tsx', 'route.js'
];

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

// Function to read file content and extract HTTP methods for route handlers
async function extractHttpMethods(filePath: string): Promise<string[]> {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    const methods = [];
    
    // More comprehensive check for HTTP method exports
    const methodRegex = /export\s+(async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/g;
    let match;
    while ((match = methodRegex.exec(content)) !== null) {
      methods.push(match[2]);
    }
    
    // If no specific methods found but it's a route file, check for a default handler
    if (methods.length === 0) {
      if (content.includes('export default') || content.includes('export const handler')) {
        // Default handler typically handles multiple methods
        methods.push('GET');
        methods.push('POST');
      } else {
        // Fallback to GET if we can't determine
        methods.push('GET');
      }
    }
    
    return methods;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return ['GET']; // Default to GET if there's an error
  }
}

// Function to scan directories recursively and find route files
async function scanRoutes(dir: string, baseRoute: string = ''): Promise<RouteInfo[]> {
  if (!pathExists(dir)) {
    return [];
  }

  const routes: RouteInfo[] = [];
  const items = fs.readdirSync(dir);

  // Check for route files in this directory
  for (const file of items) {
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

// Apply middleware transformations to routes based on patterns in the middleware.ts file
function applyMiddlewareTransformations(routes: {path: string, methods: string[], filePath: string}[]): {path: string, methods: string[], filePath: string}[] {
  const transformedRoutes = [...routes];
  
  // Check for middleware rules and apply transformations
  // These rules are based on the middleware.ts file
  
  // Add additional routes that are created by middleware rewrites
  routes.forEach(route => {
    // Handle maintainer-site routes
    if (route.path.startsWith('/maintainer-site')) {
      const parts = route.path.split('/');
      if (parts.length >= 3) {
        const username = parts[2];
        const remainingPath = parts.slice(3).join('/');
        transformedRoutes.push({
          path: `/${remainingPath ? remainingPath : ''}`,
          methods: route.methods,
          filePath: `${route.filePath} (via ${username}.market.dev middleware)`,
        });
      }
    }
    
    // Handle app routes transformations
    if (route.path.startsWith('/app')) {
      // app.market.dev routes
      transformedRoutes.push({
        path: route.path.replace(/^\/app/, ''),
        methods: route.methods,
        filePath: `${route.filePath} (via app.market.dev middleware)`,
      });
      
      // Customer routes
      if (route.path.startsWith('/app/c')) {
        transformedRoutes.push({
          path: route.path.replace(/^\/app\/c/, ''),
          methods: route.methods,
          filePath: `${route.filePath} (via app.market.dev for customers)`,
        });
      }
    }
    
    // Handle home routes
    if (route.path.startsWith('/home')) {
      transformedRoutes.push({
        path: route.path.replace(/^\/home/, ''),
        methods: route.methods,
        filePath: `${route.filePath} (via market.dev middleware)`,
      });
    }
  });
  
  return transformedRoutes;
}

// Main function to generate routes
async function generateRoutes() {
  console.log('📝 Generating Next.js routes map...');
  
  // Scan for routes
  const routes = await scanRoutes(APP_DIR);
  
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
  
  // Apply middleware transformations
  routesArray = applyMiddlewareTransformations(routesArray);
  
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