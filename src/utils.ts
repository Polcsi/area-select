// Function to generate random hex color
export function RandomHexColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
