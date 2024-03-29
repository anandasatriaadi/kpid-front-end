export function tokenizeString(input: string, lower: boolean = false): string {
  // Split the file name into name and extension
  const [name, extension] = input.split(".");

  // Replace spaces with underscores in the name
  let nameWithUnderscores = name.replace(/ /g, "-");

  // Replace non-alphanumeric characters with hyphens in the name
  let tokenizedName = nameWithUnderscores.replace(/[^a-zA-Z0-9_]/g, "-");

  // Merge consecutive hyphens into a single hyphen
  tokenizedName = tokenizedName.replace(/-+/g, "-");

  // Convert to lowercase if specified
  if (lower) {
    tokenizedName = tokenizedName.toLowerCase();
  }

  // Remove any leading or trailing hyphens in the name
  tokenizedName = tokenizedName.replace(/^-+|-+$/g, "");

  // Rejoin the name and extension with a dot
  return tokenizedName + (extension ? `.${extension}` : "");
}
