const apiUrl = process.env.API_URL;
const https = require("https");

requestPromise = (url) => {
  return new Promise((resolve, reject) => {
    let body = "";
    https
      .get(url, (response) => {
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          resolve(JSON.parse(body));
        });
      })
      .on("error", (error) => reject(error));
  });
};

exports.getProducts = (query) => {
  return requestPromise(`${apiUrl}sites/MLA/search?q=${query}`);
};

exports.getProductDetail = (query) => {
  return Promise.all([
    requestPromise(`${apiUrl}items/${query}`),
    requestPromise(`${apiUrl}items/${query}/description`),
  ]);
};

exports.getProductsWithDetails = (query) => {
  return requestPromise(`${apiUrl}sites/MLA/search?q=${query}`)
    .then((response) => {
      const data = response;
      const results = data.results || []; // Obtener el array de resultados (si existe)

      // Array para almacenar las promesas de las consultas complementarias
      const complementaryRequests = [];

      // Iterar sobre cada objeto en los resultados y realizar la consulta complementaria
      for (let i = 0; i < results.length; i++) {
        const resl = results[i]; // Obtener el objeto actual del array
        if (resl.id) {
          const id = resl.id;
          const complementaryRequest = requestPromise(`${apiUrl}items/${id}`)
            .then((complementaryResponse) => {
              // Agregar la propiedad con la data secundaria al objeto actual
              resl.city_seller = complementaryResponse.seller_address.city.name;
            })
            .catch((error) => {
              console.error(
                `Error en la consulta complementaria para el ID ${id}:`,
                error
              );
              throw error;
            });

          complementaryRequests.push(complementaryRequest);
        }
      }

      // Esperar a que todas las consultas complementarias se completen
      return Promise.all(complementaryRequests).then(() => {
        // Devolver la data original con el results modificado
        return { ...data, results: results };
      });
    })
    .catch((error) => {
      console.error("Error en la primera solicitud:", error);
      throw error; // Manejo de errores
    });
};
