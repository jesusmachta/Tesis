/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("TesisBD");

// Function to verify foreign key constraint manually
async function verifyForeignKey() {
  const tipoProductoZonaCamara = await db
    .getCollection("Tipo_Producto_Zona_Camara")
    .find()
    .toArray();
  print(
    "Tipo_Producto_Zona_Camara:",
    JSON.stringify(tipoProductoZonaCamara, null, 2)
  );

  const tipoProductoDocs = await db
    .getCollection("Tipo_Producto")
    .find()
    .toArray();
  print("Tipo_Producto:", JSON.stringify(tipoProductoDocs, null, 2));

  const tipoProductoIds = tipoProductoDocs.map((doc) => doc.Id_Producto);
  print("Tipo_Producto IDs:", JSON.stringify(tipoProductoIds, null, 2));

  tipoProductoZonaCamara.forEach((doc) => {
    if (!tipoProductoIds.includes(doc.Tipo_Producto)) {
      print(
        `Foreign key constraint violation: Tipo_Producto ${doc.Tipo_Producto} in Tipo_Producto_Zona_Camara does not exist in Tipo_Producto`
      );
    }
  });
}

// Run the verification
verifyForeignKey();
