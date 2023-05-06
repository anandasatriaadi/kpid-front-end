export function tokenizeString(input: string, lower: boolean = false): string {
  // Split the file name into name and extension
  const [name, extension] = input.split(".");

  // Replace spaces with underscores in the name
  let nameWithUnderscores = name.replace(/ /g, "_");

  // Replace non-alphanumeric characters with hyphens in the name
  let tokenizedName = nameWithUnderscores.replace(/[^a-zA-Z0-9]/g, "-");

  // Convert to lowercase if specified
  if (lower) {
    tokenizedName = tokenizedName.toLowerCase();
  }

  // Remove any leading or trailing hyphens in the name
  tokenizedName = tokenizedName.replace(/^-+|-+$/g, "");

  // Rejoin the name and extension with a dot
  return tokenizedName + (extension ? `.${extension}` : "");
}
