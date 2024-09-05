import { readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the directory path
const directoryPath = join(__dirname, "../pack");

// Function to extract package name and version from the tarball filename
function extractPackageInfo(tarball) {
  // Updated regex to handle versions with alpha, beta, etc.
  const regex = /^(?<name>.+)-(?<version>\d+\.\d+\.\d+(-[\w\.]+)?)\.tgz$/;
  const match = tarball.match(regex);

  if (match && match.groups) {
    const { name, version } = match.groups;
    return `${name}@${version}`; // Return package@version string
  } else {
    console.error(`Invalid tarball format: ${tarball}`);
    return null;
  }
}

// Function to get all tarballs from a directory and return package@version strings
function getAllPackages(directory) {
  let packages = [];

  const files = readdirSync(directory);
  files.forEach((file) => {
    const filePath = join(directory, file);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      // Recursively get packages from subdirectories
      packages = packages.concat(getAllPackages(filePath));
    } else if (file.endsWith(".tgz")) {
      // Extract the package name and version from the tarball file name
      const packageString = extractPackageInfo(file);
      if (packageString) {
        packages.push(packageString);
      }
    }
  });

  return packages;
}

// Function to unpublish a package from a local npm registry
function unpublishPackage(packageName) {
  try {

    // Construct the unpublish command
    const unpublishCommand = `npm unpublish ${packageName} --registry http://localhost:4873 --force`;

    console.log(`Unpublishing ${packageName}...`);

    // Execute the unpublish command
    execSync(unpublishCommand, { stdio: "inherit" });

    console.log(`${packageName} successfully unpublished.`);
  } catch (err) {
    console.error(`Failed to unpublish package for ${packageName}:`, err);
  }
}

// Example usage: Get all packages from the "../pack" directory
const allPackages = getAllPackages(directoryPath);
console.log(allPackages); // Log the array of package@version strings

allPackages.forEach((file) => {
  unpublishPackage(file);
});
