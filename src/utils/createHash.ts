export async function hashArray(array) {
  const stringRepresentation = new TextEncoder().encode(JSON.stringify(array));
  const hashBuffer = await window.crypto.subtle.digest(
    "SHA-256",
    stringRepresentation
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
