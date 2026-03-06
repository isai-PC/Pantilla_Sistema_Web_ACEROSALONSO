const crearProducto = async () => {

  const id_categoria = document.getElementById("id_categoria").value;
  const nombre_producto = document.getElementById("nombre_producto").value;
  const precio = document.getElementById("precio").value;
  const unidad_medida = document.getElementById("unidad_medida").value;
  const calibre = document.getElementById("calibre").value;
  const metros = document.getElementById("metros").value;
  const kg = document.getElementById("kg").value;
  const color = document.getElementById("color").value;
  const ced = document.getElementById("ced").value;
  const ton = document.getElementById("ton").value;
  const cm = document.getElementById("cm").value;

  const imagenGenerica = "https://via.placeholder.com/300x200?text=Producto";

  if (!id_categoria || !nombre_producto || !precio || !unidad_medida) {
    alert("Completa los campos obligatorios");
    return;
  }

  try {

    const response = await fetch("https://repositorio-para-vercel-tawny.vercel.app/api/productos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id_categoria,
        nombre_producto,
        precio,
        unidad_medida,
        calibre,
        metros,
        kg,
        color,
        ced,
        ton,
        cm,
        ImagenesProducto: imagenGenerica
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Error servidor:", text);
      alert("❌ Error del servidor");
      return;
    }

    const data = await response.json();
    console.log(data);

    alert("✅ Producto creado correctamente");
    document.getElementById("formCrearProducto").reset();

  } catch (error) {
    console.error(error);
    alert("❌ Error real de conexión o CORS");
  }
};